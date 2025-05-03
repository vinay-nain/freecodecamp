const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    favoriteFoods: [String],
});

Person = mongoose.model("Person", personSchema);

const createAndSavePerson = async (done) => {
    let data = new Person({
        name: "vinay",
        age: "19",
        favouriteFoods: ["curry", "rajma", "pakore"],
    });

    let res = await data.save();
    console.log(res);
    done(null, res);
};

const createManyPeople = async (arrayOfPeople, done) => {
    let res = await Person.create(arrayOfPeople);
    console.log(res);
    done(null, res);
};

const findPeopleByName = async (personName, done) => {
    let res = await Person.find({ name: personName });
    console.log(res);
    done(null, res);
};

const findOneByFood = async (food, done) => {
    const result = await Person.findOne({
        favoriteFoods: food,
    });
    console.log(result);
    done(null, result);
};

const findPersonById = async (personId, done) => {
    console.log(personId);
    let result = await Person.findById(personId);
    console.log(result);
    done(null, result);
};

const findEditThenSave = async (personId, done) => {
    const foodToAdd = "hamburger";

    await Person.findById(personId, async (err, data) => {
        if (err) return console.log(err);
        data.favoriteFoods.push(foodToAdd);
        await data.save((err, person) => {
            if (err) return console.log(err);
            done(null, person);
        });
    });
};

const findAndUpdate = async (personName, done) => {
    const ageToSet = 20;
    const filter = { name: personName },
        update = { age: ageToSet };
    let result = await Person.findOneAndUpdate(filter, update, { new: true });
    console.log(result);
    done(null, result);
};

const removeById = async (personId, done) => {
    let result = await Person.findByIdAndRemove(personId);
    console.log(result);
    done(null, result);
};

const removeManyPeople = async (done) => {
    const nameToRemove = "Mary";
    await Person.remove({ name: nameToRemove }, async (error, data) => {
        if (error) console.log(error);
        console.log(data);
        done(null, data);
    });
    // done(null /*, data*/);
};

const queryChain = async (done) => {
    const foodToSearch = "burrito";
    Person.find({ favoriteFoods: foodToSearch })
      .sort({ name: 1 })
      .limit(2)
      .select("-age")
      .exec((err, data) => {
        if (err) return done(err);
        console.log(data);
        return done(null, data);
      });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
