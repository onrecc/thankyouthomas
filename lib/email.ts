import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function createApprovalEmailTemplate(name: string, message: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Message Has Been Approved!</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #5D4037; 
          background-color: #E8D5C4;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #E8D5C4;
        }
        .header { 
          background: linear-gradient(135deg, #D4AF37, #F4D03F); 
          color: #2C1810 !important; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 15px 15px 0 0;
          border: 3px solid #D4AF37;
          border-bottom: none;
        }
        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          color: #2C1810 !important;
        }
        .header h2 {
          font-size: 20px;
          font-weight: normal;
          color: #2C1810 !important;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .content { 
          background: rgba(255, 255, 255, 0.95) !important; 
          padding: 40px 30px; 
          border: 3px solid #D4AF37; 
          border-top: none;
          border-radius: 0 0 15px 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: #5D4037 !important;
        }
        .content p {
          margin-bottom: 20px;
          font-size: 16px;
          color: #5D4037 !important;
          background-color: transparent !important;
        }
        .message-box { 
          background: linear-gradient(135deg, #FEF9E7, #F9F3E3); 
          border: 2px solid #D4AF37; 
          border-radius: 12px; 
          padding: 25px; 
          margin: 30px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .message-box h3 {
          color: #5D4037 !important;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: bold;
          background-color: transparent !important;
        }
        .message-box p {
          font-style: italic;
          font-size: 16px;
          color: #6D4C41 !important;
          background: white !important;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #D4AF37;
          margin: 0;
        }
        .celebrate { 
          font-size: 20px; 
          margin: 25px 0; 
          text-align: center;
          color: #D4AF37 !important;
          font-weight: bold;
          background-color: transparent !important;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #8D6E63 !important; 
          font-size: 14px;
          padding: 20px;
          background: rgba(255,255,255,0.7) !important;
          border-radius: 10px;
          border: 1px solid #D4AF37;
        }
        .website-link {
          color: #D4AF37 !important;
          font-weight: bold;
          text-decoration: none;
          background-color: transparent !important;
        }
        
        /* Mobile Responsiveness */
        @media only screen and (max-width: 600px) {
          body { padding: 10px; }
          .header { padding: 25px 20px; }
          .header h1 { font-size: 24px; }
          .header h2 { font-size: 18px; }
          .content { padding: 25px 20px; }
          .content p { font-size: 15px; }
          .message-box { padding: 20px; margin: 20px 0; }
          .message-box h3 { font-size: 16px; }
          .message-box p { font-size: 15px; padding: 12px; }
          .celebrate { font-size: 18px; }
          .footer { font-size: 13px; padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Great News!</h1>
          <h2>Your Thank You Message Has Been Approved!</h2>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>We're excited to let you know that your heartfelt message for Thomas has been approved and is now live on our Thank You Thomas page!</p>
          
          <div class="message-box">
            <h3>Your Message:</h3>
            <p>"${message}"</p>
          </div>
          
          <p>Your thoughtful words are now part of a beautiful collection of appreciation messages that celebrate Thomas's incredible work in organizing our neighborhood community.</p>
          
          <p>You can view your message and all the other wonderful submissions at: <a href="#" class="website-link">Thank You Thomas</a></p>
          
          <div class="celebrate">Thank you for being part of our community!</div>
          
          <p>Thank you for taking the time to share your appreciation. Messages like yours help build stronger, more connected communities!</p>
          
          <p>Warm regards,<br>
          The Thank You Thomas Team</p>
        </div>
        <div class="footer">
          <p>This email was sent because you submitted a message to Thank You Thomas.<br>
          If you have any questions, please feel free to reach out to us.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function createRejectionEmailTemplate(name: string, message: string, reason?: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Update on Your Message Submission</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #5D4037; 
          background-color: #E8D5C4;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #E8D5C4;
        }
        .header { 
          background: linear-gradient(135deg, #E67E22, #F8C471); 
          color: #2C1810 !important; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 15px 15px 0 0;
          border: 3px solid #E67E22;
          border-bottom: none;
        }
        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          color: #2C1810 !important;
        }
        .content { 
          background: rgba(255, 255, 255, 0.95) !important; 
          padding: 40px 30px; 
          border: 3px solid #E67E22; 
          border-top: none;
          border-radius: 0 0 15px 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: #5D4037 !important;
        }
        .content p {
          margin-bottom: 20px;
          font-size: 16px;
          color: #5D4037 !important;
          background-color: transparent !important;
        }
        .message-box { 
          background: linear-gradient(135deg, #FDF2E9, #F9E8D8); 
          border: 2px solid #E67E22; 
          border-radius: 12px; 
          padding: 25px; 
          margin: 30px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .message-box h3 {
          color: #5D4037 !important;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: bold;
          background-color: transparent !important;
        }
        .message-box p {
          font-style: italic;
          font-size: 16px;
          color: #6D4C41 !important;
          background: white !important;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #E67E22;
          margin: 0;
        }
        .reason-box { 
          background: linear-gradient(135deg, #FEF9E7, #F9F3E3) !important; 
          border-left: 4px solid #F39C12; 
          border-radius: 8px;
          padding: 20px; 
          margin: 25px 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .reason-box h4 {
          color: #5D4037 !important;
          font-size: 16px;
          margin-bottom: 10px;
          font-weight: bold;
          background-color: transparent !important;
        }
        .reason-box p {
          color: #6D4C41 !important;
          margin: 0;
          font-size: 15px;
          background-color: transparent !important;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #8D6E63 !important; 
          font-size: 14px;
          padding: 20px;
          background: rgba(255,255,255,0.7) !important;
          border-radius: 10px;
          border: 1px solid #E67E22;
        }
        
        /* Mobile Responsiveness */
        @media only screen and (max-width: 600px) {
          body { padding: 10px; }
          .header { padding: 25px 20px; }
          .header h1 { font-size: 24px; }
          .content { padding: 25px 20px; }
          .content p { font-size: 15px; }
          .message-box { padding: 20px; margin: 20px 0; }
          .message-box h3 { font-size: 16px; }
          .message-box p { font-size: 15px; padding: 12px; }
          .reason-box { padding: 15px; margin: 20px 0; }
          .reason-box h4 { font-size: 15px; }
          .reason-box p { font-size: 14px; }
          .footer { font-size: 13px; padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Submission</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Thank you for taking the time to submit a message for Thomas. We truly appreciate your thoughtfulness and desire to show appreciation for his work in our community.</p>
          
          <div class="message-box">
            <h3>Your Submitted Message:</h3>
            <p>"${message}"</p>
          </div>
          
          <p>After careful review, we've decided not to include this particular message in our public collection at this time.</p>
          
          ${reason ? `
          <div class="reason-box">
            <h4>Reason:</h4>
            <p>${reason}</p>
          </div>
          ` : ''}
          
          <p>Please don't let this discourage you from participating in our community appreciation efforts. We encourage you to submit another message if you'd like to share different thoughts or experiences about Thomas's positive impact on our neighborhood.</p>
          
          <p>Our goal is to maintain a positive, respectful space that celebrates community spirit, and we appreciate your understanding.</p>
          
          <p>Thank you again for your participation in recognizing Thomas's valuable contributions to our community.</p>
          
          <p>Best regards,<br>
          The Thank You Thomas Team</p>
        </div>
        <div class="footer">
          <p>This email was sent because you submitted a message to Thank You Thomas.<br>
          If you have any questions about this decision, please feel free to reach out to us.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
