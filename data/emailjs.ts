/**
 * EmailJS settings for the contact form (see docs/emailjs-setup.md).
 *
 * All three values are designed to be public — EmailJS only accepts requests
 * from the domains you allow in its dashboard (Account → Security), so it's
 * safe to keep them in the site's code.
 *
 * Your own email address is never in the site's code: EmailJS knows where to
 * deliver from the template you set up in its dashboard. Until the
 * placeholders are replaced, the form can't send (it shows a "try again" note).
 */
export const EMAILJS = {
  serviceId: "service_8x2cshw",
  // "Contact Us" template. Its Auto-Reply tab sends the customer's
  // confirmation (template_1j1f3cu) on its own — no ID needed here.
  templateId: "template_j1m5d9q",
  publicKey: "fUyXd2Yq8K1hrSYLQ",
};

/** Email accent colours per path, matching the site's themes. */
export const EMAIL_ACCENTS = {
  build: { accent: "#22d3ee", accent2: "#3b82f6" },
  books: { accent: "#fbbf24", accent2: "#10b981" },
} as const;

export const emailjsReady = !Object.values(EMAILJS).some((v) => v.startsWith("YOUR_"));
