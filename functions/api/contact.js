const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const jsonResp = (status, obj) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/*
  Honeypot protection — why this exists and why it's shaped the way it is.

  The `website` field is hidden from real users (positioned off-screen,
  aria-hidden, tabindex=-1, autocomplete=off) and is not something a human
  ever fills in. Form-filling bots that fill every input they can see will
  set a value on it; real visitors never will.

  When the honeypot fires, we return HTTP 200 with ok:true — exactly the
  same response a real user gets — and do NOT send any email. The bot has
  no way to tell that its submission was silently dropped, so it doesn't
  try to adapt (rewriting the request, rotating IPs, filling fewer fields).
  Returning 400/403 would teach the bot network something; returning 200
  wastes their time.

  We deliberately don't use `_honey` as the field name. That string is a
  well-known honeypot signature used by Formspree and similar services, and
  sophisticated bots specifically skip inputs named `_honey` / `_gotcha` to
  avoid tripping these traps. `website` is an innocuous label that looks
  like a legit optional field, so naive bots fill it in happily. If you
  ever rename this field in the frontend, rename it here too — the two
  must match for the trap to function.
*/
export const onRequestPost = async ({ request, env }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResp(400, { ok: false, error: 'invalid_json' });
  }

  const { name = '', email = '', message = '', website = '' } = body || {};

  // Honeypot — return success without doing anything.
  if (typeof website === 'string' && website.trim() !== '') {
    return jsonResp(200, { ok: true });
  }

  // Server-side validation. Never trust the client.
  const nameTrim = String(name).trim();
  const emailTrim = String(email).trim().toLowerCase();
  const messageTrim = String(message).trim();

  if (!nameTrim || nameTrim.length > MAX_NAME) {
    return jsonResp(400, { ok: false, error: 'invalid_name' });
  }
  if (!emailTrim || emailTrim.length > MAX_EMAIL || !EMAIL_RE.test(emailTrim)) {
    return jsonResp(400, { ok: false, error: 'invalid_email' });
  }
  if (messageTrim.length > MAX_MESSAGE) {
    return jsonResp(400, { ok: false, error: 'invalid_message' });
  }

  const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SENDGRID_TO_EMAIL } = env;
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !SENDGRID_TO_EMAIL) {
    console.error('SendGrid env vars missing');
    return jsonResp(500, { ok: false, error: 'server_misconfigured' });
  }

  const sgSend = (payload) =>
    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

  const notification = {
    personalizations: [
      {
        to: [{ email: SENDGRID_TO_EMAIL }],
        subject: `New demo request from ${nameTrim}`,
      },
    ],
    from: { email: SENDGRID_FROM_EMAIL, name: 'Neurosight Contact Form' },
    reply_to: { email: emailTrim, name: nameTrim },
    content: [
      {
        type: 'text/plain',
        value:
          `Name: ${nameTrim}\n` +
          `Email: ${emailTrim}\n\n` +
          `${messageTrim || '(no message)'}\n`,
      },
      {
        type: 'text/html',
        value:
          `<p><strong>Name:</strong> ${esc(nameTrim)}</p>` +
          `<p><strong>Email:</strong> ${esc(emailTrim)}</p>` +
          `<p><strong>Message:</strong></p>` +
          `<p style="white-space:pre-wrap">${esc(messageTrim) || '<em>(no message)</em>'}</p>`,
      },
    ],
  };

  try {
    const notifRes = await sgSend(notification);
    if (!notifRes.ok) {
      const errBody = await notifRes.text().catch(() => '');
      console.error('SendGrid notification failed', notifRes.status, errBody);
      return jsonResp(500, { ok: false, error: 'send_failed' });
    }
  } catch (err) {
    console.error('SendGrid notification fetch threw', err);
    return jsonResp(500, { ok: false, error: 'send_failed' });
  }

  return jsonResp(200, { ok: true });
};
