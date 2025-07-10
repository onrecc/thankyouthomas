# Firebase Service Account Setup Guide

## 🔑 How to Get Your Firebase Service Account Credentials

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)

### Step 2: Navigate to Project Settings
1. Click on the **gear icon** (⚙️) in the left sidebar
2. Select **"Project settings"**

### Step 3: Go to Service Accounts Tab
1. Click on the **"Service accounts"** tab
2. You'll see your project's service account information

### Step 4: Generate Private Key
1. Scroll down to the **"Firebase Admin SDK"** section
2. Select **"Node.js"** as the configuration snippet
3. Click **"Generate new private key"**
4. A dialog will appear warning you about the key security
5. Click **"Generate key"**

### Step 5: Download and Setup
1. A JSON file will be downloaded to your computer
2. **Rename** the downloaded file to `serviceAccount.json`
3. **Move** the file to your project root directory (same folder as `server.js`)
4. **Replace** the placeholder `serviceAccount.json` file I created

### Step 6: Update Server Configuration
1. Open `server.js`
2. Uncomment the Firebase Admin SDK lines (remove the `//` at the beginning)
3. Update the `storageBucket` with your project ID:
   ```javascript
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     storageBucket: 'your-project-id.appspot.com'
   });
   ```

### Step 7: Install Firebase Admin SDK
Run this command in your terminal:
```bash
npm install firebase-admin
```

## 🔒 Security Best Practices

### ⚠️ IMPORTANT SECURITY NOTES:
1. **Never commit `serviceAccount.json` to version control** (it's already in `.gitignore`)
2. **Keep your service account key secure** - it has administrative access to your Firebase project
3. **Don't share the key publicly** or include it in client-side code
4. **Regenerate the key** if you suspect it's been compromised

### Environment Variables (Recommended for Production)
Instead of using a JSON file, you can use environment variables:

1. Create a `.env` file in your project root:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

2. Update your `server.js` to use environment variables:
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});
```

## 🎯 What You Can Do with Service Account

With the service account configured, you can:

1. **Read responses** from Firestore on the server-side
2. **Validate and process** form submissions server-side
3. **Generate custom tokens** for authentication
4. **Access Firebase Storage** files
5. **Send push notifications** (if using FCM)

## 🔧 Example Usage

Once configured, you can uncomment the `/api/responses` endpoint in `server.js` to fetch all responses:

```javascript
app.get('/api/responses', async (req, res) => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection('responses').orderBy('timestamp', 'desc').get();
        const responses = [];
        snapshot.forEach(doc => {
            responses.push({ id: doc.id, ...doc.data() });
        });
        res.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ error: 'Failed to fetch responses' });
    }
});
```

## 📱 Client-Side vs Server-Side

- **Client-side** (form.js): Uses Firebase Web SDK for submitting forms
- **Server-side** (server.js): Uses Firebase Admin SDK for administrative tasks

Both work together to create a complete application!

## 🆘 Troubleshooting

1. **File not found error**: Make sure `serviceAccount.json` is in the project root
2. **Permission denied**: Check that your service account has the right permissions
3. **Invalid key**: Regenerate the service account key from Firebase Console
4. **Module not found**: Run `npm install firebase-admin`

---

**Remember**: The service account key is like a master key to your Firebase project. Keep it safe! 🔐
