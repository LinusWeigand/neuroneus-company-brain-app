/**
 * Outbound links to the marketing site.
 *
 * Read from the environment because the domain is expected to change; only the
 * fallback needs editing if the variable is unset. Vite inlines VITE_* at build
 * time, so changing this in Vercel requires a redeploy to take effect.
 */
export const MARKETING_URL =
  import.meta.env.VITE_MARKETING_URL?.replace(/\/$/, '') ?? 'https://www.limitless-stack.com';

export const SIGN_UP_URL = `${MARKETING_URL}/pricing`;
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'info@neuron.eus';
