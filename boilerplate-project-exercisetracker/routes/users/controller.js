const User = require("../../model/user");
const Exercise = require("../../model/exercise");

const getUser = async (req, res, next) => {
    try {
        const users = await User.find({}, "username _id").exec();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
};

const postUser = async (req, res, next) => {
    try {
        const name = req.body.username;
        const user = await User.findOne(
            { username: name },
            "username _id"
        ).exec();
        if (user) {
            return res.status(200).json(user);
        }
        const newUser = await User.create({ username: name });
        return res.status(200).json({
            username: newUser.username,
            _id: newUser._id,
        });
    } catch (error) {
        console.log(error);
    }
};

const postExercise = async (req, res, next) => {
    try {
        const userID = req.params._id;
        const { description, duration } = req.body;
        let { date } = req.body;
        if (!date) {
            date = new Date();
        } else {
            date = new Date(req.body.date);
        }
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const newExercise = await Exercise.create({
            description,
            duration,
            date,
            userId: user._id,
        });
        return res.status(201).json({
            username: user.username,
            description,
            duration: Number(duration),
            date: date.toDateString(),
            _id: user._id,
        });
    } catch (error) {
        console.log(error);
    }
};

const getLogs = async (req, res, next) => {
    try {
        const userID = req.params._id;
        const user = await User.findById(userID);
        let { from, to, limit } = req.query;
        if (!from && !to) {
            from = new Date("1800-01-01");
            to = new Date();
        }

        const exercises = await Exercise.find(
            {
                userId: userID,
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to),
                },
            },
            "description duration date"
        )
            .limit(limit)
            .exec();
        const count = await Exercise.countDocuments({ userId: userID }).exec();
        let exerciseLog = [];
        for (let exercise of exercises) {
            exerciseLog.push({
                description: String(exercise.description),
                duration: Number(exercise.duration),
                date: String(exercise.date.toDateString()),
            });
        }
        const responseLog = {
            username: user.username,
            _id: user._id,
            count: limit || count,
            log: exerciseLog,
        };
        res.status(200).json(responseLog);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getUser,
    postUser,
    postExercise,
    getLogs,
};
