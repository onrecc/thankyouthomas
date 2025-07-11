# Thank You Thomas 💝

A heartfelt message collection platform built with Next.js, Firebase, and love.

## 🚀 Production Deployment

### Prerequisites
- Node.js 14+ 
- Firebase project with Firestore enabled
- SMTP email provider (Zoho, Gmail, etc.)

### Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app

# Admin Panel Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-bcrypt-hash

# SMTP Email Configuration
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM_NAME=Your Name
SMTP_FROM_EMAIL=your-email@domain.com
```

### Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add all environment variables from `.env.local`
   - Make sure to properly escape the Firebase private key

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
app/
├── page.tsx                 # Main message board
├── form/page.tsx            # Message submission form  
├── admin/page.tsx           # Admin panel
├── api/                     # API routes
│   ├── submit-message/      # Handle form submissions
│   ├── approved-messages/   # Get approved messages
│   └── admin/               # Admin functionality
├── components/              # React components
└── globals.css              # Global styles

lib/
├── firebase-admin.ts        # Firebase configuration
├── email.ts                 # Email sending utilities
└── utils.ts                 # Utility functions
```

## 🛠️ Features

- **Message Submission:** Users can submit messages with optional images
- **Admin Panel:** Review and approve/reject messages
- **Email Notifications:** Automatic notifications for new submissions
- **Responsive Design:** Works on all devices
- **Image Support:** Upload and display images with messages
- **Masonry Layout:** Beautiful Pinterest-style layout

## 🔒 Security

- Admin authentication with bcrypt password hashing
- Form validation and sanitization
- Rate limiting on API endpoints
- Secure Firebase admin configuration
- Environment variable protection

## 📧 Email Configuration

The app sends notifications when:
- New messages are submitted (to admin)
- Messages are approved (to submitter)
- Messages are rejected (to submitter)

Configure your SMTP provider in the environment variables.

## 🎨 Customization

- Modify colors in `tailwind.config.js`
- Update logo and images in `/public`
- Customize email templates in `/lib/email.ts`
- Adjust styling in components and `globals.css`

---

Made with ❤️ for Thomas Stubblefield
