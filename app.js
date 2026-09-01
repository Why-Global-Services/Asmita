const express= require('express');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const bodyparser = require('body-parser');
const config = require('./src/config/config');
const router = require('./src/routes');
const ApiError = require('./src/utils/apiError');
const morgan = require('./src/config/morgan');



const app =express();

// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(bodyparser.urlencoded({extended:false}))

//cookie
app.use(cors({
        origin: "*",
        // credentials:true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*",cors());
app.use(morgan.successHandler);
app.use(morgan.errorHandler);


app.use("/v1", router);





app.use((req, res, next)=>{
    next(new ApiError(404,"Not found API"))
});

app.use((err, req, res, next) => {
    res.locals.errorMessage = err.message || "Internal Server Error";
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            status: false,
            message: err.message
        });
        console.log("err", err.message);
    } else {
        console.log("err:500", err);
        res.status(500).json({
            status: false,
            message: err.message || "Internal Server Error"
        });
    }
});



const server = http.createServer(app);


app.use((req, res, next) => {

    next();
});

module.exports = server;

