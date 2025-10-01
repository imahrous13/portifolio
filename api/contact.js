const { Resend } = require('resend');

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
  // Basic CORS headers
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
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
  // Always deliver to the owner's inbox
  const toEmail = 'imahrous13@gmail.com';
  // Default sender to owner's Gmail unless overridden by env
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <imahrous13@gmail.com>';
  const isDryRun = String(process.env.DRY_RUN || '').toLowerCase() === 'true' || process.env.DRY_RUN === '1';


  if (!resendApiKey && !isDryRun) {
    return json(res, 500, { error: 'Missing RESEND_API_KEY' });
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

  const resend = new Resend(resendApiKey);

  try {
    const result = await resend.emails.send(emailPayload);
    return json(res, 200, { ok: true, id: result?.id || null });
  } catch (error) {
    const normalized = normalizeError(error);
    console.error('Contact email send failed:', normalized);
    return json(res, normalized.statusCode || 502, {
      error: normalized.message || 'Failed to send message',
      code: normalized.code || 'SEND_FAILED'
    });
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

