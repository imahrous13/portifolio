/* eslint-disable no-console */
// Test script for sending real emails
process.env.DRY_RUN = 'false';
process.env.CONTACT_TO_EMAIL = 'imahrous13@gmail.com';
process.env.CONTACT_FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

const handler = require('../api/contact.js');

function createMockRes() {
  const res = {
    _status: 200,
    _headers: {},
    _body: '',
    status(code) {
      this._status = code;
      return this;
    },
    setHeader(name, value) {
      this._headers[name.toLowerCase()] = value;
      return this;
    },
    end(chunk) {
      if (chunk) this._body += chunk;
      this.finished = true;
      console.log('RESPONSE', JSON.stringify({ status: this._status, headers: this._headers, body: this._body }, null, 2));
    },
    json(obj) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(obj));
    }
  };
  return res;
}

async function main() {
  console.log('Testing real email sending to imahrous13@gmail.com...');
  console.log('Make sure you have RESEND_API_KEY set in your .env file!');
  
  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      name: 'Test User',
      email: 'test@gmail.com',
      subject: 'Test Email from Portfolio',
      message: 'This is a test email to verify the contact system is working correctly.'
    }
  };

  const res = createMockRes();
  await handler(req, res);
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
