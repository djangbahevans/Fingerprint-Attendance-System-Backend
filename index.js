const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Person = require("./models/Person");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const URI = process.env.URI || "mongodb://localhost:27017/attendance";
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to  MongoDB'))
    .catch(() => {
        console.log('Could not connect to MongoDB');
        process.abort();
    });

app.get("/", async (req, res) => {
    const person = await Person.find();
    res.send({ data: person });
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isNaN(parseInt(id))) {
        const person = await Person.findOne({ id: parseInt(id) });
        res.send(person);
    }
});

app.post('/', async (req, res) => {
    const { ins } = req.body;
    if (ins === "add") {
        const { id, first, last, dept } = req.body;
        const person = await Person.create({ id, firstName: first, lastName: last, department: dept });
        res.send(person);
    }
    else if (ins === "att") {
        const { id, year, month, day, hour, minute } = req.body;
        await Person.findOne({ id });
        person.attendance.push({year, month, day, hour, minute});
        const person = await person.save();
        res.send(person);
    }
    else if (ins === "delete") {
        const { id } = req.body;
        const person = await Person.deleteOne({ id });
        res.send(person);
    } else {
        console.log("Unknown instruction");
        res.send(`Unknown instruction ${req.body}`);
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log('Listening on port ' + server.address().port));
