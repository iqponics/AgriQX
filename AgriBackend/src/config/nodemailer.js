const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports like 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

const baseStyle = `
    body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #121212;
        color: #E0E0E0;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 2rem auto;
        background-color: #1E1E1E;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.4);
    }
    h1, h2 {
        color: #FFFFFF;
    }
    p {
        color: #CCCCCC;
        line-height: 1.6;
    }
    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #2e7d32;
        color: #FFFFFF;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        margin-top: 1rem;
        transition: background-color 0.3s ease;
    }
    .btn:hover {
        background-color: #1b5e20;
    }
    .footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #333;
        color: #999;
        font-size: 0.9rem;
    }
    table {
        width: 95%;
        border-collapse: collapse;
        margin-top: 1rem;
        background-color: #2C2C2C;
    }
    th, td {
        padding: 0.75rem;
        border: 1px solid #333;
        text-align: left;
        color: #E0E0E0;
    }
    .warning {
        background-color: #1B2D1B;
        border: 1px solid #2e7d32;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
    }
`;

//Confirmation Email
const sendConfirmationEmail = async (name, email, confirmationCode) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation - Lylah Perfumes</title>
        <style>${baseStyle}</style>
    </head>
    <body>
        <div class="container">
            <h1>🌱 Welcome to iqponics!</h1>
            <h2>Hello ${name},</h2>
            <p>Thank you for registering with iqponics! We're excited to have you join our sustainable agriculture community.</p>
            <p>To complete your registration and start exploring our innovative hydroponic solutions, please verify your email address by clicking the button below:</p>
            <a href="${process.env.CLIENT_URL}/verify-email/${confirmationCode}" class="btn">Verify My Email</a>
            <p style="margin-top: 2rem;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #2e7d32; word-break: break-all;">${process.env.CLIENT_URL}/verify-email/${confirmationCode}</p>
            <div class="footer">
                <p>If you didn't create an account with iqponics, please ignore this email.</p>
                <p>This verification link will expire in 24 hours for security reasons.</p>
                <p>© 2026 iqponics. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"iqponics" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "🌿 Please verify your email - iqponics",
            html: htmlContent,
        });
        return true;
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        throw new Error("Failed to send confirmation email");
    }
};

// Welcome Email
const sendWelcomeEmail = async (name, email) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Lylah Perfumes</title>
        <style>${baseStyle}</style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 Welcome to iqponics!</h1>
            <h2>Dear ${name},</h2>
            <p>Congratulations! Your email has been successfully verified, and you're now part of the iqponics family.</p>
            <p>We're thrilled to have you on board! Get ready to explore our advanced hydroponic systems and sustainable farming solutions.</p>
            
            <h3 style="color: #2e7d32;">What's Next?</h3>
            <p>🌱 Explore our hydroponic product range<br>
            🛠️ Access smart farming consultancy<br>
            📧 Stay updated with the latest agritech trends<br>
            📊 Monitor your farm data with our dashboard</p>
            
            <a href="${process.env.CLIENT_URL}/login" class="btn">Login to Your Account</a>
            
            <div class="footer">
                <p>Need help? Contact our support team - we're here to grow together!</p>
                <p>Follow us on social media for the latest farming tips and updates.</p>
                <p>© 2026 iqponics. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"iqponics" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "🌳 Welcome to iqponics - Start Your Sustainable Journey!",
            html: htmlContent,
        });
        return true;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};



module.exports = {
    sendConfirmationEmail,
    sendWelcomeEmail
};