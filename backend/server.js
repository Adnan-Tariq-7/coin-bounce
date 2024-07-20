const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandling");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:5173', 'https://coin-bounce-app-rust.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'GET', 'DELETE', 'PUT'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(router);
dbConnect();
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
