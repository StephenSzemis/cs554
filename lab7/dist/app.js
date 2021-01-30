"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_1 = require("./routes/api");
var totalRequest = 0;
var requests = {};
class App {
    constructor() {
        this.apiRoutes = new api_1.Movies();
        // Middleware Stack
        this.Logger = (req, res, next) => {
            console.log("========REQUEST Detail========");
            totalRequest += 1;
            console.log("Total requests to server: " + totalRequest);
            next();
        };
        this.Logger2 = (req, res, next) => {
            console.log("Request Body:");
            console.log(req.body);
            console.log("HHTP " + req.method + " " + req.originalUrl);
            next();
        };
        this.Logger3 = (req, res, next) => {
            if (req.originalUrl in requests) {
                requests[req.originalUrl] += 1;
            }
            else {
                requests[req.originalUrl] = 1;
            }
            console.log("Total requests for this url: " + requests[req.originalUrl]);
            next();
        };
        this.app = express();
        this.config();
        this.apiRoutes.routes(this.app);
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.Logger);
        this.app.use(this.Logger2);
        this.app.use(this.Logger3);
    }
}
exports.default = new App().app;
