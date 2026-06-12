import mongoose from "mongoose"
import { type } from "os"
const noteSchema=new mongoose.Schema({
   title: {type:String,
    required:true
},
description:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now

}
})

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
export default Note;