require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router");
const errorMiddleware = require("./middlewares/error-middleware");

import express, {Application, Request, Response, NextFunction} from "express";

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", router);
app.use(errorMiddleware);

export const initServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL).then(() => {
            console.log("connect to DB has been successfully")
        }).catch((e: any) => {console.log(e)});

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        app.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.send({
                "test": "Hello!"
            })
        });

    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    initServer: initServer
}
