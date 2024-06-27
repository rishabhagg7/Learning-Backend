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

const updatePlaylist = asyncHandler(async(req,res)=>{
    // get playlistId from params
    const {playlistId} = req.params
    // get title and description from body
    const {name,description} = req.body

    // check for playlistId
    if(!playlistId){
        throw new ApiError(400,"playlistId is required")
    }

    if(name && !name.length){
        throw new ApiError(400,"name is cannot be empty")
    }

    // Initialize update object
    let updateFields = {};
    if(name) updateFields.name = name;
    if(description) updateFields.description = description;

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
            $set: updateFields 
        },
        { 
            new: true 
        } 
    )
    // check for playlist
    if(!updatedPlaylist){
        throw new ApiError(500,"error occured during updating playlist")
    }

    // return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            updatedPlaylist,
            "playlist updated successfully"
        )
    )
})


export {createPlaylist,getPlaylistById,updatePlaylist}