import mongoose from "mongoose";
import { ApiError  } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler(async(req,res) => {
    // get videoId from params
    const {videoId} = req.params
    // get content from body
    const {content} = req.body
    
    // check for videoId
    if(!videoId){
        throw new ApiError(400,"videoId is required");
    }
    // check for content
    if(!content || content.trim() === ""){
        throw new ApiError(400,"content is required");
    }

    // check if video exists or not
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }

    // create an object of comment and add it to db
    const createdComment = await Comment.create(
        {
            content:content,
            video:video._id,
            owner:req.user._id
        }
    )
    if(!createdComment){
        throw new ApiError(500,"Internal error while creating a comment")
    }

    // return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createdComment,
            "Comment added successfully!"
        )
    )
})

export {
    addComment
}