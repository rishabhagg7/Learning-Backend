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

const getPlaylistById = asyncHandler(async(req,res)=>{
    // get playlistId from params
    const {playlistId} = req.params
    // check for playlistId
    if(!playlistId){
        throw new ApiError(400,"playlistId is required")
    }

    // get playlist from db
    const playlist = await Playlist.findById(playlistId)

    // check for playlist
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    // return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            playlist,
            "playlist fetched successfully"
        )
    )
})


export {createPlaylist,getPlaylistById}