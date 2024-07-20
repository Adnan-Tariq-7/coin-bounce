const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandling");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// credentials: This option should be set to true to allow credentials (like cookies) to be sent in CORS requests.
//origin: Specify the exact origin (including protocol, domain, and port) from which you want to allow requests. In your case, it's http://localhost:5173.
//cors(corsOptions): Middleware setup to apply CORS with the specified options to all routes.

/*If you use app.use(cors()); without any options, the CORS middleware will be applied with the default settings. This means:

Access-Control-Allow-Origin: The header will be set to *, which allows requests from any origin.
Access-Control-Allow-Credentials: By default, this is set to false, meaning credentials (cookies, HTTP authentication, etc.) will not be included in cross-origin requests.
Since you need to include credentials and specify a particular origin (http://localhost:5173), using app.use(cors()); alone will not be sufficient for your needs. However, if you want to allow requests from any origin and do not need to include credentials, you can use it. */




// const corsOptions = {
//   credentials: true,
//   origin: "http://localhost:5173",
// };






/*Specific Origin: Only requests from http://localhost:5173 are allowed.
Credentials: Cookies and other credentials are allowed in cross-origin requests.
If you want to allow requests from any origin but still include credentials, you could use a wildcard for the origin while setting credentials to true, but note that this might not be secure or advisable in a production environment:*/

// const corsOptions = {
//     credentials: true,
//     origin: '*'
// };

/*However, using * with credentials: true is not allowed due to security reasons. Browsers will reject such configurations. Therefore, you should always specify the exact origins that are allowed when credentials are involved.*/

/*Common CORS Headers
Access-Control-Allow-Origin: Specifies which origins are allowed to access the resource. For example, Access-Control-Allow-Origin: http://localhost:5173 allows requests from http://localhost:5173.

Access-Control-Allow-Methods: Specifies the HTTP methods allowed for cross-origin requests. For example, Access-Control-Allow-Methods: GET, POST.

Access-Control-Allow-Headers: Specifies the HTTP headers that can be used in the actual request. For example, Access-Control-Allow-Headers: Content-Type.

Access-Control-Allow-Credentials: Indicates whether or not the response to the request can be exposed when the credentials flag is true. For example, Access-Control-Allow-Credentials: true.

Access-Control-Expose-Headers: Specifies which headers are safe to expose to the API of a CORS API specification.*/

const app = express();

app.use(cookieParser());
app.use(express.json({limit:'50mb'}));
// app.use(cors(corsOptions));


// app.use(cors({
//   origin:function(origin,callback){
//     return callback(null,true)
//   },
//   optionsSuccessStatus:200,
//   credentials:true
// }))

// https://coin-bounce-app-rust.vercel.app/

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from specific origins or return an error if not allowed
    const allowedOrigins = ['https://coin-bounce-app-rust.vercel.app/'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));



// app.use("/storage", express.static("storage"));
app.use(router);
dbConnect();
app.use(errorHandler);


app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});