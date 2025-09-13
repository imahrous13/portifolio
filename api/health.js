module.exports = async (req, res) => {
  const status = {
    ok: true,
    env: {
      RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
      CONTACT_TO_EMAIL: Boolean(process.env.CONTACT_TO_EMAIL),
      CONTACT_FROM_EMAIL: Boolean(process.env.CONTACT_FROM_EMAIL),
      DRY_RUN: Boolean(process.env.DRY_RUN),
      SMTP_HOST: Boolean(process.env.SMTP_HOST),
      SMTP_PORT: Boolean(process.env.SMTP_PORT),
      SMTP_USER: Boolean(process.env.SMTP_USER),
      SMTP_PASS: Boolean(process.env.SMTP_PASS)
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(status));
};

