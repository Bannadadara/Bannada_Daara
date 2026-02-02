# MongoDB Data Migration Guide

## Overview
This guide will help you migrate product data from `data.js` to your MongoDB Atlas database.

## Prerequisites
- MongoDB Atlas account with cluster set up
- Database connection configured in `backend/.env`
- Node.js and npm installed

## Step 1: Verify MongoDB Connection

### Check IP Whitelist
1. Log into [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Either:
   - Click **Add Current IP Address** to whitelist your current IP
   - Or click **Allow Access from Anywhere** (0.0.0.0/0) for testing

### Test Connection
```bash
cd backend
node scripts/testConnection.js
```

You should see: `✅ MongoDB Connection Successful!`

If it fails, verify:
- IP address is whitelisted in MongoDB Atlas
- Username and password in `.env` are correct
- Network connection is stable

## Step 2: Install Dependencies

```bash
cd backend
npm install
```

## Step 3: Run the Migration

```bash
npm run seed:products
```

### Expected Output
```
🔌 Connecting to MongoDB...
✅ MongoDB Connected Successfully

🗑️  Clearing existing products...
✅ Existing products cleared

📦 Inserting products into database...
✅ Successfully inserted 24 products!

📊 Product Summary:
   - Accessories: 13 products
   - Bags: 11 products
   - Home Decor: 2 products

✨ Database seeding completed successfully!
```

## Step 4: Verify Data

### Option A: MongoDB Atlas Dashboard
1. Go to your cluster in MongoDB Atlas
2. Click **Browse Collections**
3. Select `bannadadara` database → `products` collection
4. Verify 24 documents exist

### Option B: Via API
1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Test the products endpoint:
   ```bash
   curl http://localhost:5000/api/products
   ```

## Troubleshooting

### Connection Timeout
- **Issue**: `MongooseServerSelectionError: connect ETIMEDOUT`
- **Solution**: Whitelist your IP address in MongoDB Atlas Network Access

### Authentication Failed
- **Issue**: `MongoServerError: Authentication failed`
- **Solution**: Verify username and password in `.env` file

### Special Characters in Password
- **Issue**: Connection string parsing errors
- **Solution**: URL-encode special characters (e.g., `@` becomes `%40`)

## Files Created

- `backend/scripts/seedProducts.js` - Main migration script
- `backend/scripts/testConnection.js` - Connection test utility
- `backend/package.json` - Updated with `seed:products` script

## Data Migrated

The script migrates **24 products** across 3 categories:
- **Bags** (11 items): Totes, slings, laptop bags, etc.
- **Accessories** (11 items): Pouches, stationery, masks, cutlery kits
- **Home Decor** (2 items): Patchwork quilt and tablecloth

Each product includes:
- Name, description, price
- Images with alt text
- Dimensions
- Stock levels
- Category classification
- Special flags (featured, onRequest)

## Notes

⚠️ **Important**: The seed script clears existing products before inserting new ones. If you want to preserve existing data, comment out line 141 in `seedProducts.js`:

```javascript
// await Product.deleteMany({});
```
