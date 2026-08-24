/**
 * Outbound email via Resend.
 *
 * Sending is a hard dependency for password resets — unlike lead notifications
 * on the marketing site, a silent failure here leaves someone locked out with
 * no idea why. So this throws rather than swallowing, and the caller decides.
 */
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export function mailFrom(): string {
  // Must be an address at a domain verified in Resend, or the API rejects it.
  return process.env.MAIL_FROM ?? 'Neuroneus <noreply@neuron.eus>';
}

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: mailFrom(), to: [to], subject, text, ...(html ? { html } : {}) }),
  });

  if (!res.ok) {
    throw new Error(`resend rejected the message (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
}

/** Plain-text and HTML bodies for a reset link. Kept together so the two
 *  versions cannot drift apart. */
export function resetEmail(name: string, url: string, minutes: number) {
  const text = [
    `Hi ${name},`,
    '',
    'You asked to reset your Neuroneus password. Open the link below to choose a new one:',
    '',
    url,
    '',
    `This link works once and expires in ${minutes} minutes.`,
    '',
    "If you didn't ask for this, you can ignore this email — your password has not changed.",
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#171717">
      <p>Hi ${escapeHtml(name)},</p>
      <p>You asked to reset your Neuroneus password. Choose a new one here:</p>
      <p><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#171717;color:#fff;text-decoration:none">Reset your password</a></p>
      <p style="color:#6b7280;font-size:13px">This link works once and expires in ${minutes} minutes.</p>
      <p style="color:#6b7280;font-size:13px">If you didn't ask for this, you can ignore this email — your password has not changed.</p>
    </div>`;

  return { text, html };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
