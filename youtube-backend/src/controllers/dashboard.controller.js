import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const getChannelVideos = asyncHandler(async(req,res)=>{
    const { channelId } = req.params;

    const videos = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"channelVideos"
            }
        },
        {
            $addFields:{
                uploadedVideos:"$channelVideos._id"
            }
        },
        {
            $project:{
                uploadedVideos:1
            }
        }
    ])
    if(!videos.length){
        throw new ApiError(404,"videos not found")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                videos:videos[0].uploadedVideos
            },
            "channel videos fetched successfully"
        )
    )
})

export {getChannelVideos}