import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js"

const uploadVideo = asyncHandler(async (req,res) => {
    //get title, description
    const {title, description} = req.body

    //validation
    if(!title?.length){
        throw new ApiError(400,"title not found")
    }
    if(!description?.length){
        throw new ApiError(400,"description not found")
    }

    //get thumbnail and videoFile local path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path 
    const videoFileLocalPath = req.files?.videoFile[0]?.path

    //check for thumbail, video file 
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail not found")
    }
    if(!videoFileLocalPath){
        throw new ApiError(400,"videoFile not found")
    }

    if(!req.user){
        throw new ApiError(401, "User not found or unauthorized access");
    }

    //upload thumbnail and video to cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)

    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail to cloudinary.");
    }
    if(!videoFile){
        throw new ApiError(500, "Failed to upload videoFile to cloudinary")
    }

    //create video object - create entry in database
    const createdVideo = await Video.create(
        {
            title,
            description,
            thumbnail:thumbnail.url,
            videoFile:videoFile.url,
            owner:req.user._id,
            duration:videoFile.duration
        }
    )

    //check for video object creation
    if(!createdVideo){
        throw new ApiError(500, "Failed to create video in the database.");
    }

    //return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createdVideo,
            "Video uploaded successfully"
        )
    )
})

const getVideoById = asyncHandler(async (req,res) => {
    // check for video object
    // return response

    // get videoId from params
    const {videoId} = req.params

    // check videoId it exists
    if(!videoId){
        return new ApiError(400,"videoId not found!")
    }

    // get video from db by id
    const video = await Video.findById(videoId)
    if(!video){
        return new ApiError(404,"video not found")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video fetched successfully"
        )
    )
})

export {uploadVideo,getVideoById}