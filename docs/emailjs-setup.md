# Contact form — EmailJS setup (about 10 minutes, free)

The contact section on `/build` and `/books` is a tap-through form. When a visitor
sends it, EmailJS emails the request straight to you — no server, no database.

Until you finish the steps below the form still works: it opens the visitor's own
email app with the whole request already written, addressed to you.

---

## 1. Create the account and connect Gmail

1. Sign up at **emailjs.com** (the free plan gives 200 emails a month).
2. **Email Services → Add New Service → Gmail** → connect your Gmail account.
3. Copy the **Service ID** (looks like `service_ab12cd3`).

## 2. Create the template you receive

**Email Templates → Create New Template.** Fill in the fields:

| Field | Value |
| --- | --- |
| Subject | `{{title}}` |
| To Email | your Gmail address |
| From Name | `{{name}} via Portfolio` |
| Reply To | `{{reply_to}}` |

Open the **Content** editor, switch to **Code** (`<>`), and paste:

```html
<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
  <p style="margin:0;color:#64748b;font-size:13px">{{request_type}} · Ref {{ref}} · {{submitted_at}}</p>
  <h2 style="margin:6px 0 18px">{{name}} <span style="color:#64748b;font-weight:400">— {{company}}</span></h2>

  {{{answers_html}}}

  <h3 style="margin:24px 0 8px">Contact</h3>
  <p style="margin:0;line-height:1.7">
    Email: <a href="mailto:{{email}}">{{email}}</a><br />
    WhatsApp: {{whatsapp}} — <a href="{{whatsapp_link}}">open chat</a><br />
    Prefers: <b>{{preferred_contact}}</b>
  </p>

  <h3 style="margin:24px 0 8px">Message</h3>
  <p style="margin:0;white-space:pre-line">{{message}}</p>

  <p style="margin-top:28px;color:#94a3b8;font-size:12px">Sent from {{page}} ({{lang}})</p>
</div>
```

> Triple braces in `{{{answers_html}}}` are intentional: they insert the answers
> table as HTML. Everything else uses double braces, so it's escaped.

Save, and copy the **Template ID** (looks like `template_xy98zw7`).

## 3. Turn on the customer's confirmation (auto-reply)

1. Create a **second template** (for example "Portfolio — auto-reply"):

   | Field | Value |
   | --- | --- |
   | Subject | `Got your request — ref {{ref}}` |
   | To Email | `{{email}}` |
   | From Name | `Ahmed` |
   | Reply To | your Gmail address |

   Content:

   ```html
   <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
     <p>Hi {{name}},</p>
     <p>Thanks for reaching out about <b>{{request_type}}</b>. I've got your request and
     I'll get back to you within one working day with a clear plan and a quote.</p>
     <p style="margin:20px 0 8px;color:#64748b">Here's what you sent:</p>
     {{{answers_html}}}
     <p style="margin-top:20px">Your reference is <b>{{ref}}</b> — just reply to this email
     if you'd like to add anything.</p>
     <p>— Ahmed<br /><span style="color:#64748b">Dubai, UAE</span></p>
   </div>
   ```

2. Go back to the **first** template → **Auto-Reply** tab → choose this template → Save.

The auto-reply only goes out when the visitor left an email. WhatsApp-only
requests still reach you; you reply on WhatsApp using the "open chat" link.

## 4. Paste the IDs into the site

Copy your **Public Key** from **Account → General**, then edit `data/emailjs.ts`:

```ts
export const EMAILJS = {
  serviceId: "service_ab12cd3",
  templateId: "template_xy98zw7",
  publicKey: "AbCdEf123456789",
};
```

These three values are meant to be public. **Never** put the *Private Key* in the site.

## 5. Lock it to your domain (recommended)

**Account → Security**:

- **Allowed origins / domains:** add `https://almarsoomi.github.io` (and any
  custom domain). Requests from anywhere else are refused.
- Keep **"Use Private Key"** off. It's only for server-side use.

The form also has its own spam protection: a hidden honeypot field, a 15-second
rate limit per browser, and EmailJS's headless-browser block.

---

## What the form sends (template variables)

| Variable | Example |
| --- | --- |
| `title` | `New request: Bookkeeping — Sara Ahmed` |
| `request_type` | `Website / Web app` or `Bookkeeping` |
| `name`, `company` | `Sara Ahmed`, `—` if empty |
| `email`, `reply_to` | the visitor's email (empty if they only left WhatsApp) |
| `whatsapp` | as typed, e.g. `050 123 4567` |
| `whatsapp_link` | `https://wa.me/971501234567` (local UAE numbers get +971 added) |
| `preferred_contact` | `Email` / `WhatsApp` / `Either` |
| `message` | free text, `—` if empty |
| `answers` | plain-text list of every choice |
| `answers_html` | the same list as an HTML table |
| `ref` | short reference, e.g. `AH-K3Q9ZT` |
| `lang`, `page`, `submitted_at` | `en`/`ar`, page URL, Dubai time |

The questions and options are in `contactForm` in `data/portfolio.ts` (English)
and `data/portfolio.ar.ts` (Arabic). Change the wording there; no component
changes needed.
