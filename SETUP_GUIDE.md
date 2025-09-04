# 🚀 Complete Setup Guide for Phiritonal Online

## Step-by-Step Instructions for VS Code

### 1. Prerequisites Installation

#### Install Required Software:
```bash
# Install Java JDK (if not installed)
# Download from: https://adoptium.net/

# Install Android SDK Command Line Tools
# Download from: https://developer.android.com/studio#command-tools
```

#### Install VS Code Extensions:
1. **Android for VS Code** (by Google)
2. **Kotlin Language** (by mathiasfrohlich)
3. **Gradle for Java** (by Microsoft)

### 2. Project Setup in VS Code

1. **Open VS Code**
2. **File → Open Folder** → Select your project directory
3. **Open Terminal** in VS Code (`Ctrl+`` ` or `View → Terminal`)

### 3. Android SDK Setup

```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Install required SDK packages
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### 4. Firebase Configuration

#### A. Create Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: **"Phiritonal Online"**
4. Enable Google Analytics (optional)

#### B. Add Android App:
1. Click "Add app" → Android icon
2. Package name: `com.shaunntsala.phiritonalonline`
3. App nickname: "Phiritonal Online"
4. Download `google-services.json`
5. **IMPORTANT:** Place `google-services.json` in `app/` folder

#### C. Enable Firebase Services:
1. **Authentication:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Phone" (optional, requires verification)

2. **Firestore Database:**
   - Go to Firestore Database
   - Create database in test mode
   - Choose location closest to South Africa

3. **Storage:**
   - Go to Storage
   - Get started with default rules

4. **Cloud Messaging:**
   - Automatically enabled when you add the app

### 5. Build and Run the App

#### Option A: Using VS Code Terminal
```bash
# Navigate to project directory
cd path/to/your/project

# Make gradlew executable (on Mac/Linux)
chmod +x gradlew

# Clean and build
./gradlew clean
./gradlew assembleDebug

# Install on connected device/emulator
./gradlew installDebug
```

#### Option B: Using Android Studio (Recommended)
1. Download [Android Studio](https://developer.android.com/studio)
2. Open the project in Android Studio
3. Click "Sync Now" when prompted
4. Click the green "Run" button

### 6. Setting Up Android Emulator

#### In Android Studio:
1. **Tools → AVD Manager**
2. **Create Virtual Device**
3. Choose **Pixel 4** or newer
4. Select **API 34 (Android 14)**
5. Click **Finish**

#### In VS Code:
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Your_AVD_Name
```

### 7. Testing the App

1. **Launch emulator or connect physical device**
2. **Run the app:**
   ```bash
   ./gradlew installDebug
   ```
3. **Test all features:**
   - Welcome screen with hyena logo
   - Language selection
   - Registration/Login
   - All chat screens
   - Profile settings
   - Shaun AI assistant

### 8. Troubleshooting Common Issues

#### Issue: "SDK location not found"
**Solution:**
```bash
# Create local.properties file in project root
echo "sdk.dir=/path/to/Android/Sdk" > local.properties
```

#### Issue: "google-services.json not found"
**Solution:**
- Ensure `google-services.json` is in `app/` folder (not project root)
- File should be at same level as `app/build.gradle`

#### Issue: Build fails with dependency errors
**Solution:**
```bash
./gradlew clean
./gradlew --refresh-dependencies
```

#### Issue: App crashes on startup
**Solution:**
- Check if Firebase is properly configured
- Verify `google-services.json` is in correct location
- Check Android device/emulator API level (should be 24+)

### 9. Development Workflow

#### Daily Development:
```bash
# 1. Pull latest changes (if using git)
git pull origin main

# 2. Clean and build
./gradlew clean assembleDebug

# 3. Install and test
./gradlew installDebug

# 4. Make changes and repeat
```

#### Before Committing:
```bash
# Run lint checks
./gradlew lint

# Run tests
./gradlew test

# Build release version (for testing)
./gradlew assembleRelease
```

### 10. VS Code Specific Tips

#### Useful VS Code Shortcuts:
- `Ctrl+Shift+P`: Command palette
- `Ctrl+`` `: Toggle terminal
- `F5`: Start debugging
- `Ctrl+K Ctrl+S`: Keyboard shortcuts

#### Recommended VS Code Settings:
```json
{
  "java.configuration.updateBuildConfiguration": "automatic",
  "java.import.gradle.enabled": true,
  "kotlin.languageServer.enabled": true
}
```

### 11. Firebase Security Rules (Production)

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Community chat is readable by authenticated users
    match /communities/community_chat/messages/{messageId} {
      allow read, create: if request.auth != null;
    }
    
    // School chats
    match /schools/{schoolId}/messages/{messageId} {
      allow read, create: if request.auth != null;
    }
    
    // Private chats
    match /private_chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /community/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### 12. Next Steps

1. **Test all features thoroughly**
2. **Add your own Firebase project**
3. **Customize branding and colors**
4. **Add real user data**
5. **Test with multiple users**
6. **Deploy to Google Play Store** (when ready)

---

## 📱 App Features Checklist

- ✅ Welcome screen with Shaun Ntsala credit
- ✅ Language selection (6 languages)
- ✅ Email/Phone registration and login
- ✅ Profile setup with nickname option
- ✅ Community chat with online count
- ✅ Private chat with friend requests
- ✅ Schools chat (7 Heilbron schools)
- ✅ Shaun AI assistant
- ✅ Profile management and settings
- ✅ Theme options (Light/Dark/Custom)
- ✅ Modern Material Design 3 UI

## 🔧 Technical Features

- ✅ Jetpack Compose UI
- ✅ Firebase integration ready
- ✅ Hilt dependency injection
- ✅ Clean architecture
- ✅ Push notifications support
- ✅ Security and encryption ready

---

**Happy Coding! 🎉**

*If you encounter any issues, refer to the troubleshooting section or check the Android documentation.*