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

const getLogs = async (req, res) => {
    try {
        const userId = req.params._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let { from, to, limit } = req.query;

        // Parse dates safely
        const dateFilter = {};
        if (from && !isNaN(Date.parse(from))) {
            dateFilter.$gte = new Date(from);
        }
        if (to && !isNaN(Date.parse(to))) {
            dateFilter.$lte = new Date(to);
        }

        const query = { userId };
        if (from || to) {
            query.date = dateFilter;
        }

        // Parse limit to integer
        let parsedLimit = parseInt(limit);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            parsedLimit = 0;
        }

        const exercises = await Exercise.find(query)
            .select("description duration date -_id")
            .limit(parsedLimit || undefined)
            .exec();

        const log = exercises.map((e) => ({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString(),
        }));

        res.json({
            username: user.username,
            _id: user._id,
            count: log.length,
            log: log,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getUser,
    postUser,
    postExercise,
    getLogs,
};
