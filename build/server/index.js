"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = void 0;
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router");
const errorMiddleware = require("./middlewares/error-middleware");
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use("/", router);
app.use(errorMiddleware);
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(process.env.DB_URL).then(() => {
            console.log("connect to DB has been successfully");
        }).catch((e) => { console.log(e); });
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        app.get('/', (req, res, next) => {
            res.send({
                "test": "Hello!"
            });
        });
    }
    catch (e) {
        console.log(e);
    }
});
exports.initServer = initServer;
module.exports = {
    initServer: exports.initServer
};
