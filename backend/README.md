# TravelEase Backend

A comprehensive backend system for the TravelEase tourism platform built with Node.js, Express, PostgreSQL, MongoDB, and AI-powered recommendations.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with Google OAuth integration
- **Roadmap Generator** - AI-powered personalized travel itineraries with PDF export
- **Hotel Recommendations** - Location-based hotel suggestions with budget filtering
- **Food Finder** - Restaurant and food stall recommendations with maps integration
- **Transportation** - Real-time transport options with price estimates
- **Hidden Gems** - User-generated content with admin approval system
- **Reward System** - Points-based rewards with voucher/recharge redemption

### Advanced Features
- **AI Recommendations** - Machine learning-powered suggestions
- **Real-time Updates** - WebSocket integration for live updates
- **File Upload** - Cloudinary integration for image management
- **Email & SMS** - Automated notifications and OTP verification
- **Analytics** - User behavior tracking and system metrics
- **Caching** - Redis-based caching for performance optimization

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Databases**: PostgreSQL (Prisma ORM) + MongoDB (Mongoose)
- **Authentication**: JWT + OAuth 2.0 (Google)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **SMS**: Twilio
- **Caching**: Redis
- **AI/ML**: TensorFlow.js
- **PDF Generation**: PDFKit
- **Real-time**: Socket.io
- **Security**: Helmet, bcrypt, rate limiting

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 13+
- MongoDB 5.0+
- Redis 6.0+
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travelease-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in all the required environment variables in `.env`

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run generate
   
   # Run database migrations
   npm run migrate
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/send-phone-otp` - Send phone OTP
- `POST /api/auth/verify-phone-otp` - Verify phone OTP
- `POST /api/auth/refresh-token` - Refresh access token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile picture

### Roadmap
- `POST /api/roadmap` - Create roadmap
- `GET /api/roadmap` - Get user roadmaps
- `GET /api/roadmap/:id` - Get roadmap by ID
- `PUT /api/roadmap/:id` - Update roadmap
- `DELETE /api/roadmap/:id` - Delete roadmap
- `POST /api/roadmap/generate` - Generate AI roadmap
- `GET /api/roadmap/:id/download` - Download roadmap PDF

### Hotels
- `GET /api/hotels` - Search hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels/:id/favorite` - Toggle hotel favorite
- `POST /api/hotels/:id/review` - Add hotel review

### Food
- `GET /api/food/restaurants` - Search restaurants
- `GET /api/food/recommendations` - Get AI food recommendations
- `POST /api/food/:id/favorite` - Toggle restaurant favorite

### Transportation
- `GET /api/transport/options` - Get transport options
- `GET /api/transport/prices` - Get price estimates
- `POST /api/transport/book` - Book transportation

### Hidden Gems
- `POST /api/hidden-gems` - Submit hidden gem
- `GET /api/hidden-gems` - Get approved hidden gems
- `GET /api/hidden-gems/my-gems` - Get user's submissions
- `PUT /api/hidden-gems/:id` - Update hidden gem
- `DELETE /api/hidden-gems/:id` - Delete hidden gem

### Rewards
- `GET /api/rewards/balance` - Get reward balance
- `GET /api/rewards/available` - Get available rewards
- `POST /api/rewards/redeem` - Redeem reward
- `GET /api/rewards/transactions` - Get transaction history

### Admin
- `GET /api/admin/hidden-gems/pending` - Get pending gems
- `PUT /api/admin/hidden-gems/:id/approve` - Approve hidden gem
- `PUT /api/admin/hidden-gems/:id/reject` - Reject hidden gem
- `GET /api/admin/analytics` - Get system analytics

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Protection** with configurable origins
- **Helmet** for security headers
- **SQL Injection Protection** via Prisma ORM
- **XSS Protection** through input sanitization

## 📊 Database Schema

### PostgreSQL (Prisma)
- Users, Roadmaps, Hotels, Restaurants
- Hidden Gems, Reviews, Favorites
- Bookings, Reward Transactions

### MongoDB
- User Activity Analytics
- Search Analytics
- AI Recommendation Logs
- System Performance Metrics

## 🤖 AI Features

- **Personalized Roadmaps** - Based on user preferences and history
- **Hotel Recommendations** - Location and budget-based scoring
- **Restaurant Suggestions** - Cuisine and price range matching
- **Crowd Prediction** - Historical data analysis
- **Smart Filtering** - ML-powered search results

## 📈 Performance Optimization

- **Redis Caching** for frequently accessed data
- **Database Indexing** for optimized queries
- **Image Optimization** via Cloudinary transformations
- **Compression** middleware for response optimization
- **Connection Pooling** for database efficiency

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database URLs
3. Set up SSL certificates
4. Configure reverse proxy (Nginx)
5. Set up monitoring and logging

### AWS Deployment
```bash
# Build the application
npm run build

# Deploy to AWS EC2/ECS/Lambda
# Configure RDS for PostgreSQL
# Set up ElastiCache for Redis
# Configure S3 for file storage
```

## 📝 Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com

# Databases
DATABASE_URL=postgresql://user:pass@host:5432/db
MONGODB_URI=mongodb://host:27017/db
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# External Services
CLOUDINARY_CLOUD_NAME=your-cloud-name
TWILIO_ACCOUNT_SID=your-twilio-sid
EMAIL_USER=your-email@gmail.com
GOOGLE_MAPS_API_KEY=your-maps-api-key
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📚 API Documentation

Detailed API documentation is available at `/api/docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@travelease.com
- Documentation: [docs.travelease.com](https://docs.travelease.com)