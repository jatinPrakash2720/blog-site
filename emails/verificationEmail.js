export default function VerificationEmail({ username, otp }) {
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
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <div class="code">${otp}</div>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}
