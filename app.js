"use strict";
const express = require("express");
const app = express();
const fs = require("fs").promises;
const multer = require("multer");
const cors = require("cors");
app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"]
  }));
//app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

app.get('/movies', async (req, res) => {
    try {
        let data = await fs.readFile("movies.json", "utf8");
        data = JSON.parse(data);
        res.send(data);
    } catch (err) {
        if (err.code === "ENOENT") {
            res.status(500).send("File does not exist");
        } else {
            res.status(500).send("Something went wrong on the server");
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
                response = "Updated information for designated movie";
            } else {
                response = "Added information for designated movie";
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
                res.status(500).send("File does not exist");
            } else {
                res.status(500).send("Something went wrong on the server");
            }
        }
    } else {
        res.status(400).send("Missing required parameters");
    }
});

app.delete("/movie/delete", async (req, res) => {
    res.type("text");
    let movie = req.body.movie;
    if (movie) {
        try {
            let data = await fs.readFile("movies.json", "utf8");
            data = JSON.parse(data);
            if (data[movie]) {
                delete data[movie];
                await fs.writeFile("movies.json", JSON.stringify(data));
                res.send("Movie deleted successfully");
            } else {
                res.status(404).send("Movie not found");
            }
        } catch (err) {
            if (err.code === "ENOENT") {
                res.status(500).send("File does not exist");
            } else {
                res.status(500).send("Something went wrong on the server");
            }
        }
    } else {
        res.status(400).send("Missing required parameter: movie");
    }
});

app.put("/movie/update", async (req, res) => {
    res.type("text");
    let movie = req.body.movieToUpdate;
    let year = req.body.yearToUpdate;
    let song = req.body.songToUpdate;
    let rating = parseInt(req.body.ratingToUpdate);
    if (movie && year && song && rating) {
        try {
            let data = await fs.readFile("movies.json", "utf8");
            data = JSON.parse(data);
            if (data[movie]) {
                data[movie] = {
                    "release-year": year,
                    "featured-song": song,
                    "rotten-tomatoes": rating
                };
                await fs.writeFile("movies.json", JSON.stringify(data));
                res.send("Movie information updated successfully");
            } else {
                res.status(404).send("Movie not found");
            }
        } catch (err) {
            if (err.code === "ENOENT") {
                res.status(500).send("File does not exist");
            } else {
                res.status(500).send("Something went wrong on the server");
            }
        }
    } else {
        res.status(400).send("Missing required parameters");
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);