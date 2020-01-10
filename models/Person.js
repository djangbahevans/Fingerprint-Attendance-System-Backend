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
    attendance: [{
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        },
    }]
});

const Person = mongoose.model("Person", PersonSchema)

module.exports = Person
