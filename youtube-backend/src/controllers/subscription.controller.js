import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async(req,res)=>{
    // get ChannelId from params
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(400,"channelId is required")
    }

    // check if channel exists or not
    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404,"channel not found")
    }

    // check if it is the channel of current user
    if(req.user._id.equals(channel._id)){
        throw new ApiError(401,"User cannot subscribe to his/her channel")
    }

    // check if user has subscribed the channel or not
    const isSubscribed = await Subscription.findOne({
        $and:[
            {
                channel:channelId
            },
            {
                subscriber:req.user._id
            }
        ]
    })

    // handle subscription object
    if(isSubscribed){
        // delete that subscription object
        const removedSubscription = await Subscription.findByIdAndDelete(isSubscribed._id)
        if(!removedSubscription){
            throw new ApiError(500,"Internal error while deleting subscription")
        }
    }else{
        // create a subscription object
        const createdSubscription = await Subscription.create({
            subscriber:req.user._id,
            channel:channelId
        })
        if(!createdSubscription){
            throw new ApiError(500,"Internal error while adding subscription")
        }
    }

    // return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {},
            "subscription changed successfully on channel"
        )
    )

})

export{
    toggleSubscription
}