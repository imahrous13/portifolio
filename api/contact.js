const { Resend } = require('resend');

/**
 * Vercel Serverless Function: POST /api/contact
 * Expects JSON body: { name, email, subject, message }
 */
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    // Basic CORS preflight support (mostly unnecessary on same-origin)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedSubject = (subject || '').trim();
  const trimmedMessage = (message || '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_FROM_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

  if (!resendApiKey || !toEmail) {
    return res.status(500).json({ error: 'Email service not configured. Set RESEND_API_KEY and CONTACT_TO_EMAIL.' });
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[Portfolio] ${trimmedSubject}`,
      reply_to: trimmedEmail,
      text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email send failed:', error);
    return res.status(502).json({ error: 'Failed to send message. Please try again later.' });
  }
};

