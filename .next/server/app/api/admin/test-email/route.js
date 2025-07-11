"use strict";(()=>{var e={};e.id=376,e.ids=[376],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},8791:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},9686:(e,o,r)=>{r.r(o),r.d(o,{originalPathname:()=>l,patchFetch:()=>g,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>x,staticGenerationAsyncStorage:()=>m});var t={};r.r(t),r.d(t,{POST:()=>d});var a=r(9303),n=r(8716),i=r(670),s=r(7070),p=r(6119);async function d(e){try{let e=(0,p.xu)("Test User","This is a test message to verify the email system is working correctly. Thank you Thomas for all your hard work organizing our neighborhood!"),o=await (0,p.Cz)({to:"tmgd.og1@gmail.com",subject:"Test Email - Thank You Thomas System",html:e});if(o.success)return console.log("Test email sent successfully to tmgd.og1@gmail.com"),s.NextResponse.json({success:!0,message:"Test email sent successfully",messageId:o.messageId});return console.error("Failed to send test email:",o.error),s.NextResponse.json({success:!1,error:o.error},{status:500})}catch(e){return console.error("Test email error:",e),s.NextResponse.json({success:!1,error:e instanceof Error?e.message:"Unknown error"},{status:500})}}let c=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/test-email/route",pathname:"/api/admin/test-email",filename:"route",bundlePath:"app/api/admin/test-email/route"},resolvedPagePath:"/Users/tan135/thankyouthomas/app/api/admin/test-email/route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:u,staticGenerationAsyncStorage:m,serverHooks:x}=c,l="/api/admin/test-email/route";function g(){return(0,i.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:m})}},6119:(e,o,r)=>{r.d(o,{AY:()=>i,Cz:()=>a,xu:()=>n});let t=r(5245).createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},tls:{rejectUnauthorized:!1}});async function a({to:e,subject:o,html:r}){try{let a=await t.sendMail({from:`"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,to:e,subject:o,html:r});return{success:!0,messageId:a.messageId}}catch(e){return{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}function n(e,o){return`
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
          <p>Hi ${e},</p>
          
          <p>We're excited to let you know that your heartfelt message for Thomas has been approved and is now live on our Thank You Thomas page!</p>
          
          <div class="message-box">
            <h3>Your Message:</h3>
            <p>"${o}"</p>
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
  `}function i(e,o,r){return`
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
          <p>Hi ${e},</p>
          
          <p>Thank you for taking the time to submit a message for Thomas. We truly appreciate your thoughtfulness and desire to show appreciation for his work in our community.</p>
          
          <div class="message-box">
            <h3>Your Submitted Message:</h3>
            <p>"${o}"</p>
          </div>
          
          <p>After careful review, we've decided not to include this particular message in our public collection at this time.</p>
          
          ${r?`
          <div class="reason-box">
            <h4>Reason:</h4>
            <p>${r}</p>
          </div>
          `:""}
          
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
  `}}};var o=require("../../../../webpack-runtime.js");o.C(e);var r=e=>o(o.s=e),t=o.X(0,[276,972,245],()=>r(9686));module.exports=t})();