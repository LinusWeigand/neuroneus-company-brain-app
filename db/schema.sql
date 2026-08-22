-- Orakis app schema (Neon Postgres).
--
--   psql "$DATABASE_URL" -f db/schema.sql
--
-- Prefixed `app_` so this can share a database with the marketing site's
-- tables without either owning a generic name like "user" or "session".

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------
create table if not exists app_user (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  -- Stored lower-cased; the API normalises before insert and lookup so
  -- Alex@… and alex@… are the same account.
  email         text not null unique,
  name          text not null,
  -- scrypt: "scrypt$N$r$p$salt_hex$hash_hex". Parameters travel with the hash
  -- so they can be raised later without invalidating existing passwords.
  password_hash text not null
);

-- ---------------------------------------------------------------------------
-- Sessions
-- ---------------------------------------------------------------------------
-- Only a SHA-256 of the session token is stored. A leaked database therefore
-- yields no usable sessions, and sessions stay revocable server-side in a way
-- a self-contained JWT would not be.
create table if not exists app_session (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id    bigint not null references app_user (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null
);

create index if not exists app_session_user_idx on app_session (user_id);
create index if not exists app_session_expiry_idx on app_session (expires_at);

-- ---------------------------------------------------------------------------
-- Login throttle
-- ---------------------------------------------------------------------------
-- Salted hash of the client IP, never the IP itself: personal data under GDPR,
-- and "same caller as before" is all a rate limiter needs to know.
create table if not exists app_login_attempt (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  client_hash text not null,
  -- Which throttle this row belongs to. Login and password-reset abuse are
  -- counted separately: sharing a counter lets either one starve the other.
  kind        text not null default 'login'
);

alter table app_login_attempt add column if not exists kind text not null default 'login';

create index if not exists app_login_attempt_lookup_idx
  on app_login_attempt (client_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- Linked OAuth identities
-- ---------------------------------------------------------------------------
-- One row per provider identity bound to an account. Matching happens on the
-- provider's immutable subject, never on email: with a multitenant Microsoft
-- app anyone can assert an arbitrary email, so email is only ever used once,
-- to create this link, and only when the provider vouches it is verified.
--
-- `tenant` is Microsoft's tid ('' for Google). Kept NOT NULL with an empty
-- default because Postgres treats NULLs as distinct in unique constraints,
-- which would let duplicate links slip in.
create table if not exists app_oauth_identity (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id    bigint not null references app_user (id) on delete cascade,
  provider   text not null,
  subject    text not null,
  tenant     text not null default '',
  unique (provider, subject, tenant)
);

create index if not exists app_oauth_identity_user_idx on app_oauth_identity (user_id);

-- ---------------------------------------------------------------------------
-- Password reset tokens
-- ---------------------------------------------------------------------------
-- Only a SHA-256 of the token is stored, so a database leak cannot be used to
-- reset anyone's password. Rows are single-use (used_at) and short-lived.
create table if not exists app_password_reset (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id    bigint not null references app_user (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at    timestamptz
);

create index if not exists app_password_reset_user_idx on app_password_reset (user_id);
