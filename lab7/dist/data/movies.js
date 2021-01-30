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
const mongoCollections = require('../config/mongoCollections');
var movies = mongoCollections.movies;
const { v4: uuid } = require('uuid');
const exportedMethods = {
    getAllMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            var movieCollection = yield movies();
            return yield movieCollection.find({}).toArray();
        });
    },
    getMovieSkipLimit(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var movieCollection = yield movies();
            var movieList = yield movieCollection.find({}).skip(skip).limit(limit).toArray();
            return movieList;
        });
    },
    getMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var movieCollection = yield movies();
            var m = yield movieCollection.findOne({ _id: id });
            if (!m)
                throw 'Movie not found';
            return m;
        });
    },
    addMovie(title, cast, info, plot, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof title !== 'string')
                throw 'No title provided';
            if (typeof plot !== 'string')
                throw 'No plot provided';
            if (typeof rating !== 'number')
                throw 'No rating provided';
            if (typeof info !== 'object')
                throw 'No info provided';
            if (!Array.isArray(cast))
                throw 'No cast provided';
            var movieCollection = yield movies();
            //console.log("Test");
            var newMovie = {
                title: title,
                cast: cast,
                info: info,
                plot: plot,
                rating: rating,
                comments: [],
                _id: uuid()
            };
            var newInsertMovie = yield movieCollection.insertOne(newMovie);
            const newId = newInsertMovie.insertedId;
            return yield this.getMovieById(newId);
        });
    },
    updateMovie(id, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((delta.title) && (typeof delta.title !== 'string'))
                throw 'Title must be a string';
            if ((delta.plot) && (typeof delta.plot !== 'string'))
                throw 'Plot must be a string';
            if ((delta.rating) && (typeof delta.rating !== 'number'))
                throw 'Rating must be a number';
            if ((delta.info) && (typeof delta.info !== 'object'))
                throw 'Info must be an object';
            if ((delta.cast) && (!Array.isArray(delta.cast)))
                throw 'Cast must be an array';
            var movieCollection = yield movies();
            return yield movieCollection
                .updateOne({ _id: id }, { $set: delta })
                .then(function () {
                return module.exports.getMovieById(id);
            });
        });
    },
    addComment(id, Comment) {
        return __awaiter(this, void 0, void 0, function* () {
            var movieCollection = yield movies();
            if (!(Comment.name) || (typeof Comment.name !== "string"))
                throw "Must supply a string type for name.";
            if ((!Comment.comment) || (typeof Comment.comment !== "string"))
                throw "Must supply a string type for comment.";
            const newComment = {
                _id: uuid(),
                name: Comment.name,
                comment: Comment.comment
            };
            const currentMovie = yield this.getMovieById(id);
            let newComments = currentMovie.comments;
            newComments.push(newComment);
            return yield movieCollection.updateOne({ _id: id }, { $set: { comments: newComments } }).then(function () {
                return module.exports.getMovieById(id);
            });
        });
    },
    deleteComment(movieId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var movieCollection = yield movies();
            var currentMovie = yield this.getMovieById(movieId);
            const currentComments = currentMovie.comments;
            const newComments = currentComments.filter(function (value) { return value._id !== commentId; });
            return yield movieCollection.updateOne({ _id: movieId }, { $set: { comments: newComments } }).then(function () {
                return module.exports.getMovieById(movieId);
            });
        });
    }
};
module.exports = exportedMethods;
