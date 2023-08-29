const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now(),
    expires: 5 * 60,
  },
});

//  a fuctin -> to send emails

async function sendVerficationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "verification email from studyNotions",
      emailTemplate(otp)
    );
    console.log("Email sent Successfully ", mailResponse);
  } catch (error) {
    console.log("error occured while sending mails:", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  // only send an email when a new document is created
  if (this.isNew) {
    await sendVerficationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);

