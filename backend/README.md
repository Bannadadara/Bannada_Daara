# Bannada Daara Backend API

Backend server for Bannada Daara e-commerce website with MongoDB integration.

## Features

- ✅ User authentication with JWT
- ✅ Product management (CRUD)
- ✅ Order processing
- ✅ Newsletter subscriptions
- ✅ Admin dashboard support
- ✅ MongoDB Atlas integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://bannadadara_db_user:Welcome@1588@cluster0.yscdl8k.mongodb.net/bannadadara?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=https://bannadadara.github.io/Bannadadara
```

### 3. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (admin only)

### Subscribers
- `POST /api/subscribers` - Subscribe to newsletter
- `GET /api/subscribers` - Get all subscribers (admin only)
- `DELETE /api/subscribers/:email` - Unsubscribe

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the backend directory
3. Set environment variables in Vercel dashboard

### Option 2: Railway

1. Connect GitHub repository to Railway
2. Set root directory to `backend`
3. Add environment variables in Railway dashboard

### Option 3: Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

## Testing

Test the API health:
```bash
curl http://localhost:5000/api/health
```

## Security Notes

- Never commit `.env` file to GitHub
- Change `JWT_SECRET` in production
- Use strong admin password
- Enable CORS only for your frontend domain in production
