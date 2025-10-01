/* eslint-disable no-console */
process.env.DRY_RUN = process.env.DRY_RUN || 'true';
process.env.CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'imahrous13@gmail.com';
process.env.CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Portfolio <imahrous13@gmail.com>';

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
  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      name: 'Test User',
      email: 'test@gmail.com',
      subject: 'Hello',
      message: 'This is a DRY_RUN test.'
    }
  };

  const res = createMockRes();
  await handler(req, res);
}

main().catch(err => {
  console.error('Harness error:', err);
  process.exit(1);
});

