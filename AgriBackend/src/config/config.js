const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

// Debugging: Check if env vars are loaded
// console.log("[Email Config] Loading email configuration...");
// console.log("[Email Config] SMTP_HOST:", process.env.SMTP_HOST || "(missing)");
// console.log("[Email Config] SMTP_PORT:", process.env.SMTP_PORT || "(missing)");
// console.log("[Email Config] SMTP_USER:", process.env.SMTP_USER ? "Set (Hidden)" : "(missing)");
// console.log("[Email Config] CLIENT_URL:", process.env.CLIENT_URL || "(missing)");

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // True for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: false, // Enable debug output
    logger: false // Log to console
});

// Verify SMTP connection on startup (This is NOT a mail send attempt)
transport.verify((error, success) => {
    if (error) {
        console.error("[Email Config] Startup SMTP Check FAILED:", error);
    } else {
        // console.log("[Email Config] Startup SMTP Check SUCCESS: Server is ready to take messages");
    }
});

const sendConfirmationEmail = async (name, email, confirmationCode) => {
    // console.log(`[Email Service] >>> BEFORE SENDING EMAIL to ${email} <<<`);
    // console.log(`[Email Service] Details: Name=${name}, Code=${confirmationCode}`);

    // Verify transport before sending (optional, but good for debugging)
    // try {
    //     await transport.verify();
    //     console.log('[Email Service] SMTP Transport verified.');
    // } catch (error) {
    //     console.error('[Email Service] SMTP Transport verification failed:', error);
    //     throw error;
    // }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Confirmation</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .email-container {
                    background-color: #ffffff;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    width: 100%;
                    text-align: center;
                }
                h1 {
                    color: #333333;
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }
                h2 {
                    color: #555555;
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                p {
                    color: #777777;
                    font-size: 1rem;
                    margin-bottom: 2rem;
                }
                .btn {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    color: #ffffff;
                    background-color: #007bff;
                    border-radius: 5px;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    background-color: #0056b3;
                }
                .footer {
                    margin-top: 2rem;
                    font-size: 0.875rem;
                    color: #999999;
                    background-color: transparent;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>Email Confirmation</h1>
                <h2>Hello ${name}</h2>
                <p>Thank you for subscribing. Please confirm your email by clicking on the following link:</p>
                <a href="${process.env.CLIENT_URL}/verify-email/${confirmationCode}" class="btn">Confirm Email</a>
                <div class="footer">
                    <p>If you did not create an account, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        // console.log(`[Email Service] Sending mail object...`);
        let info = await transport.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Please confirm your account",
            html: htmlContent,
        });
        // console.log(`[Email Service] >>> AFTER SENDING EMAIL successfully to ${email} <<<`);
        // console.log(`[Email Service] Message ID: ${info.messageId}`);
        return info;
    } catch (err) {
        console.error(`[Email Service] CRITICAL ERROR sending email to ${email}:`, err);
        // Throwing error here will be caught by the caller
        throw err;
    }
};

module.exports = sendConfirmationEmail;