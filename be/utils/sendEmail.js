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

async function sendRecoveryEmail(email, userName, phoneNumber, recoveryLink) {
  const transporter = createTransporter();

  const mailOptions = {
    from: "tmdh46478@gmail.com", // Replace with your email
    to: email,
    subject: "Password Recovery",
    text: `Hello ${userName},\n\nYou requested a password reset. Please click the following link to reset your password: ${recoveryLink}\n\nPhone Number: ${phoneNumber}`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Password recovery email sent successfully.", result);
    return result;
  } catch (error) {
    console.error("Error sending recovery email:", error);
    throw error;
  }
}

module.exports = sendRecoveryEmail;
