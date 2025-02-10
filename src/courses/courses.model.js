import { Schema, model } from "mongoose";

const courseSchema = Schema({
nameCourse: {
    type: String,
    required: [true, "Name Course is required"],
    maxLength: [55, "Name Course cannot exceed 55 characters"]
},

description: {
    type: String,
    maxLength: [250, "Description cannot exceed 250 characters"]
},

duration: {
    type: String,
    maxLength: [25, "Description cannot exceed 25 characters"]
},

teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
},

students: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

status: {
    type: String,
    enum: ['EN_CURSO', 'FINALIZED', "REMOVED"],
    default: 'EN_CURSO',
    required: true
},

},{
    versionKey: false,
    timeStamps: true
})

export default model("Course", courseSchema)
