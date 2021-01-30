const express = require("express");
const router = express.Router();
const api = require('../src/api.js');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const sorted_set_name = "mySortedSet";
const show_list_name = "myShowList";

router.get('/show/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(404).render('error', show);
        return;
    }

    // Check if page is cached
    let pageExists = await client.existsAsync(req.params.id);
    if (pageExists) {
        console.log("Getting page from cache");
        let pageHtml = await client.getAsync(req.params.id);
        res.send(pageHtml);
    } else {
        // Ask for show from API
        const show = await api.getShow(req.params.id);
        if (show['isAxiosError']) {
            res.status(404).render('error', {error: JSON.stringify(show)});
            return;
        }

        // Cache page and render
        res.render('show', show, async (err, html) => {
            let cache = await client.setAsync(
                req.params.id,
                html
            );
            console.log("Caching html for page ", req.params.id);
            res.send(html);
        });
    }
});

router.post('/search', async (req, res) => {
    const info = req.body.searchString;

    // Check if empty or whitespace
    if ((info === null) || !(/\S/.test(info))) {
        console.log("Search term must have characters in it!");
        res.status(404).render('error', {error: "Search term cannot be empty or all whitespace!"});
        return;
    }


    // Increment sorted set
    const set_key = info + "_key";
    const value = await client.zincrbyAsync(sorted_set_name, 1, set_key);

    // Check cache
    const check = await client.existsAsync(info);
    if (check) {
        console.log("Getting search page from cache");
        let pageHtml = await client.getAsync(info);
        res.send(pageHtml);
    } else {
        // Ask api for results
        const shows = await api.search(info);

        if (shows['isAxiosError']) {
            res.status(404).render('error', {error: JSON.stringify(show)});
            return;
        }
        // Add to cache
        res.render('search_list', shows, async (err, html) => {
            let cache = await client.setAsync(
                info,
                html
            );
            console.log("Caching html for page ", info);
            res.send(html);
        });;
    }
});

router.get('/popularsearches', async (req, res) => {
    // Get top search terms
    const top = await client.zrevrangebyscoreAsync(sorted_set_name, 10, 0, "WITHSCORES");
    if (top['isAxiosError']) {
        res.status(404).render('error', {error: JSON.stringify(top)});
        return;
    }
    
    let arrayLength = top.length;
    let leaderBoard = [];
    for (var i = 0; i < arrayLength; i += 2) {
        let newObj = {
            key: top[i].slice(0, -4),
            value: top[i+1]
        }
        leaderBoard.push(newObj);
    }
    
    res.render('popular', leaderBoard);
});

router.get('/', async (req, res) => {
    const shows = await api.getShows();
    if (shows['isAxiosError']) {
        res.status(404).render('error', {error: JSON.stringify(show)});
        return;
    }

    // Check if main page is cached
    let pageExists = await client.existsAsync(show_list_name);
    if (pageExists) {
        console.log("Getting show list from cache");
        let pageHtml = await client.getAsync(show_list_name);
        res.send(pageHtml);
    } else {
        // Cache page
        res.render('show_list', shows, async (err, html) => {
            let cache = await client.setAsync(
                show_list_name,
                html
            );
            console.log("Caching main show list");
            res.send(html);
        });
    }
});

module.exports = router;