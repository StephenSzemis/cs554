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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movies = void 0;
const data = require('../data');
const movieData = data.movies;
class Movies {
    routes(app) {
        // GET /api/movies
        app.route('/api/movies').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let skip = 0;
                let limit = 20;
                if ((typeof req.query.skip === 'string') &&
                    (parseInt(req.query.skip, 10) !== NaN)) {
                    skip = parseInt(req.query.skip, 10);
                }
                if ((typeof req.query.limit === 'string') &&
                    (parseInt(req.query.limit, 10) !== NaN) &&
                    (parseInt(req.query.limit, 10) < 101)) {
                    limit = parseInt(req.query.limit, 10);
                }
                const list = yield movieData.getMovieSkipLimit(skip, limit);
                res.status(200).json(list);
            }
            catch (e) {
                res.status(500).json({ error: 'Could not find movies ' + e });
            }
        }));
        app.route('/api/movies/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movie = yield movieData.getMovieById(req.params.id);
                res.status(200).json(movie);
            }
            catch (e) {
                res.status(404).json({ error: 'Movie with id: ' + req.params.id + " not found. " + e });
            }
        }));
        app.route('/api/movies').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const newMovieData = req.body;
            if (!newMovieData.title) {
                res.status(400).json({ error: 'You must provide a movie title' });
                return;
            }
            if (!newMovieData.cast) {
                res.status(400).json({ error: 'You must provide a cast list' });
                return;
            }
            if (!newMovieData.info) {
                res.status(400).json({ error: 'You must provide basic movie info' });
                return;
            }
            if (!newMovieData.plot) {
                res.status(400).json({ error: 'You must provide a plot' });
                return;
            }
            if (!newMovieData.rating) {
                res.status(400).json({ error: 'You must provide a rating' });
                return;
            }
            try {
                const { title, cast, info, plot, rating } = newMovieData;
                const newMovie = yield movieData.addMovie(title, cast, info, plot, rating);
                res.status(200).json(newMovie);
            }
            catch (e) {
                res.status(500).json({ error: "Failed to add movie: " + e });
            }
        }));
        app.route('/api/movies/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            const newMovieData = req.body;
            if (!newMovieData.title) {
                res.status(400).json({ error: "Must supply all info for PUT. Missing title." });
                return;
            }
            if (!newMovieData.cast) {
                res.status(400).json({ error: "Must supply all info for PUT. Missing cast." });
                return;
            }
            if (!newMovieData.info) {
                res.status(400).json({ error: "Must supply all info for PUT. Missing info." });
                return;
            }
            if (!newMovieData.plot) {
                res.status(400).json({ error: "Must supply all info for PUT. Missing plot." });
                return;
            }
            if (!newMovieData.rating) {
                res.status(400).json({ error: "Must supply all info for PUT. Missing rating." });
                return;
            }
            try {
                const newMovie = yield movieData.updateMovie(req.params.id, newMovieData);
                res.status(200).json(newMovie);
            }
            catch (e) {
                res.status(500).json({ error: "Failed to update movie with id: " + req.params.id + " Failed with: " + e });
            }
        }));
        app.route('/api/movies/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            let movieDelta = {};
            const newMovieData = req.body;
            if (newMovieData.title) {
                movieDelta["title"] = newMovieData.title;
            }
            if (newMovieData.cast) {
                movieDelta["cast"] = newMovieData.cast;
            }
            if (newMovieData.info) {
                movieDelta["info"] = newMovieData.info;
            }
            if (newMovieData.plot) {
                movieDelta["plot"] = newMovieData.plot;
            }
            if (newMovieData.rating) {
                movieDelta["rating"] = newMovieData.rating;
            }
            try {
                const newMovie = yield movieData.updateMovie(req.params.id, movieDelta);
                res.status(200).json(newMovie);
            }
            catch (e) {
                res.status(500).json({ error: "Failed to update movie with id: " + req.params.id + " Failed with: " + e });
            }
        }));
        app.route('/api/movies/:id/comments').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const commentBody = req.body;
            try {
                const newMovie = yield movieData.addComment(req.params.id, commentBody);
                res.status(200).json(newMovie);
            }
            catch (e) {
                res.status(400).json({ error: "Failed to add comment with error " + e });
            }
        }));
        app.route('/api/movies/:movieId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newMovie = yield movieData.deleteComment(req.params.movieId, req.params.commentId);
                res.status(200).json(newMovie);
            }
            catch (e) {
                res.status(400).json({ error: "Failed to delete comment with error " + e });
            }
        }));
    }
}
exports.Movies = Movies;
