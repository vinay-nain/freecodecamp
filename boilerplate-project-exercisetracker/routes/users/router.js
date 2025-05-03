const express = require("express");

const router = express.Router();

const userController = require("./controller");

router.get("/", userController.getUser);

router.post("/", userController.postUser);

router.post("/:_id/exercises", userController.postExercise);

router.get("/:_id/logs", userController.getLogs);

module.exports = router;
