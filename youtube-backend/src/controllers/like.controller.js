import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async(req,res) => {
    // get videoId from params
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"videoId is required")
    }

    // check if video exists
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }

    // check if user has already liked the video -> delete the like object else create a like object
    const isLiked = await Like.findOne({
        $and:[
            {
                likedBy:req.user._id
            },
            {
                video:videoId
            }
        ]
    })

    // handle like object
    if(isLiked){
        // delete that like object
        const deletedLike = await Like.findByIdAndDelete(isLiked._id)
        if(!deletedLike){
            throw new ApiError(500,"Internal error while removing like")
        }
    }else{
        // create a like object
        const createdLike = await Like.create({
            likedBy:req.user._id,
            video:videoId
        })
        if(!createdLike){
            throw new ApiError(500,"Internal error while adding like")
        }
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {},
            "like changed successfully"
        )
    )

})

export{
    toggleVideoLike
}