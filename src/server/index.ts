require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router");
const errorMiddleware = require("./middlewares/error-middleware");

import express, {Application, Request, Response, NextFunction} from "express";

const PORT = process.env.PORT || 5000;

const app: any = express();
const expressWs = require('express-ws')(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use("/", router);
app.use(errorMiddleware);

export const initServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL).then(() => {
            console.log("connect to DB has been successfully")
        }).catch((e: any) => {console.log(e)});

        app.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.send({
                "test": "Hello!"
            })
        });

        app.ws('/chat', (ws: any, req: any) => {
            console.log('Connection to the chat was successful!');
            ws.send('Connection to the chat was successful!');
            app.on('message', (msg: String) => {
                console.log(msg);
            })
        })

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    initServer,
}
