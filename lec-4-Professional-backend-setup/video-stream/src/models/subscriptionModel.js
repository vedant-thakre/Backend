import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber:{
            type: mongoose.Schema.Types.ObjectId, // Subscribers 
            ref: "User"
        },
        channel:{
            type: mongoose.Schema.Types.ObjectId, // Channel
            ref: "User"
        }
    }, 
    {
        timestamps: true
    }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);