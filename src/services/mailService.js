const nodemailer = require('nodemailer');

let transporterPromise;

const getTransporter = async () => {
  if (transporterPromise) return transporterPromise;
  if (process.env.EMAIL_HOST) {
    transporterPromise = Promise.resolve(nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    }));
  } else {
    transporterPromise = nodemailer.createTestAccount().then(testAccount => {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    });
  }
  return transporterPromise;
};

const sendMail = async (opts) => {
  const transporter = await getTransporter();
  const info = await transporter.sendMail(opts);
  // If using Ethereal, output preview link
  if (nodemailer.getTestMessageUrl && process.env.NODE_ENV !== 'test') {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
  return info;
};

const sendWelcome = async (user) => {
  await sendMail({
    from: process.env.FROM_EMAIL || 'Virtual Events <no-reply@localhost>',
    to: user.email,
    subject: 'Welcome to Virtual Events',
    text: `Hi ${user.name},\n\nWelcome to Virtual Events!`,
  });
};

const sendRegistrationConfirmation = async (user, event) => {
  await sendMail({
    from: process.env.FROM_EMAIL || 'Virtual Events <no-reply@localhost>',
    to: user.email,
    subject: `Registered: ${event.title}`,
    text: `Hi ${user.name},\n\nYou are registered for ${event.title} at ${event.startAt}`,
  });
};

module.exports = {
  sendWelcome,
  sendRegistrationConfirmation
};
