const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors');
const auth = require('./routes/auth')

const { initSocket } = require('./listeners/socket');

// Load env vars
dotenv.config({ path: './.env' });


connectDB()

const app = express()
app.use(cors());

// Body parser
app.use(express.json())
// Route
app.use('/api/v1/auth', auth)

const PORT = process.env.PORT || 5000
console.log("Reading storageBucket:", process.env.FIREBASE_STORAGE_BUCKET);
console.log("API_KEY:", process.env.FIREBASE_API_KEY);

const server = app.listen(PORT, () => {
    initSocket(server);
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

