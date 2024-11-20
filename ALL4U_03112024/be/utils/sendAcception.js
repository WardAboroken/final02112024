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

async function sendAcception(email, userName, recoveryLink) {
  const transporter = createTransporter();

  const mailOptions = {
    from: "tmdh46478@gmail.com", // Replace with your email
    to: email,
    subject: "Acception Recovery",
    text: `Hello ${userName}, Welcome to your new online business , now you have got permission to start building your own shop with the help of All4U family...
    click to login => ${recoveryLink}`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Acception email sent successfully.", result);
    return result;
  } catch (error) {
    console.error("Error sending Acception email:", error);
    throw error;
  }
}

module.exports = sendAcception;
