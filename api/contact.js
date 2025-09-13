const { Resend } = require('resend');
const nodemailer = require('nodemailer');

// Small helper to send consistent JSON
function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

/**
 * Vercel Serverless Function: POST /api/contact
 * Expects JSON body: { name, email, subject, message }
 */
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method Not Allowed' });
  }

  const contentType = req.headers['content-type'] || '';

  // Support both already-parsed bodies and raw stream bodies
  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      const raw = typeof body === 'string' ? body : await readRawBody(req);
      body = raw && contentType.includes('application/json') ? JSON.parse(raw) : {};
    } catch (e) {
      return json(res, 400, { error: 'Invalid JSON body' });
    }
  }

  const { name, email, subject, message } = body || {};

  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedSubject = (subject || '').trim();
  const trimmedMessage = (message || '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
    return json(res, 400, { error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return json(res, 400, { error: 'Please provide a valid email address.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_FROM_EMAIL || 'imahrous13@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || (smtpUser ? smtpUser : 'Portfolio Contact <onboarding@resend.dev>');
  const isDryRun = String(process.env.DRY_RUN || '').toLowerCase() === 'true' || process.env.DRY_RUN === '1';

  if (!resendApiKey && !(smtpHost && smtpPort && smtpUser && smtpPass) && !isDryRun) {
    return json(res, 500, { error: 'No email provider configured. Set RESEND_API_KEY or SMTP_* envs.' });
  }
  if (!toEmail) {
    return json(res, 500, { error: 'Missing CONTACT_TO_EMAIL' });
  }

  const emailPayload = {
    from: fromEmail,
    to: Array.isArray(toEmail) ? toEmail : [toEmail],
    subject: `[Portfolio] ${trimmedSubject}`,
    text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
           <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
           <hr />
           <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br/>')}</p>`
  };
  // Set reply_to per Resend API
  emailPayload.reply_to = trimmedEmail;

  if (isDryRun) {
    console.log('DRY_RUN enabled. Email not sent. Payload:', emailPayload);
    return json(res, 200, { ok: true, dryRun: true });
  }

  // Try Resend first, then SMTP fallback
  try {
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const result = await resend.emails.send(emailPayload);
      return json(res, 200, { ok: true, id: result?.id || null, via: 'resend' });
    }
  } catch (error) {
    console.error('Resend send failed, attempting SMTP fallback:', normalizeError(error));
  }

  // SMTP fallback
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return json(res, 502, { error: 'Email send failed and no SMTP fallback configured.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: Array.isArray(toEmail) ? toEmail.join(',') : toEmail,
      subject: `[Portfolio] ${trimmedSubject}`,
      text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`,
      html: emailPayload.html,
      replyTo: trimmedEmail
    });
    return json(res, 200, { ok: true, id: info.messageId || null, via: 'smtp' });
  } catch (smtpErr) {
    const normalized = normalizeError(smtpErr);
    console.error('SMTP send failed:', normalized);
    return json(res, 502, { error: 'Failed to send message via SMTP', details: normalized });
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeError(err) {
  if (!err) return { message: 'Unknown error' };
  // ResendError often includes name, message, statusCode, and details
  const statusCode = err.statusCode || err.status || (err.response && err.response.status);
  const code = err.code || (err.response && err.response.data && err.response.data.name);
  const details = err.details || (err.response && err.response.data && err.response.data);
  return {
    statusCode,
    code,
    message: err.message || (details && details.message) || 'Unknown error',
    details
  };
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

