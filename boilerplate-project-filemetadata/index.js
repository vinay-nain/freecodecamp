var express = require("express");
var cors = require("cors");
const multer = require("multer");
require("dotenv").config();
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

const upload = multer({ dest: "uploads/" });

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
    const uploadedFile = req.file;
    return res.json({
        name: uploadedFile.originalname,
        type: uploadedFile.mimetype,
        size: uploadedFile.size,
    });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Your app is listening on port " + port);
});
