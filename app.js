"use strict";
const express = require("express");
const app = express();
const fs = require("fs").promises;
const multer = require("multer");
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(multer().none());

app.get('/cats/rock', async (req, res) => {
    try {
        let catsRock = await fs.readFile('cat.txt', 'utf8');
        res.type('text').send(catsRock);
    } catch (err) {
        res.status(500).type('text').send('error!!');
    }
});

app.post('/addCatInfo', async (req, res) => {
    try {
        await fs.appendFile('cats.txt', '\nCats have 8 more lives than dogs!');
        res.type('text').send('Successfully added to file!');
    } catch (err) {
        res.status(500).type('text').send('error!!');
    }
});

app.get('/movies', async (req, res) => {
    try {
        let data = await fs.readFile("movies.json", "utf8");
        data = JSON.parse(data);
        res.send(data);
    } catch (err) {
        if (err.code === "ENOENT") {
            res.status(500).send("file does not exist");
        } else {
            res.status(500).send("something went wrong on the server");
        }
    }
});

app.post("/movie/add", async (req, res) => {
    res.type("text");
    let movie = req.body.movie;
    let year = req.body.year;
    let song = req.body.song;
    let rating = parseInt(req.body.rating);
    if (movie && year && song && rating) {
        try {
            let data = await fs.readFile("movies.json", "utf8");
            data = JSON.parse(data);
            let movieExists = data[movie];
            let response = '';
            if (movieExists) {
                response = "updated information for designated movie";
            } else {
                response = "added information for designated movie";
            }
            data[movie] = {
                "release-year": year,
                "featured-song": song,
                "rotten-tomatoes": rating
            };
            await fs.writeFile("movies.json", JSON.stringify(data));
            res.send(response);
        } catch (err) {
            if (err.code === "ENOENT") {
                res.status(500).send("file does not exist");
            } else {
                res.status(500).send("something went wrong on the server");
            }
        }
    } else {
        res.status(400).send("Missing required parameters");
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);