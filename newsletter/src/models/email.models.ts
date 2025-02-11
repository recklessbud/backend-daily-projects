import mongoose, {Document, Schema} from "mongoose";
// import { title } from "process";



const emailModel = new Schema({
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
   subscribers: {
    type: Schema.Types.ObjectId,
     ref: 'subscriber'
   },
   recipients: 
   [{
        type: Schema.Types.ObjectId, 
        ref: 'subscriber'
    }],
   sentAt:{
    type: Date,
    default: Date.now
   }
})


export default mongoose.model('email', emailModel)