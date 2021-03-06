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
        const existingPerson = await Person.findOne({ id });
        if (existingPerson) await Person.deleteOne({ id });
        const person = await Person.create({ id, firstName: first, lastName: last, department: dept });
        res.send(person);
    }
    else if (ins === "att") {
        const { id, data } = req.body;

        let year, month, day, hour, minute
        if (data) {
            year = data.substring(0, 4)
            month = data.substring(4, 6)
            day = data.substring(6, 8)
            hour = data.substring(8, 10)
            minute = data.substring(10, 12)
        } else {
            date = new Date();
            year = date.getUTCFullYear()
            month = date.getUTCMonth();
            day = date.getUTCDay();
            hour = date.getUTCHours();
            minute = date.getUTCMinutes();
        }

        let person = await Person.findOne({ id });
        // Add and sort
        person.attendance.push({ year, month, day, hour, minute });
        person.attendance.sort((a, b) => {
            if (a.year > b.year) return 1;
            else if (a.year < b.year) return -1;
            else {
                if (a.month > b.month) return 1;
                else if (a.month < b.month) return -1;
                else {
                    if (a.day > b.day) return 1;
                    else if (a.day < b.day) return -1;
                    else {
                        if (a.hour > b.hour) return 1;
                        else if (a.hour < b.hour) return -1;
                        else {
                            if (a.minute > b.minute) return 1;
                            else if (a.minute < b.minute) return -1;
                            else return 0;
                        }
                    }
                }
            }
        });
        person = await person.save();
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
