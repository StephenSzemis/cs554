import * as express from 'express';
import { Request, Response } from 'express';
import { Movies } from './routes/api';

var totalRequest: number = 0;
var requests = {};

class App {
    public app: express.Application;
    public apiRoutes: Movies = new Movies();
    
    constructor() {
        this.app = express();
        this.config();
        this.apiRoutes.routes(this.app);
    }

    // Middleware Stack
    private Logger = (req: Request, res: Response, next: Function) => {
        console.log("========REQUEST Detail========");
        totalRequest += 1;
        console.log("Total requests to server: " + totalRequest);
        next();
    };

    private Logger2 = (req: Request, res: Response, next: Function) => {
        console.log("Request Body:");
        console.log(req.body);
        console.log("HHTP " + req.method + " " + req.originalUrl);
        next();
    };

    private Logger3 = (req: Request, res: Response, next: Function) => {
        if (req.originalUrl in requests) {
            requests[req.originalUrl] += 1;
        } else {
            requests[req.originalUrl] = 1;
        }
        console.log("Total requests for this url: " + requests[req.originalUrl]);
        next();
    };

    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.Logger);
        this.app.use(this.Logger2);
        this.app.use(this.Logger3);
    }
}

export default new App().app;