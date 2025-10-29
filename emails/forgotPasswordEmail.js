export default function VerificationEmail({ username, resetUrl }) {
  return `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
        <style>
          @import url('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2');
          body {
            font-family: 'Roboto', Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h2 {
            color: #333;
            margin-bottom: 20px;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            border: 2px dashed #007bff;
            border-radius: 8px;
            margin: 20px 0;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${username},</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div class="code">
          <a href="${resetUrl}" style="text-decoration: none; color: #007bff; display: inline-block; padding: 10px 20px; border: 2px solid #007bff; border-radius: 5px; background-color: white;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      </body>
      </html>
    `;
}
