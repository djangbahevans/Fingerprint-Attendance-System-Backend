const mongoose = require("mongoose");
// import { Schema, model } from "mongoose";

const PersonSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    attendance: [Date]
});

const Person = mongoose.model("Person", PersonSchema)

module.exports = Person
