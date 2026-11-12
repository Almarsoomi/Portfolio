/**
 * EmailJS settings for the contact form (see docs/emailjs-setup.md).
 *
 * All three values are designed to be public — EmailJS only accepts requests
 * from the domains you allow in its dashboard (Account → Security), so it's
 * safe to keep them in the site's code.
 *
 * Until the placeholders are replaced, the form still works: it opens the
 * visitor's email app with the whole request already written.
 */
export const EMAILJS = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY",
};

export const emailjsReady = !Object.values(EMAILJS).some((v) => v.startsWith("YOUR_"));
