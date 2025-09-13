module.exports = async (req, res) => {
  const status = {
    ok: true,
    env: {
      RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
      CONTACT_TO_EMAIL: Boolean(process.env.CONTACT_TO_EMAIL),
      CONTACT_FROM_EMAIL: Boolean(process.env.CONTACT_FROM_EMAIL),
      DRY_RUN: Boolean(process.env.DRY_RUN)
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(status));
};

