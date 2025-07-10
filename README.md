# Thank You Thomas 💖

A heartfelt message collection platform where people can send messages, images, and appreciation to Thomas. This project has been migrated from a simple HTML form to a modern Next.js React application with TypeScript and Tailwind CSS.

## Features

- ✉️ **Modern Form**: Beautiful React form with TypeScript
- 🖼️ **Image Upload**: Multi-file upload with drag & drop support
- 👤 **Name Input**: Optional name with anonymous option checkbox
- 🔒 **Anonymous Option**: Send messages anonymously with disabled name field
- 📱 **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- 🎨 **Beautiful UI**: Modern design with shadcn/ui components
- 🚀 **Next.js**: Server-side rendering and optimized performance
- ☁️ **API Routes**: Built-in API routes for form submission

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Modern icon library
- **React Hook Form**: Performant form handling

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000

### 3. Production Build
```bash
npm run build
npm start
```

## Migration Notes

This project has been migrated from:
- **From**: Simple HTML form with Bootstrap and Firebase client-side integration
- **To**: Modern Next.js application with TypeScript, Tailwind CSS, and API routes

### Key Changes:
- Replaced Bootstrap with Tailwind CSS and shadcn/ui components
- Migrated from vanilla JavaScript to TypeScript React
- Added proper form validation and error handling
- Implemented Next.js API routes for form submission
- Added modern animations and interactions
- Improved accessibility and mobile responsiveness

## File Structure

```
thankyouthomas/
├── app/
│   ├── api/submit-message/
│   │   └── route.ts        # API route for form submission
│   ├── components/
│   │   └── neighborhood-form.tsx  # Main form component
│   ├── globals.css         # Global styles with Tailwind
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets (images, etc.)
├── server.js               # Legacy Express server (if needed)
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Form Features

- **Name Field**: Optional, disabled when anonymous is selected
- **Email Field**: Required for contact purposes
- **Message Field**: Rich textarea with placeholder guidance
- **Image Upload**: Multiple file selection with preview
- **Anonymous Toggle**: Checkbox to submit without name
- **Submit Button**: Loading state with spinner animation
- **Responsive Design**: Works perfectly on all screen sizes

## API Integration

The form submits to `/api/submit-message` which can be extended to:
- Save data to Firebase Firestore
- Upload images to Firebase Storage
- Send confirmation emails
- Integrate with other backend services

## Customization

- **Colors**: Modify the warm amber/brown color scheme in the component
- **Form Fields**: Add/remove fields in `neighborhood-form.tsx`
- **Styling**: Customize Tailwind classes and CSS variables
- **Components**: Extend or modify shadcn/ui components
- **API Logic**: Update the API route in `app/api/submit-message/route.ts`

## Development

- **Hot Reload**: Development server supports hot reloading
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code linting for consistent code quality
- **Prettier**: Code formatting (can be added)

## Legacy Support

The original `form.html` and `form.js` files are preserved in the `public/` directory for reference. The Express server (`server.js`) is also maintained for backward compatibility if needed.

---

Made with ❤️ for Thomas using modern web technologies

## Features

- ✉️ **Message Form**: Rich text message input
- 🖼️ **Image Upload**: Drag & drop or click to upload images
- 👤 **Name Input**: Optional name with anonymous option
- 🔒 **Anonymous Option**: Send messages anonymously
- 📱 **Responsive Design**: Works on desktop and mobile
- 🚀 **Firebase Integration**: Automatic storage in Firestore
- ☁️ **Cloud Storage**: Images stored in Firebase Storage

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Storage
4. Get your Firebase config from Project Settings
5. Replace the Firebase config in `public/form.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 3. Firebase Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /responses/{document} {
      allow read, write: if true;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /responses/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Run the Application
```bash
npm start
```

The application will be available at:
- **Main page**: http://localhost:3000
- **Form page**: http://localhost:3000/form

## Data Structure

Messages are stored in the `responses` collection with the following structure:

```javascript
{
  message: "Thank you for everything, Thomas!",
  name: "John Doe", // or "Anonymous"
  isAnonymous: false,
  imageUrl: "https://firebasestorage.googleapis.com/...", // if image uploaded
  timestamp: firestore.FieldValue.serverTimestamp(),
  createdAt: "2024-01-01T12:00:00.000Z"
}
```

## File Structure

```
thankyouthomas/
├── public/
│   ├── index.html          # Landing page
│   ├── form.html           # Message form
│   ├── form.js             # Form functionality & Firebase integration
│   └── assets/             # Static assets
├── server.js               # Express server
├── package.json            # Dependencies
├── coolshi.json            # Thomas's information
└── README.md               # This file
```

## Customization

- **Thomas's Info**: Edit `coolshi.json` to update Thomas's information
- **Styling**: Modify CSS in `form.html` and `index.html`
- **Form Fields**: Add/remove fields in `form.html` and update `form.js`
- **Firebase Collection**: Change collection name in `form.js` (line with `.collection('responses')`)

## Security Notes

- In production, implement proper Firebase security rules
- Consider adding rate limiting for form submissions
- Validate and sanitize all user inputs
- Set up proper CORS policies

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Ensure Firebase services are enabled
4. Check network connectivity

---

Made with ❤️ for Thomas