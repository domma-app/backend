# DOMMA Backend

This is a Node.js backend project using **TypeScript**, **Hapi.js**, **Prisma ORM**, and **PostgreSQL**. The application provides APIs for financial management including transactions, budgets, challenges, and user profiles with file upload capabilities via Supabase Storage.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v20 or higher)
- **npm**
- **PostgreSQL** database
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/domma-app/backend.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/domma_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Supabase Configuration (for file uploads)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-supabase-service-role-key"

# Midtrans Configuration (for payments)
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
```

#### How to Obtain Environment Variables

##### **Database (PostgreSQL)**
1. **Local Setup**: Install PostgreSQL locally or use Docker
   ```bash
   # Using Docker
   docker run --name postgres-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=domma_db -p 5432:5432 -d postgres
   ```
2. **Cloud Options**: Use services like:
   - [Supabase](https://supabase.com) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)

##### **JWT Secret**
Generate a secure random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

##### **Supabase Configuration**
1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** → `SUPABASE_URL`
4. Copy the **service_role** key → `SUPABASE_SERVICE_KEY`
5. Create a storage bucket named `profile-pictures` in **Storage** section

##### **Midtrans Configuration** (Optional - for payment features)
1. Sign up at [Midtrans](https://midtrans.com)
2. Get your **Server Key** and **Client Key** from the dashboard
3. Set `MIDTRANS_IS_PRODUCTION=false` for sandbox testing

### 4. Database Setup

#### Run Prisma Migrations
```bash
npm run prisma:migrate
```

#### Generate Prisma Client
```bash
npm run prisma:generate
```

#### (Optional) Seed the Database
```bash
npm run prisma:seed
```

#### (Optional) View Database with Prisma Studio
```bash
npm run prisma:studio
```

### 5. Start the Development Server

```bash
npm run dev
```

The server should now be running on `http://localhost:3000` (or your configured port).

### 6. API Documentation

Once the server is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:3000/documentation`
- **API Base URL**: `http://localhost:3000/api/v1`

---

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build the TypeScript code
npm start           # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed the database
npm run prisma:studio      # Open Prisma Studio

# Testing
npm test            # Run tests
```

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── common/           # Shared utilities and middleware
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Global middleware
│   │   └── plugins/      # Hapi plugins
│   ├── core/             # Core services
│   │   └── supabase/     # Supabase integration
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── budget/       # Budget management
│   │   ├── challenge/    # Financial challenges
│   │   ├── dashboard/    # Dashboard analytics
│   │   ├── profile/      # User profiles
│   │   └── transaction/  # Transaction management
│   └── server.ts         # Main server file
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Database seeder
└── package.json
```

---

## 🔧 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Hapi.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **File Storage**: Supabase Storage
- **Payment Processing**: Midtrans
- **Documentation**: Swagger/OpenAPI
- **Development**: ts-node-dev for hot reload

---

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Use strong, unique JWT secrets in production
- Keep your Supabase service keys secure
- Use environment-specific configurations
- Enable CORS appropriately for your frontend

---

## 🚀 Deployment

### Production Environment Variables
For production deployment, ensure you have:
- `NODE_ENV=production`
- Production database URL
- Strong JWT secret
- Production Midtrans keys (if using payments)
- Proper CORS configuration

### Build for Production
```bash
npm run build
npm start
```

---

## 📝 API Endpoints

The API is versioned under `/api/v1/` and includes:

- **Authentication**: `/auth/*`
- **Transactions**: `/transactions/*`
- **Budgets**: `/budgets/*`
- **Challenges**: `/challenges/*`
- **Profiles**: `/profiles/*`
- **Dashboard**: `/dashboard/*`

For detailed API documentation, visit the Swagger UI when the server is running.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.
