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
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY",
};

export const emailjsReady = !Object.values(EMAILJS).some((v) => v.startsWith("YOUR_"));
