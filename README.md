<div align="center">

# Neuroneus — Application Runtime

**The tenant-isolated substrate the company brain runs on.**

`app.limitless-stack.com`

<sub>React 19 · TypeScript 6 · Vite 7 · Vercel Functions · Neon Postgres · pgvector</sub>

</div>

---

## What this repository is

Neuroneus is a *company brain*: a system that holds what an organisation knows —
projects, tasks, decisions, documents, the context around them — and exposes it
to language models as structured, retrievable state rather than as scattered
prose. The thesis is in [`MANIFESTO.pdf`](./MANIFESTO.pdf).

This repository is the **runtime**: the authenticated application, the data
boundary it enforces, and the retrieval layer the agent is being built on. The
marketing site is a separate deployment.

The design constraint that shapes everything here is single-sentence:

> **A system that answers questions from a company's private corpus is one
> forgotten `where` clause away from answering them from someone else's.**

Every architectural decision below follows from taking that seriously. An agent
inherits the isolation properties of the store beneath it and multiplies them — a
model handed a row will repeat it to whoever is listening. So the boundary is
built, and *proved*, before the intelligence is layered on top.

---

## Table of contents

| §   | Section                                           |
| --- | ------------------------------------------------- |
| 1   | [Architecture](#1-architecture)                   |
| 2   | [Authentication](#2-authentication)               |
| 3   | [The bundle boundary](#3-the-bundle-boundary)     |
| 4   | [Tenant isolation](#4-tenant-isolation)           |
| 5   | [Retrieval](#5-retrieval)                         |
| 6   | [Agent surface](#6-agent-surface)                 |
| 7   | [Verification](#7-verification)                   |
| 8   | [Running it](#8-running-it)                       |

---

## 1. Architecture

```
                    ┌──────────────────────────────────────────┐
  browser           │  entry chunk — 270.7 KB raw / 86.1 KB gz │
                    │  Login · ResetPassword only              │
                    └────────────────────┬─────────────────────┘
                                         │  authenticated
                    ┌────────────────────▼─────────────────────┐
                    │  lazy chunks — Dashboard · Goals · Team  │
                    │  WorkspaceProvider → useWorkspace()      │
                    └────────────────────┬─────────────────────┘
                                         │  GET /api/data
                                         │  Cache-Control: no-store, private
  ┌──────────────────────────────────────▼──────────────────────────────────┐
  │  Vercel Functions (Node, NodeNext ESM)                                  │
  │                                                                         │
  │   api/_lib/auth.ts ──── currentUser() ── the sole minter of CompanyId   │
  │   api/_lib/db.ts ────── Neon HTTP driver, sql.transaction()             │
  │   api/_data/ ────────── content that must never reach the bundle        │
  └──────────────────────────────────────┬──────────────────────────────────┘
                                         │  LOCAL GUC: app.company_id
  ┌──────────────────────────────────────▼──────────────────────────────────┐
  │  Neon Postgres · FORCE ROW LEVEL SECURITY · pgvector(1024)              │
  └─────────────────────────────────────────────────────────────────────────┘
```

**Size of the tree.** 5,102 lines across 48 source files.

| Area       | Lines | Files | Role                                              |
| ---------- | ----: | ----: | ------------------------------------------------- |
| `src/`     | 3,096 |    31 | React application, code-split by route            |
| `api/`     | 1,716 |    13 | Serverless functions, auth, data boundary         |
| `scripts/` |   194 |     3 | Migrations, user provisioning, build invariants   |
| `db/`      |    96 |     1 | Schema, with the reasoning inline                 |

**Stack notes that are load-bearing, not incidental.**

- **Vite is pinned to 7.** Vite 8's rolldown native binding fails to install
  through an npm optional-dependency resolution bug. Pinned deliberately;
  documented so it is not "fixed" by someone upgrading casually.
- **The API is NodeNext.** Imports carry explicit `.js` extensions. Bundling for
  a local test hides violations; `tsc -b` catches them.
- **Handlers use `(req: VercelRequest, res: VercelResponse)`.** Returning a
  web-standard `Response` makes the request hang with no error surfaced.
- **Tailwind JIT only emits keyframes referenced by an `animate-*` utility.**
  Keyframes driven from hand-written CSS are silently dropped, which is why they
  live in `index.css`.

---

## 2. Authentication

Built from `node:crypto` primitives rather than a framework, because the
parameters are the interesting part and a framework hides them.

### Password storage

```
scrypt$16384$8$1$<salt_hex>$<hash_hex>
```

`N = 16384, r = 8, p = 1`, 64-byte derived key, 16-byte random salt.

scrypt is **memory-hard** — the cost parameter `N` forces 
`N · r · 128 ≈ 16 MiB` of working memory per evaluation, which is what denies an
attacker the ~10³–10⁴× advantage a GPU or ASIC otherwise has over a CPU on a
purely compute-bound KDF. Against bcrypt at equivalent CPU time, the memory floor
is the whole point.

**The parameters travel with the hash.** `N`, `r` and `p` are parsed back out of
the stored string at verification time rather than read from a constant. This
makes the work factor a per-row property, so it can be raised later without
invalidating a single existing password — the alternative is a migration that
cannot be performed, because the plaintext is gone by construction.

### Two timing invariants

Both of these are the kind of defect that passes every functional test.

**1 — Comparison is constant-time.** `timingSafeEqual`, never `===`. A
short-circuiting compare leaks *how many leading bytes matched*, which converts
a 2⁵¹² preimage search into 64 sequential byte-at-a-time searches.

**2 — A missing account costs the same as a real one.** `burnTime()` performs a
full scrypt evaluation against a throwaway salt when no user row exists. Without
it, the ~100 ms asymmetry between "hashed a password" and "returned early" is a
free account-enumeration oracle, readable over the network by anyone with a
wordlist.

### Sessions

Opaque 32-byte `base64url` tokens. **Only the SHA-256 is persisted.**

| Property                | Value                                      |
| ----------------------- | ------------------------------------------ |
| Entropy                 | 256 bits                                   |
| Stored form             | SHA-256 digest                             |
| Lifetime                | 30 days                                    |
| Cookie flags            | `HttpOnly` · `SameSite=Lax` · `Secure`     |
| Revocable server-side   | Yes                                        |
| Expiry pruning          | Inline on read; no scheduled job           |

A leaked database therefore yields **no usable sessions** — the stored digest is
not a bearer token. This is also why sessions are opaque rather than JWTs: a
self-contained token cannot be revoked before its expiry without maintaining
exactly the server-side table a JWT is meant to avoid.

`Secure` is set from `x-forwarded-proto` rather than unconditionally, so the
cookie still functions against a local HTTP dev server. TLS terminates upstream
at Vercel.

### OAuth — Google and Microsoft

**Sign-in for existing accounts only. No auto-provisioning.** A deliberate
restriction: auto-provisioning on an OAuth callback means anyone who can assert
an email at any identity provider can mint an account in someone's tenant.

**Identities match on the provider's immutable subject, never on email.**

The Microsoft case is the sharp one. With a multitenant application, *any* tenant
administrator can set *any* string as a user's email claim, including one
belonging to a domain they do not control. Microsoft signals whether the claim
was actually verified through the optional `xms_edov` claim — and the failure
mode that matters is that **a missing claim is indistinguishable from a false
one**, so absence must be treated as untrusted. Email is consulted exactly once,
at link creation, and only when the provider vouches for it.

`tenant` (Microsoft's `tid`, `''` for Google) is `NOT NULL DEFAULT ''` because
Postgres treats `NULL`s as distinct inside a `UNIQUE` constraint — nullable, it
would silently admit duplicate identity links.

### Password reset

Single-use SHA-256-stored token · 1-hour expiry · **revokes every session on
success**.

The endpoint returns an identical response whether or not the address exists.
That sameness is a feature, and it has an operational cost worth stating: when
`RESEND_API_KEY` is unset, a reset silently does nothing and the user still sees
"check your inbox". The real reason appears only in the function logs. Anti-
enumeration and observability are in genuine tension here; the trade was made
knowingly.

### Rate limiting

Counters key on `SHA-256(THROTTLE_SALT ‖ client_ip)` — **never the raw IP**,
which is personal data under GDPR. The salt is not decorative: the IPv4 space is
2³² and an unsalted digest is brute-forced exhaustively in seconds.

Login and password-reset attempts are counted under separate `kind` values.
Sharing one counter lets either flow starve the other — an attacker who wants to
lock an address out of *login* simply spends the budget on *resets*.

---

## 3. The bundle boundary

The property: **workspace content must never reach the JavaScript bundle.**

It is worth spelling out why this needed machinery. The rule is invisible in code
review. A stray `import { MEMBERS } from './data'` compiles, type-checks, renders
correctly, and passes every test — while serving the entire workspace to anyone
who loads the *login page*, signed in or not, human or crawler.

That was the actual prior state: a single 385 KB entry chunk in which
`grep "Alex Morgan" dist/assets/index-*.js` hit.

### How it is enforced

**Structurally.** The four `src/features/*/data.ts` files were split, not
deleted. Presentation constants, palettes, formatters and types stayed client-
side as `view.ts`; content moved to `api/_data/workspace.ts` and arrives only
through `useWorkspace()`. Renaming the survivors makes *"is this file allowed to
contain content?"* answerable from the filename, and turns a stray
`from './data'` into a compile error rather than a silent regression.

**Mechanically.** `scripts/check-bundle.mjs` runs as the last step of
`npm run build` and greps `dist/` for sentinel strings that exist only in the
sample corpus. A hit exits non-zero and fails the build.

```bash
npm run build    # tsc -b && vite build && node scripts/check-bundle.mjs
```

A grep is a weak check in general. Against *known sentinel strings* it is exactly
right, and it is the only thing holding this boundary — **replacing the sample
content means replacing the sentinel list.** Verified by deliberately leaking one
string and confirming exit code 1.

### Measured result

| Metric                        | Before        | After                    |
| ----------------------------- | ------------- | ------------------------ |
| Entry chunk (raw)             | 385 KB        | **270.7 KB**             |
| Entry chunk (gzip)            | —             | **86.1 KB**              |
| Chunks                        | 1             | **7** (323.7 KB total)   |
| Workspace content in `dist/`  | Yes           | **None**                 |
| `modulepreload` for authed    | Yes           | **None**                 |

Routes are lazy. `Login` and `ResetPassword` are the only components in the entry
chunk; `Dashboard` (7.1 KB), `Goals` (8.9 KB) and `Team` (24.2 KB) load after
authentication.

`WorkspaceProvider` is mounted in `AuthedApp.tsx` **below** the auth check, not
at the root. Mounted above it, every login-page view fires an unauthenticated
`/api/data` — a 401 per page load, and a free liveness oracle for the host.

---

## 4. Tenant isolation

> *Specified in `PLAN-tenancy.md`. Phase 1 is shipped; phases 2–4 are designed,
> not yet built. Marked as such deliberately — see the note at the end of this
> file.*

The rule everyone writes down is "always add `where company_id = $1`". It is one
forgotten clause from a breach, and the omission is invisible in review because
the query still returns plausible rows.

So: **three layers, none of which trusts the one beneath it.**

### Layer 1 — the tenant id cannot be typed by hand

```ts
export type CompanyId = number & { readonly __brand: 'CompanyId' };
```

A branded nominal type over `number`. The **only** function that mints one is
`currentUser()`, from the session. A plain `number` — out of `req.query`,
`req.body`, a JSON payload, anywhere the caller controls — will not type-check at
a repository call site.

A single module, `api/_lib/workspace-repo.ts`, is the only place that composes
SQL against content tables, and every function takes `CompanyId` first. This
converts *"did you remember to scope it?"* from a review question into a compile
error — the highest-leverage change in the design, because it moves the check
from human attention to the type system.

### Layer 2 — Postgres refuses to return the rows

```sql
alter table app_goal enable row level security;
alter table app_goal force  row level security;   -- the owner bypasses without this

create policy tenant_isolation on app_goal
  using      (company_id = app_current_company())
  with check (company_id = app_current_company());
```

Two details decide whether this is real security or decoration:

- **`FORCE` is not optional.** Neon's default role owns the tables, and table
  owners bypass RLS entirely. Better still, run as a non-owner `app_runtime`
  role holding only the grants it needs and no `BYPASSRLS`.
- **`app_current_company()` raises; it does not return `NULL`.** A policy reading
  `current_setting('app.company_id', true)` fails *closed*, which sounds ideal —
  but it presents to the customer as *"your workspace is empty"* rather than as
  an error. Raising turns a misconfigured request into a 500 in the logs instead
  of a silent blank screen. Failing closed and failing *visibly* are different
  properties, and both are wanted.

**The Neon-specific trap, which inverts the fix into the vulnerability.**
`api/_lib/db.ts` uses `neon()`, the HTTP driver: every statement is an
independent request, potentially on a different backend connection.

Therefore `set_config('app.company_id', $1, false)` — session-scoped — is
**actively dangerous here**. The setting can outlive the request on a pooled
connection and be observed by the next one. *That is a cross-tenant leak
installed by the code written to prevent cross-tenant leaks.*

The correct form is `sql.transaction([...])`: a fixed statement array sent as one
non-interactive transaction, with

```sql
select set_config('app.company_id', $1, true)   -- true = LOCAL, dies with the txn
```

as statement zero. `sql.transaction()` cannot interleave JavaScript between
statements — `/api/data` is a fixed set of ~10 queries and fits exactly.
Genuinely interactive work needs the WebSocket `Pool` and a real `BEGIN`/`COMMIT`.

### Layer 3 — a test that would actually catch it

Design is not evidence. Two companies are seeded with sentinel strings
(`ZZ-ALPHA-CANARY`, `ZZ-BETA-CANARY`) and CI asserts:

1. For every content table, with `app.company_id` set to **A**, `count(*)` over
   **B**'s rows is `0`.
2. Every `/api/data` response for a session in **A** contains no **B** sentinel.
3. Every write endpoint, given **B**'s id while authenticated as **A**, returns
   **404 — not 403**, which would confirm the row exists.

Point 3 is the one usually missed: the status code is itself an information
channel. The canary suite is what turns the preceding two layers from a design
into a *property*.

Writes are scoped on both axes — `update … where id = $1 and company_id = $2` —
because the classic IDOR is an unscoped update by primary key.

---

## 5. Retrieval

> *Designed, not yet built.* The schema and the failure analysis are settled;
> the implementation lands after the isolation canaries are green.

```sql
create table app_doc_chunk (
  id         bigint generated always as identity primary key,
  company_id bigint not null references app_company (id) on delete cascade,
  entry_id   bigint not null,
  ord        int    not null,
  text       text   not null,
  embedding  vector(1024),
  foreign key (company_id, entry_id) references app_doc_entry (company_id, id)
);
```

pgvector on Neon. RLS applies to this table exactly as to any other — the vector
index is not a side door around the boundary in §4.

### Filtered ANN is the subtle failure, and it is worth the space

Consider the obvious query:

```sql
select text from app_doc_chunk
where company_id = $1
order by embedding <=> $2
limit 10;
```

An HNSW index is a **greedy graph traversal, not an exhaustive scan**. It
descends a navigable small-world graph, maintaining a candidate list of size
`ef_search`, and returns what it found. The `where` clause is applied *after*
that traversal.

So if the top `ef_search` candidates in the global embedding space happen to
belong to *other* tenants, the filter removes them and the query returns **fewer
than 10 rows — or zero — while the tenant genuinely has excellent matches.**

The severity is structural: **recall degrades as a function of tenant share.** A
customer holding 1% of total chunks sees roughly 1% of the candidate list survive
filtering. Recall collapses precisely for the smallest tenants, and it does so
*silently* — no error, no timeout, no log line. It presents as "the search is a
bit weak for this customer", which is a **relevance complaint masking a
correctness bug.** That misattribution is why this is written down before the
first embedding is computed rather than debugged a quarter later.

Two sound fixes:

| Approach                    | Mechanism                                                       | Cost                                     |
| --------------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| **Iterative index scan**    | pgvector ≥ 0.8, `hnsw.iterative_scan = strict_order` — resume the traversal until `LIMIT` is satisfied post-filter | Unbounded-ish latency tail on sparse filters |
| **Partition by tenant**     | `partition by list (company_id)` — one index per tenant, so the filter is satisfied by construction | Index-per-tenant overhead; DDL on signup |

Partitioning is the stronger guarantee: it makes the filter a *property of which
index is searched* rather than a predicate applied to results, which removes the
failure mode instead of mitigating it.

If a hosted vector store is ever substituted: **one namespace per company, never
a shared index with a metadata filter** — the same analysis applies, with less
visibility into it.

---

## 6. Agent surface

> *Designed, not yet built.*

Ordering is the entire argument. An agent added before §4 holds inherits every
gap in the store and amplifies it, because a language model will faithfully
repeat a row it was handed.

### The one rule

**The model never names the tenant.**

Tools take no company parameter — not an optional one, not a defaulted one. The
executor closes over the `CompanyId` resolved from the session:

```ts
const tools = makeTools(user.companyId);   // bound once, per request
```

The reasoning is adversarial and specific. A document in the corpus can contain
text. That text can contain instructions. If a tool signature exposes a tenant
argument, **prompt injection inside a document becomes a cross-tenant read** —
the model is persuaded to pass a different id, and the data layer obliges,
because the request is well-formed. If the parameter does not exist, the same
injected instruction has nothing to act on. The capability is removed rather than
guarded.

This is stated as a rule precisely because the pressure to add the parameter
"for flexibility" arrives later, from someone who will not re-derive this.

Consequence: **the agent does not write SQL.** It gets a fixed vocabulary —
`search_docs`, `get_goal`, `list_tasks_for_member` — each backed by the same
`workspace-repo.ts` functions the UI calls. A static query set keeps the
`sql.transaction()` pattern from §4 valid and introduces **no new data path to
audit.** Every query the agent can cause to run is a query that already existed
and was already reviewed.

---

## 7. Verification

The repository's standing bias is that a claim without a measurement is not a
claim. Representative cases:

**The GoalsView rewrite.** 325 lines of goal cards written as literal JSX became
a 99-line component rendering from data — a 70% reduction on the largest single
piece of phase 1. Correctness was established by rendering the old and new
components and **diffing the output trees: 373 elements against 373, structure
identical.** Not "it looks the same".

**The bundle invariant.** Verified by deliberately leaking a sentinel and
confirming `npm run build` exits 1. A check that has never been observed to fail
has not been tested.

**Data-shape drift, caught by reading rather than by an outage.**
`api/_data/workspace.ts` carried a `pinned` field the client `Entry` type did not
have. Two hand-maintained copies of the same content had already diverged —
independent evidence for collapsing to one source, found while verifying
something else.

**Precision preserved where rounding would have destroyed it.** `GOAL_CARDS`
stores `progress: { done, total, percent }` rather than a pre-formatted
`"5/12 tasks · 50%"` string. 5/12 is not 50%, and the original meant it. Storing
the components keeps the discrepancy representable instead of silently
normalising it away.

**Anchors that do not decay.** Goal due dates are `dueDays` offsets resolved
against the current date, not absolute dates frozen at a prerender's 2026-08-03
epoch. Demo tenants carry a `demo_epoch` for read-time date shifting.

---

## 8. Running it

```bash
npm install
npm run dev
```

```bash
node scripts/migrate.mjs        # apply db/schema.sql (idempotent)
```

```bash
node scripts/create-user.mjs    # provision an account, prompts for the password
```

```bash
npm run build                   # tsc -b && vite build && bundle invariant check
```

### Environment

`VITE_*` variables are **inlined into the public bundle at build time** — a
secret in one is a published secret.

| Variable                                        | Purpose                          |
| ----------------------------------------------- | -------------------------------- |
| `VITE_MARKETING_URL`, `VITE_CONTACT_EMAIL`      | Public, build-time               |
| `DATABASE_URL`                                  | Neon Postgres                    |
| `THROTTLE_SALT`                                 | Rate-limit IP hashing (§2)       |
| `GOOGLE_CLIENT_ID` / `_SECRET`                  | OAuth                            |
| `MICROSOFT_CLIENT_ID` / `_SECRET`               | OAuth                            |
| `RESEND_API_KEY`, `MAIL_FROM`                   | Password-reset delivery          |

A note on `.gitignore`: keep the `!.env.example` negation **after** `.env*`, or
it is overridden and the example file stops being tracked.

---

## Status

Honest accounting, because the alternative is discovered rather than disclosed.

| Component                                  | State                        |
| ------------------------------------------ | ---------------------------- |
| Authentication, sessions, OAuth, reset      | **Shipped**                  |
| Bundle boundary + build-time invariant      | **Shipped**, phase 1 verified |
| Route-level code splitting                  | **Shipped**, measured        |
| Content → Neon, per company (phase 2)       | Specified                    |
| Enforced isolation: brand, RLS, canaries (3)| Specified                    |
| Retrieval + agent (phases 4–5)              | Specified                    |

The isolation and retrieval design is specified in full in an internal design
document — four independently shippable phases, each with the paths not taken and
what each one would cost to reverse. Sections 4 through 6 above are its summary.

Specified-not-built is marked as such throughout this file, deliberately. A
README that reads as a feature list cannot be checked against the tree; one that
distinguishes shipped from designed can be, and the distinction is the point.

---

<div align="center">
<sub>Built in Germany. Data resident in Frankfurt.</sub>
</div>
