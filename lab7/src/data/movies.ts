import { Collection } from "mongodb";

const mongoCollections = require('../config/mongoCollections');
var movies: Function = mongoCollections.movies;
const { v4: uuid } = require('uuid');

interface movie {
    title: string
    cast: Array<any>
    info: object
    plot: string
    rating: number
    comments: Array<object>
    _id: number
}

const exportedMethods = {
    async getAllMovies(): Promise<Array<movie>> {
        var movieCollection: Collection = await movies();
        return await movieCollection.find({}).toArray();
    },

    async getMovieSkipLimit(skip: number, limit: number): Promise<Array<movie>> {
        var movieCollection: Collection = await movies();
        var movieList: Array<movie> = await movieCollection.find({}).skip(skip).limit(limit).toArray();
        return movieList;
    },

    async getMovieById(id: number) {
        var movieCollection: Collection = await movies();
        var m: movie = await movieCollection.findOne({_id: id});

        if (!m) throw 'Movie not found';
        return m;
    },

    async addMovie(title: string, cast: Array<any>, info: object, plot: string, rating: number): Promise<movie> {
        if (typeof title !== 'string') throw 'No title provided';
        if (typeof plot !== 'string') throw 'No plot provided';
        if (typeof rating !== 'number') throw 'No rating provided';
        if (typeof info !== 'object') throw 'No info provided';
        if (!Array.isArray(cast)) throw 'No cast provided';

        var movieCollection: Collection = await movies();
        //console.log("Test");
        var newMovie: movie = {
            title: title,
            cast: cast,
            info: info,
            plot: plot,
            rating: rating,
            comments: [],
            _id: uuid()
        };

        
        var newInsertMovie: any = await movieCollection.insertOne(newMovie);
        const newId = newInsertMovie.insertedId;
        return await this.getMovieById(newId);
    },

    async updateMovie(id: number, delta: any): Promise<movie> {
        if ((delta.title) && (typeof delta.title !== 'string')) throw 'Title must be a string';
        if ((delta.plot) && (typeof delta.plot !== 'string')) throw 'Plot must be a string';
        if ((delta.rating) && (typeof delta.rating !== 'number')) throw 'Rating must be a number';
        if ((delta.info) && (typeof delta.info !== 'object')) throw 'Info must be an object';
        if ((delta.cast) && (!Array.isArray(delta.cast))) throw 'Cast must be an array';

        var movieCollection: Collection = await movies();
        return await movieCollection
            .updateOne({_id: id}, {$set: delta})
            .then(function() {
                return module.exports.getMovieById(id);
            });
    },

    async addComment(id: number, Comment: any) {
        var movieCollection: Collection = await movies();
        if (!(Comment.name) || (typeof Comment.name !== "string")) throw "Must supply a string type for name.";
        if ((!Comment.comment) || (typeof Comment.comment !== "string")) throw "Must supply a string type for comment.";
        const newComment = {
            _id: uuid(),
            name: Comment.name,
            comment: Comment.comment
        };
        const currentMovie = await this.getMovieById(id);
        let newComments = currentMovie.comments;
        newComments.push(newComment);
        return await movieCollection.updateOne({_id: id}, {$set: {comments: newComments}}).then(function() {
            return module.exports.getMovieById(id);
        });
    },

    async deleteComment(movieId: number, commentId: number) {
        var movieCollection: Collection = await movies();
        var currentMovie: movie = await this.getMovieById(movieId);
        const currentComments = currentMovie.comments;
        const newComments = currentComments.filter(function(value) {return (value as movie)._id !== commentId});
        return await movieCollection.updateOne({_id: movieId}, {$set: {comments: newComments}}).then(function () {
            return module.exports.getMovieById(movieId);
        });
    }
}

module.exports = exportedMethods;
