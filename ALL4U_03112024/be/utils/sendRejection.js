const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tmdh46478@gmail.com", // Replace with your email
      pass: "scjf kwqu kqff mqpc", // Replace with your app password
    },
  });
};

async function sendRejection(email, userName) {
  const transporter = createTransporter();

  const mailOptions = {
    from: "tmdh46478@gmail.com", // Replace with your email
    to: email,
    subject: "Rejection Mail",
    text: `Hello ${userName},We regret to inform you that your application has not been approved at this time. We encourage you to review our guidelines and try again in the future.
    Thank you for your understanding. `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Rejection email sent successfully.", result);
    return result;
  } catch (error) {
    console.error("Error sending Rejection email:", error);
    throw error;
  }
}

module.exports = sendRejection;
