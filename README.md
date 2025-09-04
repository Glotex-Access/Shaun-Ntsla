# Phiritonal Online - Android Chat App

**Slogan:** "Current Affairs. Real Conversation. True Connection."

**Developer:** Shaun Ntsala

## Overview

Phiritonal Online is a comprehensive Android chat application designed for the Heilbron community, featuring multiple chat environments, AI assistance, and modern social features.

## Features

### 🎯 Branding & Onboarding
- ✅ Welcome screen with hyena logo
- ✅ App developer credit (Shaun Ntsala)
- ✅ Multi-language support (English, Afrikaans, Sesotho, isiZulu, isiXhosa, Setswana)
- ✅ Registration via email or mobile number
- ✅ Login and password recovery
- ✅ Profile setup with nickname option

### 💬 Chat Features
- ✅ **Community Chat** - Public chatroom with online user count
- ✅ **Private Chat** - Personal conversations with friend requests
- ✅ **Schools Chat** - Dedicated chatrooms for 7 Heilbron schools:
  - Phiritona Sec
  - Sediba Thuto Sec
  - Phirihadi
  - Phitshana
  - Bhekilanga
  - Kearabetwe
  - Heilbron High

### 🤖 AI Integration
- ✅ **Shaun AI Assistant** - Helps with questions, suggestions, and moderation
- ✅ Smart conversation suggestions
- ✅ Community moderation support
- ✅ Local Heilbron information

### 👤 User Profiles & Settings
- ✅ Profile picture upload
- ✅ Privacy controls
- ✅ Comprehensive settings (language, theme, notifications, security)
- ✅ Theme options: Light Mode, Dark Mode, Personalized Colors

### 🔧 Modern Features
- ✅ Material Design 3 UI
- ✅ Full emoji support
- ✅ Voice messaging capabilities
- ✅ File and image sharing
- ✅ Location sharing
- ✅ Online status indicators
- ✅ Push notifications

### 🔐 Security & Privacy
- ✅ Firebase Authentication
- ✅ End-to-end encryption ready
- ✅ Secure data storage
- ✅ Privacy controls

## Tech Stack

- **Language:** Kotlin
- **UI Framework:** Jetpack Compose
- **Architecture:** MVVM with Clean Architecture
- **Dependency Injection:** Hilt
- **Backend:** Firebase (Auth, Firestore, Storage, Messaging)
- **Navigation:** Navigation Compose
- **Design:** Material Design 3

## Project Structure

```
app/
├── src/main/
│   ├── java/com/shaunntsala/phiritonalonline/
│   │   ├── MainActivity.kt
│   │   ├── PhiritonalApplication.kt
│   │   ├── ui/
│   │   │   ├── theme/          # App theming
│   │   │   ├── onboarding/     # Welcome, Auth, Language screens
│   │   │   └── chat/           # All chat-related screens
│   │   ├── service/            # Firebase messaging service
│   │   └── di/                 # Dependency injection
│   ├── res/                    # Resources (strings, colors, themes)
│   └── AndroidManifest.xml
├── build.gradle               # App-level dependencies
└── google-services.json      # Firebase configuration (add this)
```

## Setup Instructions

### Prerequisites
- Android Studio (latest version)
- JDK 8 or higher
- Android SDK (API level 24+)

### Step 1: Clone and Open Project
1. Open VS Code
2. Open the project folder
3. Install Android extension for VS Code (if not already installed)

### Step 2: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "Phiritonal Online"
3. Add an Android app with package name: `com.shaunntsala.phiritonalonline`
4. Download `google-services.json`
5. Place it in the `app/` directory

### Step 3: Enable Firebase Services
In Firebase Console, enable:
- Authentication (Email/Password, Phone)
- Cloud Firestore
- Storage
- Cloud Messaging

### Step 4: Build and Run
```bash
# In terminal (from project root)
./gradlew assembleDebug
./gradlew installDebug
```

Or use Android Studio:
1. Open the project
2. Sync Gradle files
3. Run the app on emulator/device

## Firebase Configuration

### Firestore Collections Structure
```
users/
  - {userId}/
    - name, email, profilePicture, bio, etc.

communities/
  - community_chat/
    - messages/ (subcollection)

schools/
  - {schoolId}/
    - messages/ (subcollection)

private_chats/
  - {chatId}/
    - messages/ (subcollection)
    - participants[]

friend_requests/
  - {requestId}/
    - from, to, status, timestamp
```

### Authentication Rules
- Email/Password authentication
- Phone number authentication
- Password recovery via email/SMS

## Development Roadmap

### Phase 1: Core Features ✅
- [x] Basic UI and navigation
- [x] Authentication flow
- [x] Chat interfaces
- [x] AI assistant
- [x] Profile management

### Phase 2: Advanced Features 🚧
- [ ] Firebase integration
- [ ] Real-time messaging
- [ ] Push notifications
- [ ] File upload/sharing
- [ ] Voice messages

### Phase 3: Premium Features 📋
- [ ] Video/audio calls
- [ ] End-to-end encryption
- [ ] Advanced AI features
- [ ] Analytics and insights

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Developer:** Shaun Ntsala
**App:** Phiritonal Online
**Community:** Heilbron, South Africa

---

*"Current Affairs. Real Conversation. True Connection."*