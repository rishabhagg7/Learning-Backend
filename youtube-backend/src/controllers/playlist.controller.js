import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async(req,res)=>{
    // get name and description from body
    const {name, description} = req.body

    // validation
    if(!name){
        throw new ApiError(400,"name is required")
    }

    // create playlist object
    const createdPlaylist = await Playlist.create(
        {
            name:name,
            description:description||"",
            owner:req.user._id
        }
    )

    // check for created playlist
    if(!createPlaylist){
        throw new ApiError(500,"Error while creating playlist")
    }

    // return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createPlaylist,
            "Playlist created successfully"
        )
    )
})

export {createPlaylist}