const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Testing MongoDB Connection...');
console.log('URI (masked):', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
})
    .then(() => {
        console.log('✅ MongoDB Connection Successful!');
        console.log('Database:', mongoose.connection.db.databaseName);
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Failed:');
        console.error('Error:', err.message);
        console.error('\nPossible issues:');
        console.error('1. Check if IP address is whitelisted in MongoDB Atlas');
        console.error('2. Verify username and password are correct');
        console.error('3. Ensure network connection is stable');
        process.exit(1);
    });
