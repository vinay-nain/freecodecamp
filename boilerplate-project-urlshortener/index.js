require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const validUrl = require("valid-url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});

const urls = [];
let shortUrlId = 0;

app.post("/api/shorturl", (req, res) => {
    const { url } = req.body;
    if (!validUrl.isWebUri(url)) {
        return res.json({ error: "invalid url" });
    }
    dns.lookup(url, (err) => {
        const link_exists = urls.find((link) => link.original_url === url);
        if (link_exists) {
            return res.json({
                original_url: link_exists.original_url,
                short_url: link_exists.short_url,
            });
        }
        shortUrlId++;
        const newUrl = {
            original_url: url,
            short_url: shortUrlId,
        };
        urls.push(newUrl);
        return res.json({
            original_url: newUrl.original_url,
            short_url: newUrl.short_url,
        });
    });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
    const urlId = Number(req.params.shorturl);
    const short_url = urls.find((url) => url.short_url === urlId);
    if (!short_url) {
        return res.json({
            error: "invalid url",
        });
    }
    return res.redirect(short_url.original_url);
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
