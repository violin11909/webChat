const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 1. Import

const auth = require('./routes/auth')
const room = require('./routes/room')
const user = require('./routes/user')



const { initSocket } = require('./listeners/socket');

// Load env vars
dotenv.config({ path: './.env' });


connectDB()

const app = express()

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

// Body parser
app.use(express.json())
// Route
app.use('/api/v1/auth', auth)
app.use('/api/v1/room', room)
app.use('/api/v1/user', user)



const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    initSocket(server);
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

