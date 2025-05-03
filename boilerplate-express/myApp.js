let express = require("express");
let app = express();
let bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));
app.use((req, res, next) => {
    console.log(req.method, req.path, "-", req.ip);
    next();
});

app.get("/", function (req, res) {
    let path = __dirname + "/views/index.html";
    res.sendFile(path);
});

app.get("/json", function (req, res) {
    let message = {
        message: "Hello json",
    };

    if (process.env.MESSAGE_STYLE === "uppercase")
        message.message = message.message.toUpperCase();

    res.json(message);
});

app.get(
    "/now",
    (req, res, next) => {
        req.time = new Date().toString();
        next();
    },
    (req, res) => {
        res.json({
            time: req.time,
        });
    }
);

app.get("/:word/echo", (req, res) => {
    let { word } = req.params;
    res.json({
        echo: word,
    });
});

const handler = (req, res) => {
    let { first, last } = req.query;
    console.log(req.query);
    let fullName = {
        name: `${first} ${last}`,
    };
    res.json(fullName);
};

app.route("/name")
    .get((req, res) => {
        let path = __dirname + "/views/index.html";
        res.sendFile(path);
    })
    .post((req, res) => {
        let { first, last } = req.body;
        console.log(first, " ", last);
        res.json({
            name: `${first} ${last}`,
        });
    });

module.exports = app;
