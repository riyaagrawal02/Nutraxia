import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, url: string) {
  const mailOptions = {
    from: `"Nutraxia" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email - Nutraxia",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Click the button below to verify your email address:</p>
        <a href="${url}" 
           style="display:inline-block; padding:10px 18px; background:#10b981; color:white; border-radius:8px; text-decoration:none;">
           Verify Email
        </a>
        <p style="margin-top:20px;">Or open this URL manually:</p>
        <p>${url}</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const mailOptions = {
    from: `"Nutraxia" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your password - Nutraxia",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${url}" 
           style="display:inline-block; padding:10px 18px; background:#3b82f6; color:white; border-radius:8px; text-decoration:none;">
           Reset Password
        </a>
        <p style="margin-top:20px;">If you didn't request this, ignore the email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
