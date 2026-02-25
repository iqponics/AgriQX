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
            from: `"IQponics" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "IQponics - Verify your email",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify your Email - IQponics</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Helvetica Neue', Arial, sans-serif;
                  background-color: #FAFAF5; /* cream-200 */
                  color: #333333; /* charcoal-900 */
                }
                .wrapper {
                  width: 100%;
                  table-layout: fixed;
                  background-color: #FAFAF5;
                  padding-bottom: 40px;
                }
                .main {
                  background-color: #FFFFFF;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 600px;
                  border-spacing: 0;
                  color: #333333;
                  border-radius: 12px;
                  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.08); /* leaf-500 tint */
                  overflow: hidden;
                  margin-top: 40px;
                }
                .header {
                  background-color: #E8F5E9; /* leaf-50 */
                  padding: 30px;
                  text-align: center;
                  border-bottom: 2px solid #C8E6C9; /* leaf-100 */
                }
                .header h1 {
                  font-size: 28px;
                  margin: 0;
                  color: #2E7D32; /* default primary green */
                  letter-spacing: 1px;
                }
                .content {
                  padding: 40px 30px;
                  text-align: center;
                }
                .greeting {
                  font-size: 22px;
                  font-weight: 600;
                  margin-bottom: 15px;
                  color: #1B5E20; /* leaf-900 */
                }
                .message {
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 30px;
                  color: #666666; /* text-secondary */
                }
                .btn-wrapper {
                  text-align: center;
                  margin: 35px 0;
                }
                .btn {
                  background-color: #2E7D32; /* btn-primary leaf-700 */
                  color: #FFFFFF !important;
                  text-decoration: none;
                  padding: 14px 28px;
                  border-radius: 8px;
                  font-size: 16px;
                  font-weight: 600;
                  display: inline-block;
                  box-shadow: 0 4px 6px rgba(46, 125, 50, 0.2);
                  transition: background-color 0.3s ease;
                }
                .btn:hover {
                  background-color: #1B5E20; /* leaf-900 hover state fallback */
                }
                .url-fallback {
                  font-size: 13px;
                  color: #999999;
                  word-break: break-all;
                  margin-top: 25px;
                  text-align: left;
                  background-color: #FAFAF5; /* cream-200 */
                  padding: 15px;
                  border-radius: 6px;
                }
                .footer {
                  background-color: #FAFAF5; /* cream-200 */
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #888888;
                  border-top: 1px solid #EFEFEA;
                }
                .footer p {
                  margin: 5px 0;
                }
                .highlight {
                  color: #F9A825; /* farm-800 secondary */
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <center class="wrapper">
                <table class="main" width="100%">
                  <!-- Header Section -->
                  <tr>
                    <td class="header">
                      <h1>IQ Green Life Ponics</h1>
                    </td>
                  </tr>
                  
                  <!-- Content Section -->
                  <tr>
                    <td class="content">
                      <div class="greeting">Welcome, ${name}!</div>
                      <div class="message">
                        Thank you for joining the <span class="highlight">natural revolution</span>. We're thrilled to have you onboard. 
                        Please verify your email address to complete your full registration and unlock all features.
                      </div>
                      
                      <div class="btn-wrapper">
                        <a href="${process.env.CLIENT_URL}/verify-email/${confirmationCode}" class="btn">Verify Email Address</a>
                      </div>
                      
                      <div class="url-fallback">
                        If the button above doesn't work, copy and paste the following link into your web browser:<br><br>
                        <a href="${process.env.CLIENT_URL}/verify-email/${confirmationCode}" style="color: #4CAF50;">${process.env.CLIENT_URL}/verify-email/${confirmationCode}</a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer Section -->
                  <tr>
                    <td class="footer">
                      <p>Need help? Contact our support team at iqponics@gmail.com</p>
                      <p>&copy; ${new Date().getFullYear()} IQponics. All rights reserved.</p>
                      <p>If you didn't create an account, you can safely ignore this email.</p>
                    </td>
                  </tr>
                </table>
              </center>
            </body>
            </html>
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
