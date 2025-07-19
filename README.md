# PrivatLux - Premium Escort & Massage Services Platform

A comprehensive, professional website similar to Vivastreet's escort and massage section, personalized for PrivatLux.co.uk.

## 🚀 Features

### Frontend Features
- **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- **User Authentication**: Complete login/registration system
- **Escort Listings**: Advanced search and filtering
- **Profile Management**: Detailed escort profiles with image galleries
- **Real-time Messaging**: Private messaging between users
- **Reviews & Ratings**: User review system
- **Favorites**: Save and manage favorite escorts
- **Responsive Design**: Mobile-first approach

### Backend Features
- **RESTful API**: Complete Node.js/Express backend
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **File Upload**: Image upload with Cloudinary integration
- **Real-time Features**: Socket.IO for live messaging
- **Payment Integration**: Stripe for premium features
- **Email System**: Nodemailer for notifications
- **Security**: Rate limiting, input validation, CORS

### User Roles
- **Clients**: Browse, search, message, review escorts
- **Escorts**: Create profiles, manage listings, receive messages
- **Admins**: Manage users, moderate content, view analytics

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Context + React Query
- **Authentication**: JWT with cookies
- **Real-time**: Socket.IO client
- **UI Components**: Heroicons, custom components

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **File Storage**: Cloudinary
- **Real-time**: Socket.IO
- **Payments**: Stripe
- **Email**: Nodemailer

## 📁 Project Structure

```
privatlux.co.uk/
├── frontend/                 # Next.js frontend application
│   ├── pages/               # Next.js pages
│   │   ├── index.js         # Homepage
│   │   ├── escorts/         # Escort listings and profiles
│   │   ├── login.js         # Authentication
│   │   ├── register.js      # User registration
│   │   ├── messages.js      # Private messaging
│   │   ├── favorites.js     # User favorites
│   │   └── admin/           # Admin dashboard
│   ├── components/          # Reusable React components
│   │   ├── EscortCard.js    # Escort profile card
│   │   ├── Navbar.js        # Navigation component
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.js   # Authentication context
│   └── styles/              # CSS and styling
│       └── globals.css      # Global styles
├── backend/                 # Node.js backend API
│   ├── models/              # Mongoose models
│   │   ├── User.js          # User model
│   │   ├── Escort.js        # Escort profile model
│   │   ├── Message.js       # Message model
│   │   ├── Review.js        # Review model
│   │   └── Payment.js       # Payment model
│   ├── routes/              # Express routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── escorts.js       # Escort management
│   │   ├── messages.js      # Messaging system
│   │   ├── reviews.js       # Review system
│   │   ├── payments.js      # Payment processing
│   │   └── admin.js         # Admin functionality
│   ├── controllers/         # Route controllers
│   ├── services/            # Business logic
│   └── app.js               # Express application
├── public/                  # Static assets
│   └── images/              # Image assets
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd privatlux-website
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

3. **Environment Setup**

Create `.env` files:

**Backend (`backend/.env`)**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/privatlux
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3001

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Frontend (`frontend/.env.local`)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

4. **Database Setup**
- Install and start MongoDB
- The application will create necessary collections automatically

5. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run backend    # Backend only (port 5000)
npm run frontend   # Frontend only (port 3001)
```

6. **Access the Application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/logout` - Logout

### Escort Endpoints
- `GET /api/escorts` - Get all escorts (with filters)
- `GET /api/escorts/:id` - Get escort by ID
- `POST /api/escorts` - Create escort profile
- `PUT /api/escorts/:id` - Update escort profile
- `DELETE /api/escorts/:id` - Delete escort profile
- `POST /api/escorts/:id/favorite` - Add to favorites
- `DELETE /api/escorts/:id/favorite` - Remove from favorites

### Message Endpoints
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversation/:id` - Get messages in conversation
- `POST /api/messages/send` - Send message

### Review Endpoints
- `GET /api/reviews/escort/:id` - Get escort reviews
- `POST /api/reviews` - Create review

## 🎨 Customization

### Styling
- Colors and themes can be modified in `frontend/tailwind.config.js`
- Global styles in `frontend/styles/globals.css`
- Component-specific styles using Tailwind classes

### Features
- Add new user roles by modifying the User model
- Extend escort profiles by updating the Escort model
- Add new pages by creating files in `frontend/pages/`

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for security headers
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `frontend` folder to your hosting platform
3. Set environment variables in your hosting dashboard

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB (Atlas recommended for production)
2. Configure all environment variables
3. Deploy the `backend` folder
4. Update frontend API URL to point to production backend

### Database
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backups and monitoring

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@privatlux.co.uk
- Documentation: [Link to docs]
- Issues: Create an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced messaging system
- **v1.2.0** - Payment integration
- **v2.0.0** - Mobile app companion

---

Built with ❤️ for PrivatLux.co.uk