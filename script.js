// Phiritona Online - Main JavaScript File
class PhiritonaOnline {
    constructor() {
        this.currentUser = null;
        this.currentView = 'community';
        this.users = new Map();
        this.messages = [];
        this.privateChats = new Map();
        this.notifications = [];
        this.onlineUsers = new Set();
        this.blockedUsers = new Set();
        this.mediaRecorder = null;
        this.isRecording = false;
        
        // Initialize app
        this.init();
    }

    init() {
        // Show loading screen
        this.showLoadingScreen();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Check for saved user session
        this.checkUserSession();
        
        // Hide loading screen after 2 seconds
        setTimeout(() => {
            this.hideLoadingScreen();
            if (this.currentUser) {
                this.showApp();
            } else {
                this.showAuth();
            }
        }, 2000);
    }

    // Loading Screen Methods
    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
    }

    // Authentication Methods
    showAuth() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
    }

    showApp() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        this.updateUserInterface();
        this.showView('community');
    }

    checkUserSession() {
        const savedUser = localStorage.getItem('phiritona_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    login(username, password) {
        // Simple authentication (in real app, this would be server-side)
        if (username && password) {
            const user = {
                id: Date.now(),
                username: username,
                email: `${username}@example.com`,
                avatar: 'user',
                status: 'Available',
                joinDate: new Date().toLocaleDateString(),
                isOnline: true,
                isVisible: true,
                allowPrivateMessages: true
            };
            
            this.currentUser = user;
            this.users.set(user.id, user);
            this.onlineUsers.add(user.id);
            
            // Save to localStorage
            localStorage.setItem('phiritona_user', JSON.stringify(user));
            
            this.showApp();
            this.showNotification('Welcome to Phiritona Online!', 'success');
            return true;
        }
        return false;
    }

    register(username, email, password, confirmPassword) {
        // Simple registration validation
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return false;
        }
        
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return false;
        }
        
        // Create new user
        const user = {
            id: Date.now(),
            username: username,
            email: email,
            avatar: 'user',
            status: 'Available',
            joinDate: new Date().toLocaleDateString(),
            isOnline: true,
            isVisible: true,
            allowPrivateMessages: true
        };
        
        this.currentUser = user;
        this.users.set(user.id, user);
        this.onlineUsers.add(user.id);
        
        // Save to localStorage
        localStorage.setItem('phiritona_user', JSON.stringify(user));
        
        this.showApp();
        this.showNotification('Account created successfully!', 'success');
        return true;
    }

    logout() {
        if (this.currentUser) {
            this.onlineUsers.delete(this.currentUser.id);
        }
        
        this.currentUser = null;
        this.currentView = 'community';
        this.messages = [];
        this.privateChats.clear();
        this.notifications = [];
        
        localStorage.removeItem('phiritona_user');
        
        this.showAuth();
        this.showNotification('Logged out successfully', 'info');
    }

    // UI Update Methods
    updateUserInterface() {
        if (!this.currentUser) return;
        
        // Update user info in header and sidebar
        document.getElementById('currentUsername').textContent = this.currentUser.username;
        document.getElementById('sidebarUsername').textContent = this.currentUser.username;
        document.getElementById('userStatusMessage').textContent = this.currentUser.status;
        document.getElementById('profileUsername').textContent = this.currentUser.username;
        document.getElementById('profileEmail').textContent = this.currentUser.email;
        document.getElementById('memberSince').textContent = this.currentUser.joinDate;
        
        // Update avatar
        this.updateAvatar(this.currentUser.avatar);
        
        // Update online count
        this.updateOnlineCount();
        
        // Update status indicator
        const statusIndicator = document.getElementById('userStatus');
        statusIndicator.className = `status-indicator ${this.currentUser.isVisible ? 'online' : ''}`;
    }

    updateAvatar(avatarType) {
        const avatarElements = document.querySelectorAll('.avatar i, .current-avatar i');
        const iconClass = this.getAvatarIcon(avatarType);
        
        avatarElements.forEach(element => {
            element.className = iconClass;
        });
    }

    getAvatarIcon(avatarType) {
        const avatarMap = {
            'user': 'fas fa-user',
            'user-tie': 'fas fa-user-tie',
            'user-graduate': 'fas fa-user-graduate',
            'user-astronaut': 'fas fa-user-astronaut',
            'user-ninja': 'fas fa-user-ninja',
            'cat': 'fas fa-cat',
            'dog': 'fas fa-dog',
            'heart': 'fas fa-heart'
        };
        return avatarMap[avatarType] || 'fas fa-user';
    }

    updateOnlineCount() {
        document.getElementById('onlineCount').textContent = this.onlineUsers.size;
    }

    // Navigation Methods
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show selected view
        document.getElementById(`${viewName}-view`).classList.add('active');
        
        // Update menu active state
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        this.currentView = viewName;
        
        // Close sidebar on mobile
        this.closeSidebar();
        
        // Load view-specific content
        this.loadViewContent(viewName);
    }

    loadViewContent(viewName) {
        switch (viewName) {
            case 'community':
                this.loadCommunityChat();
                break;
            case 'private':
                this.loadPrivateMessages();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
            case 'privacy':
                this.loadPrivacySettings();
                break;
            case 'about':
                this.loadAbout();
                break;
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('open');
    }

    // Chat Methods
    loadCommunityChat() {
        const messagesContainer = document.getElementById('communityMessages');
        messagesContainer.innerHTML = '<div class="welcome-message"><p>Welcome to Phiritona Online Community Chat!</p><p>Connect and share ideas with your community.</p></div>';
        
        // Load existing messages
        this.messages.forEach(message => {
            this.displayMessage(message, messagesContainer);
        });
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage(content, type = 'text', chatType = 'community', recipientId = null) {
        if (!content.trim() && type === 'text') return;
        
        const message = {
            id: Date.now(),
            author: this.currentUser.username,
            authorId: this.currentUser.id,
            content: content,
            type: type,
            timestamp: new Date(),
            chatType: chatType,
            recipientId: recipientId
        };
        
        if (chatType === 'community') {
            this.messages.push(message);
            this.displayMessage(message, document.getElementById('communityMessages'));
        } else if (chatType === 'private' && recipientId) {
            const chatKey = this.getChatKey(this.currentUser.id, recipientId);
            if (!this.privateChats.has(chatKey)) {
                this.privateChats.set(chatKey, []);
            }
            this.privateChats.get(chatKey).push(message);
            
            // Update private chat if currently viewing
            if (this.currentPrivateChat === recipientId) {
                this.displayMessage(message, document.getElementById('privateMessages'));
            }
            
            // Add notification for recipient
            this.addNotification(`New message from ${this.currentUser.username}`, 'message', recipientId);
        }
        
        // Scroll to bottom
        const container = chatType === 'community' ? 
            document.getElementById('communityMessages') : 
            document.getElementById('privateMessages');
        container.scrollTop = container.scrollHeight;
    }

    displayMessage(message, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.authorId === this.currentUser.id ? 'own' : ''}`;
        
        const timeString = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let contentHtml = '';
        switch (message.type) {
            case 'text':
                contentHtml = this.escapeHtml(message.content);
                break;
            case 'image':
                contentHtml = `<img src="${message.content}" alt="Shared image" style="max-width: 200px; border-radius: 8px;">`;
                break;
            case 'video':
                contentHtml = `<video controls style="max-width: 200px; border-radius: 8px;"><source src="${message.content}"></video>`;
                break;
            case 'voice':
                contentHtml = `<audio controls><source src="${message.content}"></audio>`;
                break;
            case 'emoji':
                contentHtml = message.content;
                break;
        }
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-author">${this.escapeHtml(message.author)}</span>
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-content">${contentHtml}</div>
        `;
        
        container.appendChild(messageDiv);
        
        // Remove welcome message if it exists
        const welcomeMessage = container.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    // Private Chat Methods
    loadPrivateMessages() {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';
        
        if (this.privateChats.size === 0) {
            chatList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comment-slash"></i>
                    <p>No private conversations yet</p>
                    <p>Start a new chat to connect with someone!</p>
                </div>
            `;
            return;
        }
        
        // Display chat list
        this.privateChats.forEach((messages, chatKey) => {
            const [userId1, userId2] = chatKey.split('-');
            const otherUserId = userId1 == this.currentUser.id ? userId2 : userId1;
            const otherUser = this.users.get(parseInt(otherUserId)) || { username: 'Unknown User', avatar: 'user' };
            const lastMessage = messages[messages.length - 1];
            
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.onclick = () => this.openPrivateChat(parseInt(otherUserId));
            
            chatItem.innerHTML = `
                <div class="avatar small">
                    <i class="${this.getAvatarIcon(otherUser.avatar)}"></i>
                </div>
                <div class="chat-item-info">
                    <div class="chat-item-name">${this.escapeHtml(otherUser.username)}</div>
                    <div class="chat-item-message">${this.escapeHtml(lastMessage.content)}</div>
                </div>
            `;
            
            chatList.appendChild(chatItem);
        });
    }

    openPrivateChat(userId) {
        this.currentPrivateChat = userId;
        const user = this.users.get(userId) || { username: 'Unknown User', avatar: 'user' };
        
        // Update chat header
        document.getElementById('privateChatUsername').textContent = user.username;
        document.getElementById('privateChatStatus').textContent = this.onlineUsers.has(userId) ? 'Online' : 'Offline';
        document.getElementById('privateChatStatus').className = `status ${this.onlineUsers.has(userId) ? 'online' : ''}`;
        
        // Load messages
        const chatKey = this.getChatKey(this.currentUser.id, userId);
        const messages = this.privateChats.get(chatKey) || [];
        const messagesContainer = document.getElementById('privateMessages');
        messagesContainer.innerHTML = '';
        
        messages.forEach(message => {
            this.displayMessage(message, messagesContainer);
        });
        
        // Show private chat
        document.getElementById('chatList').classList.add('hidden');
        document.getElementById('privateChat').classList.remove('hidden');
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    backToPrivateList() {
        document.getElementById('chatList').classList.remove('hidden');
        document.getElementById('privateChat').classList.add('hidden');
        this.currentPrivateChat = null;
    }

    getChatKey(userId1, userId2) {
        return userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;
    }

    // Media Methods
    toggleMediaOptions() {
        const mediaOptions = document.getElementById('mediaOptions');
        mediaOptions.classList.toggle('hidden');
    }

    handleMediaOption(type) {
        switch (type) {
            case 'image':
                document.getElementById('imageInput').click();
                break;
            case 'video':
                document.getElementById('videoInput').click();
                break;
            case 'voice':
                this.toggleVoiceRecording();
                break;
        }
        this.toggleMediaOptions();
    }

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Create file URL (in real app, upload to server)
        const fileUrl = URL.createObjectURL(file);
        const chatType = this.currentView === 'community' ? 'community' : 'private';
        const recipientId = this.currentView === 'private' ? this.currentPrivateChat : null;
        
        this.sendMessage(fileUrl, type, chatType, recipientId);
        
        // Reset input
        event.target.value = '';
    }

    async toggleVoiceRecording() {
        if (!this.isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                const audioChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
                
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const chatType = this.currentView === 'community' ? 'community' : 'private';
                    const recipientId = this.currentView === 'private' ? this.currentPrivateChat : null;
                    
                    this.sendMessage(audioUrl, 'voice', chatType, recipientId);
                    
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };
                
                this.mediaRecorder.start();
                this.isRecording = true;
                this.showNotification('Recording voice note...', 'info');
                
                // Auto-stop after 30 seconds
                setTimeout(() => {
                    if (this.isRecording) {
                        this.toggleVoiceRecording();
                    }
                }, 30000);
                
            } catch (error) {
                this.showNotification('Microphone access denied', 'error');
            }
        } else {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.showNotification('Voice note recorded', 'success');
        }
    }

    // Emoji Methods
    toggleEmojiPicker() {
        const emojiPicker = document.getElementById('emojiPicker');
        emojiPicker.classList.toggle('hidden');
    }

    insertEmoji(emoji) {
        const messageInput = this.currentView === 'community' ? 
            document.getElementById('messageInput') : 
            document.getElementById('privateMessageInput');
        
        messageInput.value += emoji;
        messageInput.focus();
        this.toggleEmojiPicker();
    }

    // Profile Methods
    loadProfile() {
        if (!this.currentUser) return;
        
        document.getElementById('statusMessageInput').value = this.currentUser.status;
        this.updateAvatar(this.currentUser.avatar);
    }

    updateStatus() {
        const newStatus = document.getElementById('statusMessageInput').value.trim();
        if (newStatus && this.currentUser) {
            this.currentUser.status = newStatus;
            localStorage.setItem('phiritona_user', JSON.stringify(this.currentUser));
            this.updateUserInterface();
            this.showNotification('Status updated successfully', 'success');
        }
    }

    changeAvatar(avatarType) {
        if (this.currentUser) {
            this.currentUser.avatar = avatarType;
            localStorage.setItem('phiritona_user', JSON.stringify(this.currentUser));
            this.updateAvatar(avatarType);
            this.closeModal('avatar-modal');
            this.showNotification('Avatar updated successfully', 'success');
        }
    }

    // Notification Methods
    loadNotifications() {
        const container = document.getElementById('notificationsContainer');
        
        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications</p>
                    <p>You're all caught up!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        this.notifications.forEach(notification => {
            const notificationDiv = document.createElement('div');
            notificationDiv.className = 'notification-item';
            notificationDiv.innerHTML = `
                <div class="notification-content">
                    <p>${this.escapeHtml(notification.message)}</p>
                    <span class="notification-time">${notification.timestamp.toLocaleString()}</span>
                </div>
                <button class="close-notification" onclick="app.removeNotification('${notification.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(notificationDiv);
        });
    }

    addNotification(message, type, userId = null) {
        const notification = {
            id: Date.now().toString(),
            message: message,
            type: type,
            timestamp: new Date(),
            userId: userId
        };
        
        this.notifications.unshift(notification);
        this.updateNotificationBadge();
        
        // Show toast notification
        this.showNotification(message, type);
    }

    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.updateNotificationBadge();
        this.loadNotifications();
    }

    clearAllNotifications() {
        this.notifications = [];
        this.updateNotificationBadge();
        this.loadNotifications();
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (this.notifications.length > 0) {
            badge.textContent = this.notifications.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${this.escapeHtml(message)}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle',
            'message': 'comment'
        };
        return icons[type] || 'info-circle';
    }

    // Privacy Methods
    loadPrivacySettings() {
        if (!this.currentUser) return;
        
        document.getElementById('visibilityToggle').checked = this.currentUser.isVisible;
        document.getElementById('privateMessagesToggle').checked = this.currentUser.allowPrivateMessages;
        
        this.loadBlockedUsers();
    }

    updatePrivacySetting(setting, value) {
        if (!this.currentUser) return;
        
        this.currentUser[setting] = value;
        localStorage.setItem('phiritona_user', JSON.stringify(this.currentUser));
        
        if (setting === 'isVisible') {
            this.updateUserInterface();
        }
        
        this.showNotification('Privacy settings updated', 'success');
    }

    loadBlockedUsers() {
        const container = document.getElementById('blockedUsers');
        
        if (this.blockedUsers.size === 0) {
            container.innerHTML = '<div class="empty-state"><p>No blocked users</p></div>';
            return;
        }
        
        container.innerHTML = '';
        this.blockedUsers.forEach(userId => {
            const user = this.users.get(userId) || { username: 'Unknown User' };
            const userDiv = document.createElement('div');
            userDiv.className = 'blocked-user-item';
            userDiv.innerHTML = `
                <span>${this.escapeHtml(user.username)}</span>
                <button class="btn-secondary" onclick="app.unblockUser(${userId})">Unblock</button>
            `;
            container.appendChild(userDiv);
        });
    }

    blockUser(userId) {
        this.blockedUsers.add(userId);
        this.showNotification('User blocked successfully', 'success');
        this.loadBlockedUsers();
    }

    unblockUser(userId) {
        this.blockedUsers.delete(userId);
        this.showNotification('User unblocked successfully', 'success');
        this.loadBlockedUsers();
    }

    // About Methods
    loadAbout() {
        // About page is static, no dynamic loading needed
    }

    // Modal Methods
    showModal(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById('modal-overlay').classList.add('hidden');
        if (modalId) {
            document.getElementById(modalId).classList.add('hidden');
        } else {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    }

    // Search Methods
    searchUsers(query) {
        if (!query.trim()) {
            document.getElementById('usersList').innerHTML = '<div class="empty-state"><p>Search for users to start a conversation</p></div>';
            return;
        }
        
        // Simulate user search (in real app, this would be server-side)
        const mockUsers = [
            { id: 101, username: 'alice_wonder', avatar: 'user' },
            { id: 102, username: 'bob_builder', avatar: 'user-tie' },
            { id: 103, username: 'charlie_brown', avatar: 'user-graduate' },
            { id: 104, username: 'diana_prince', avatar: 'heart' }
        ];
        
        const filteredUsers = mockUsers.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase())
        );
        
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';
        
        if (filteredUsers.length === 0) {
            usersList.innerHTML = '<div class="empty-state"><p>No users found</p></div>';
            return;
        }
        
        filteredUsers.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.onclick = () => this.startPrivateChat(user);
            userDiv.innerHTML = `
                <div class="avatar small">
                    <i class="${this.getAvatarIcon(user.avatar)}"></i>
                </div>
                <div class="user-info">
                    <div class="user-name">${this.escapeHtml(user.username)}</div>
                    <div class="user-status">Available</div>
                </div>
            `;
            usersList.appendChild(userDiv);
        });
    }

    startPrivateChat(user) {
        // Add user to users map
        this.users.set(user.id, user);
        
        // Create empty chat if doesn't exist
        const chatKey = this.getChatKey(this.currentUser.id, user.id);
        if (!this.privateChats.has(chatKey)) {
            this.privateChats.set(chatKey, []);
        }
        
        // Close modal and switch to private messages
        this.closeModal('new-chat-modal');
        this.showView('private');
        
        // Open the chat
        setTimeout(() => {
            this.openPrivateChat(user.id);
        }, 100);
        
        this.showNotification(`Started conversation with ${user.username}`, 'success');
    }

    // Utility Methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Event Listeners
    initEventListeners() {
        // Authentication
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            if (this.login(username, password)) {
                document.getElementById('loginForm').reset();
            } else {
                this.showNotification('Invalid credentials', 'error');
            }
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (this.register(username, email, password, confirmPassword)) {
                document.getElementById('registerForm').reset();
            }
        });

        // Auth form switching
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });

        // Navigation
        document.getElementById('menu-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Menu items
        document.querySelectorAll('.menu-item[data-view]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.showView(view);
            });
        });

        // Chat functionality
        document.getElementById('sendBtn').addEventListener('click', () => {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (message) {
                this.sendMessage(message, 'text', 'community');
                input.value = '';
            }
        });

        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = e.target.value.trim();
                if (message) {
                    this.sendMessage(message, 'text', 'community');
                    e.target.value = '';
                }
            }
        });

        // Private chat
        document.getElementById('privateSendBtn').addEventListener('click', () => {
            const input = document.getElementById('privateMessageInput');
            const message = input.value.trim();
            if (message && this.currentPrivateChat) {
                this.sendMessage(message, 'text', 'private', this.currentPrivateChat);
                input.value = '';
            }
        });

        document.getElementById('privateMessageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = e.target.value.trim();
                if (message && this.currentPrivateChat) {
                    this.sendMessage(message, 'text', 'private', this.currentPrivateChat);
                    e.target.value = '';
                }
            }
        });

        document.getElementById('backToList').addEventListener('click', () => {
            this.backToPrivateList();
        });

        // Media functionality
        document.getElementById('mediaBtn').addEventListener('click', () => {
            this.toggleMediaOptions();
        });

        document.querySelectorAll('.media-option').forEach(option => {
            option.addEventListener('click', () => {
                const type = option.getAttribute('data-type');
                this.handleMediaOption(type);
            });
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleFileUpload(e, 'image');
        });

        document.getElementById('videoInput').addEventListener('change', (e) => {
            this.handleFileUpload(e, 'video');
        });

        // Emoji functionality
        document.getElementById('emojiBtn').addEventListener('click', () => {
            this.toggleEmojiPicker();
        });

        document.querySelectorAll('.emoji').forEach(emoji => {
            emoji.addEventListener('click', () => {
                this.insertEmoji(emoji.textContent);
            });
        });

        // Profile functionality
        document.getElementById('updateStatusBtn').addEventListener('click', () => {
            this.updateStatus();
        });

        document.getElementById('changeAvatarBtn').addEventListener('click', () => {
            this.showModal('avatar-modal');
        });

        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', () => {
                const avatarType = option.getAttribute('data-avatar');
                this.changeAvatar(avatarType);
            });
        });

        // Notifications
        document.getElementById('notifications-btn').addEventListener('click', () => {
            this.showView('notifications');
        });

        document.getElementById('clearAllNotifications').addEventListener('click', () => {
            this.clearAllNotifications();
        });

        // Privacy settings
        document.getElementById('visibilityToggle').addEventListener('change', (e) => {
            this.updatePrivacySetting('isVisible', e.target.checked);
        });

        document.getElementById('privateMessagesToggle').addEventListener('change', (e) => {
            this.updatePrivacySetting('allowPrivateMessages', e.target.checked);
        });

        // Modal functionality
        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.showModal('new-chat-modal');
        });

        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        // User search
        document.getElementById('searchUsers').addEventListener('input', (e) => {
            this.searchUsers(e.target.value);
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.media-btn') && !e.target.closest('.media-options')) {
                document.getElementById('mediaOptions').classList.add('hidden');
            }
            if (!e.target.closest('.emoji-btn') && !e.target.closest('.emoji-picker')) {
                document.getElementById('emojiPicker').classList.add('hidden');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals and dropdowns
            if (e.key === 'Escape') {
                this.closeModal();
                document.getElementById('mediaOptions').classList.add('hidden');
                document.getElementById('emojiPicker').classList.add('hidden');
            }
        });
    }
}

// Add toast styles dynamically
const toastStyles = `
<style>
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 1rem;
    min-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10000;
    border-left: 4px solid var(--primary-color);
}

.toast.show {
    transform: translateX(0);
}

.toast-success {
    border-left-color: #28a745;
}

.toast-error {
    border-left-color: #dc3545;
}

.toast-warning {
    border-left-color: #ffc107;
}

.toast-info {
    border-left-color: #17a2b8;
}

.toast-message {
    border-left-color: var(--primary-color);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.toast-content i {
    font-size: 1.2rem;
}

.toast-success .toast-content i {
    color: #28a745;
}

.toast-error .toast-content i {
    color: #dc3545;
}

.toast-warning .toast-content i {
    color: #ffc107;
}

.toast-info .toast-content i {
    color: #17a2b8;
}

.toast-message .toast-content i {
    color: var(--primary-color);
}

.notification-item {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.notification-content {
    flex: 1;
}

.notification-time {
    color: var(--text-light);
    font-size: 0.8rem;
    margin-top: 0.5rem;
}

.close-notification {
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: var(--transition);
}

.close-notification:hover {
    background: var(--surface-color);
    color: var(--text-primary);
}

.blocked-user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
    .toast {
        right: 10px;
        left: 10px;
        min-width: auto;
        transform: translateY(-100%);
    }
    
    .toast.show {
        transform: translateY(0);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);

// Initialize the app
const app = new PhiritonaOnline();