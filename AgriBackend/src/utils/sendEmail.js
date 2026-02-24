const nodemailer = require("nodemailer");

const sendEmail = async (name, email, confirmationCode) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"Farm Fresh" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Farm Fresh - Verify your email",
            html: `
        <h2>Hello ${name}</h2>
        <p>Click below to verify your email:</p>
        <a href="${process.env.CLIENT_URL}/verify-email/${confirmationCode}">
          Verify Email
        </a>
      `,
        });

        // console.log("Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("Email failed:", err.message);
        throw err;
    }
};

module.exports = sendEmail;
