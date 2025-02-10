import e from 'express';
import mongoose, {Document, Schema} from 'mongoose';


 interface emails extends Document {
    email: string;
    isSubscribed: boolean;
    frequency: string;
    subscribeDate: Date;
}


export const emailSchema = new Schema<emails>({
    email: {type: String, required: true},
    isSubscribed: {type: Boolean, default: true},
    frequency: {type: String, enum: ['daily', 'weekly'], required: true},
    subscribeDate: {type: Date, default: Date.now},
});




export default mongoose.model<emails>('emails', emailSchema);