import { Request, Response } from 'express';
const data = require('../data');
const movieData = data.movies;

export class Movies {
    public routes(app): void {
        // GET /api/movies
        app.route('/api/movies').get(async(req: Request, res: Response) => {
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
                
                const list = await movieData.getMovieSkipLimit(skip, limit);
                res.status(200).json(list);
            } catch (e) {
                res.status(500).json({error: 'Could not find movies ' + e});
            }
        });


        app.route('/api/movies/:id').get(async(req: Request, res: Response) => {
            try {
                const movie = await movieData.getMovieById(req.params.id);
                res.status(200).json(movie);
            } catch (e) {
                res.status(404).json({error: 'Movie with id: ' + req.params.id + " not found. " + e});
            }
        });

        app.route('/api/movies').post(async(req: Request, res: Response) => {
            const newMovieData = req.body;
            if (!newMovieData.title) {
                res.status(400).json({error: 'You must provide a movie title'});
                return;
            }
            if (!newMovieData.cast) {
                res.status(400).json({error: 'You must provide a cast list'});
                return;
            }
            if (!newMovieData.info) {
                res.status(400).json({error: 'You must provide basic movie info'});
                return;
            }
            if (!newMovieData.plot) {
                res.status(400).json({error: 'You must provide a plot'});
                return;
            }
            if (!newMovieData.rating) {
                res.status(400).json({error: 'You must provide a rating'});
                return;
            }

            try {
                const {title, cast, info, plot, rating} = newMovieData;
                const newMovie = await movieData.addMovie(title, cast, info, plot, rating);
                res.status(200).json(newMovie);
            } catch (e) {
                res.status(500).json({error: "Failed to add movie: " + e});
            }
        });

        app.route('/api/movies/:id').put(async(req: Request, res: Response) => {
            const newMovieData = req.body;
            if (!newMovieData.title) {
                res.status(400).json({error: "Must supply all info for PUT. Missing title."});
                return;
            }
            if (!newMovieData.cast) {
                res.status(400).json({error: "Must supply all info for PUT. Missing cast."});
                return;
            }
            if (!newMovieData.info) {
                res.status(400).json({error: "Must supply all info for PUT. Missing info."});
                return;
            }
            if (!newMovieData.plot) {
                res.status(400).json({error: "Must supply all info for PUT. Missing plot."});
                return;
            }
            if (!newMovieData.rating) {
                res.status(400).json({error: "Must supply all info for PUT. Missing rating."});
                return;
            }
            try {
                const newMovie = await movieData.updateMovie(req.params.id, newMovieData);
                res.status(200).json(newMovie);
            } catch (e) {
                res.status(500).json({error: "Failed to update movie with id: " + req.params.id + " Failed with: " + e});
            }
        });

        app.route('/api/movies/:id').patch(async(req: Request, res: Response) => {
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
                const newMovie = await movieData.updateMovie(req.params.id, movieDelta);
                res.status(200).json(newMovie);
            } catch (e) {
                res.status(500).json({error: "Failed to update movie with id: " + req.params.id + " Failed with: " + e});
            }
        });

        app.route('/api/movies/:id/comments').post(async(req: Request, res: Response) => {
            const commentBody = req.body;
            try {
                const newMovie = await movieData.addComment(req.params.id, commentBody);
                res.status(200).json(newMovie);
            } catch (e) {
                res.status(400).json({error: "Failed to add comment with error " + e});
            }
        });

        app.route('/api/movies/:movieId/:commentId').delete(async(req: Request, res: Response) => {
            try {
                const newMovie = await movieData.deleteComment(req.params.movieId, req.params.commentId);
                res.status(200).json(newMovie);
            } catch (e) {
                res.status(400).json({error: "Failed to delete comment with error " + e});
            }
        });
    }
}
