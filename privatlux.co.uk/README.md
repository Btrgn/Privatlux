<<<<<<< HEAD
# PrivatLux - Premium Escort Directory Website

A modern, full-featured escort directory website similar to Vivastreet, built with Next.js and Node.js. This platform provides a secure, user-friendly interface for escort listings, user management, and premium features.

## Features

### 🏠 **Homepage**
- Hero section with search functionality
- Featured escorts showcase
- Statistics and testimonials
- Responsive design with modern UI

### 👥 **User Management**
- User registration and authentication
- Role-based access (User, Escort, Admin)
- Profile management
- Password reset functionality

### 🔍 **Escort Directory**
- Advanced search and filtering
- Pagination with infinite scroll option
- Location-based search
- Age, body type, and service filters
- Verified escort badges
- Premium listing highlights

### 💎 **Premium Features**
- Featured listings
- Premium profile badges
- Enhanced visibility
- Priority in search results

### 📱 **Mobile Responsive**
- Fully responsive design
- Mobile-first approach
- Touch-friendly interface
- Progressive Web App capabilities

### 🔒 **Security**
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS protection

### 📊 **Admin Panel**
- User management
- Content moderation
- Analytics dashboard
- Payment management

## Technology Stack

### **Frontend**
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Image Handling**: Next.js Image Optimization

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Payments**: Stripe
- **Security**: Helmet, CORS, Rate Limiting

### **DevOps & Deployment**
- **Package Manager**: npm
- **Process Manager**: PM2 (recommended)
- **Environment**: Docker support
- **CDN**: Cloudinary for images
- **Monitoring**: Built-in health checks

## Project Structure

```
privatlux.co.uk/
├── frontend/                   # Next.js frontend application
│   ├── pages/                 # Next.js pages
│   │   ├── index.js          # Homepage
│   │   ├── escorts/          # Escort listing and profiles
│   │   ├── login.js          # Authentication pages
│   │   ├── register.js
│   │   ├── admin/            # Admin panel
│   │   └── ...
│   ├── components/           # Reusable React components
│   │   ├── Navbar.js
│   │   ├── EscortCard.js
│   │   ├── SearchFilters.js
│   │   └── ...
│   ├── styles/               # Global styles
│   └── public/               # Static assets
├── backend/                   # Express.js backend API
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Escort.js
│   │   ├── Message.js
│   │   └── ...
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── controllers/          # Route controllers
│   └── app.js               # Main application file
└── README.md                 # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd privatlux.co.uk
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm run install:all

# Or install manually
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Required variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

#### Frontend Environment (.env.local)
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

### 4. Database Setup
Ensure MongoDB is running and accessible via the URI in your environment file.

### 5. Start Development Servers

#### Option 1: Start both frontend and backend together
```bash
npm run dev
```

#### Option 2: Start individually
```bash
# Backend (from root directory)
npm run dev:backend

# Frontend (in a new terminal)
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Escorts
- `GET /api/escorts` - Get escorts with filtering
- `GET /api/escorts/:id` - Get single escort
- `POST /api/escorts` - Create escort profile
- `PUT /api/escorts/:id` - Update escort profile
- `GET /api/escorts/featured/list` - Get featured escorts

### Users
- `GET /api/users/favorites` - Get user favorites
- `POST /api/escorts/:id/favorite` - Toggle favorite

## Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration including:
- Custom color palette (primary pink theme)
- Extended spacing and typography
- Custom components and utilities

### Next.js Configuration
- Image optimization enabled
- API proxy to backend
- Custom rewrites for API routes

### Security Features
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- JWT token expiration (7 days)

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production servers
npm start
```

### Environment Variables for Production
Update environment variables for production:
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Configure proper CORS origins
- Set up SSL certificates
- Configure CDN for static assets

### Recommended Deployment Stack
- **Hosting**: VPS, AWS EC2, or similar
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2
- **Database**: MongoDB Atlas or self-hosted
- **CDN**: Cloudinary for images
- **SSL**: Let's Encrypt

## Features Roadmap

### Phase 1 (Current)
- ✅ Basic escort directory
- ✅ User authentication
- ✅ Search and filtering
- ✅ Responsive design

### Phase 2 (Planned)
- 📨 Private messaging system
- ⭐ Review and rating system
- 💳 Payment integration
- 📧 Email notifications

### Phase 3 (Future)
- 🗺️ Map integration
- 📱 Mobile app
- 🔔 Push notifications
- 📊 Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

This application includes several security measures:
- Input validation and sanitization
- SQL injection prevention (MongoDB)
- XSS protection
- CSRF protection
- Rate limiting
- Secure headers

For security concerns, please email: security@privatlux.co.uk

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and questions:
- Email: support@privatlux.co.uk
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## Acknowledgments

- Built with modern web technologies
- Inspired by industry-leading directory platforms
- UI/UX designed for optimal user experience
- Performance optimized for scale

---

**Note**: This is a demonstration project. Ensure compliance with local laws and regulations when deploying similar platforms in your jurisdiction.
=======
# Privatlux
>>>>>>> 5260f277910ba4e64ae3fc367b1b61c8a4e20469
