# Thank You Thomas 💖

A heartfelt message collection platform where people can send messages, images, and appreciation to Thomas. All submissions are stored in Firebase Firestore under the "responses" collection.

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