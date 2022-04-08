import express, {Application, Request, Response, NextFunction} from "express";

function initServer() {
    const app: Application = express();

    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send({
            "test": "Hello!"
        })
    });

    app.listen(5000, () => console.log("Server running"))
}

module.exports = {
    initServer: initServer
}
