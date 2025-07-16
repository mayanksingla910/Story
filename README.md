# 🌐 ZYNC - Real-time Chat Application

A beautiful, modern real-time chat application built with React, Node.js, Socket.IO, and MongoDB. ZYNC provides a seamless messaging experience with a stunning dark theme and all the essential features you'd expect from a modern chat app.

![ZYNC Chat](https://img.shields.io/badge/ZYNC-Chat%20App-6366f1?style=for-the-badge&logo=react)

## ✨ Features

### 🔐 Core Features (MVP)
- **User Authentication** - Secure signup/login with hashed passwords and JWT sessions
- **Real-time Messaging** - Instant messaging with WebSocket connections via Socket.IO
- **Private Conversations** - 1-on-1 chat rooms with message history
- **Online Status** - See who's online and available to chat
- **Typing Indicators** - Real-time typing indicators with animated dots
- **Message Status** - Delivered and read receipts with visual indicators
- **Timestamps** - Beautiful time formatting with moment.js
- **Basic Profile** - User profiles with avatars and bio

### 🎨 UI/UX Features
- **Beautiful Dark Theme** - Modern glassmorphism design with gradient accents
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Material-UI Components** - Polished interface with Google's Material Design
- **Smooth Animations** - Delightful micro-interactions and transitions
- **Emoji Support** - Full emoji picker with search and categories
- **Custom Scrollbars** - Styled scrollbars that match the theme

### 🔮 Advanced Features (Planned)
- Group chats
- File/image sharing
- Push notifications
- Message editing/deleting
- Voice/video calling
- AI chatbot integration

## 🏗️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Frontend
- **React 18** - Modern UI library with hooks
- **Material-UI (MUI)** - React component library
- **Socket.IO Client** - Real-time client communication
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Moment.js** - Date/time formatting
- **React Toastify** - Beautiful notifications
- **Emoji Picker React** - Emoji selection component

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zync-chat
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (backend + frontend)
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zync_chat
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud database
   ```

5. **Run the application**
   ```bash
   # Development mode (starts both backend and frontend)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Open your browser**
   ```
   Frontend: http://localhost:3000
   Backend API: http://localhost:5000
   ```

## 📁 Project Structure

```
zync-chat/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   │   ├── User.js         # User model with auth
│   │   ├── Conversation.js # Chat conversations
│   │   └── Message.js      # Chat messages
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management
│   │   ├── messages.js     # Message operations
│   │   └── conversations.js# Conversation management
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── socketAuth.js   # Socket authentication
│   ├── socket/             # Socket.IO handlers
│   │   └── socketHandlers.js# Real-time event handlers
│   ├── server.js           # Main server file
│   └── .env.example        # Environment variables template
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Sidebar.js  # Chat sidebar
│   │   │   ├── ChatArea.js # Main chat interface
│   │   │   ├── MessageList.js     # Message display
│   │   │   ├── MessageInput.js    # Message input
│   │   │   ├── TypingIndicator.js # Typing animation
│   │   │   ├── WelcomeScreen.js   # Welcome page
│   │   │   └── LoadingSpinner.js  # Loading component
│   │   ├── pages/          # Page components
│   │   │   ├── LoginPage.js# Login interface
│   │   │   ├── RegisterPage.js    # Registration
│   │   │   └── ChatPage.js # Main chat page
│   │   ├── contexts/       # React contexts
│   │   │   ├── AuthContext.js     # Authentication state
│   │   │   └── SocketContext.js   # Socket connection
│   │   ├── services/       # API services
│   │   │   ├── authService.js     # Auth API calls
│   │   │   └── chatService.js     # Chat API calls
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with search)
- `GET /api/users/online` - Get online users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile

### Conversations
- `GET /api/conversations` - Get user's conversations
- `POST /api/conversations/private` - Create/get private conversation
- `GET /api/conversations/:id` - Get specific conversation

### Messages
- `GET /api/messages/conversation/:id` - Get conversation messages
- `PUT /api/messages/read/:conversationId` - Mark messages as read

## 🔌 Socket Events

### Client → Server
- `send-message` - Send a new message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `join-conversation` - Join conversation room
- `leave-conversation` - Leave conversation room
- `mark-read` - Mark message as read

### Server → Client
- `new-message` - Receive new message
- `user-online` - User came online
- `user-offline` - User went offline
- `user-typing` - Someone started typing
- `user-stop-typing` - Someone stopped typing
- `message-read` - Message was read

## 🎨 UI Components

### Key Features
- **Glassmorphism Design** - Modern frosted glass effects
- **Gradient Accents** - Beautiful indigo to pink gradients
- **Responsive Layout** - Mobile-first responsive design
- **Dark Theme** - Eye-friendly dark color scheme
- **Smooth Animations** - CSS and Material-UI animations
- **Custom Scrollbars** - Styled scrollbars matching the theme

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Background**: `#0f172a` (Slate-900)
- **Surface**: `#1e293b` (Slate-800)
- **Text Primary**: `#f8fafc` (Slate-50)
- **Text Secondary**: `#cbd5e1` (Slate-300)

## 🚀 Development

### Available Scripts

```bash
# Root scripts
npm run dev          # Start both backend and frontend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
npm start           # Start production server

# Backend scripts (in backend/)
npm start           # Start production server
npm run dev         # Start development server with nodemon

# Frontend scripts (in frontend/)
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

### Development Tips

1. **Environment Variables**: Always use the `.env` file for configuration
2. **Socket Debugging**: Use browser dev tools to monitor WebSocket connections
3. **Database**: Use MongoDB Compass for database visualization
4. **API Testing**: Use Postman or Thunder Client for API testing
5. **Hot Reload**: Both frontend and backend support hot reloading

## 📱 Mobile Support

ZYNC is fully responsive and works beautifully on mobile devices:
- **Mobile Navigation**: Collapsible sidebar with hamburger menu
- **Touch Interactions**: Optimized for touch screens
- **Responsive Layout**: Adapts to all screen sizes
- **Mobile Keyboard**: Proper handling of mobile keyboards

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper CORS setup
- **Helmet Security**: Security headers with Helmet.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Socket.IO** for real-time communication
- **MongoDB** for the flexible database
- **React** for the powerful UI framework
- **Express.js** for the robust backend framework

---

<div align="center">
  <strong>Built with ❤️ for real-time communication</strong>
  <br>
  <sub>ZYNC - Connecting people instantly</sub>
</div>