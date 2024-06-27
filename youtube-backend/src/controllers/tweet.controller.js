import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async(req,res) => {
    //get content from body
    const {content} = req.body
    //validation not empty
    if(!content?.length){
        throw new ApiError(400,"content not found")
    }

    //create tweet obj
    const tweet = await Tweet.create(
        {
            content,
            owner:req.user._id
        }
    )
    //check for tweet creation
    if(!tweet){
        throw new ApiError(500,"error while adding to database")
    }

    // return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            tweet,
            "Tweet added successfully"
        )
    )
})

export {createTweet}