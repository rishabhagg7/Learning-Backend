import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary,deleteOnCloudinary, deleteVideoOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js"
import mongoose from "mongoose";

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
    // get videoId from params
    const {videoId} = req.params

    // check videoId it exists
    if(!videoId){
        throw new ApiError(400,"videoId not found!")
    }

    // get video from db by id
    const video = await Video.findById(videoId)
    // check for video object
    if(!video){
        throw new ApiError(404,"video not found")
    }
    // return response
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

const deleteVideo = asyncHandler(async (req,res) => {
    //get video id from params
    const {videoId} = req.params

    //check id if exits and delete video obj from db
    if(!videoId){
        throw new ApiError(400,"videoId not found!")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(!req.user?._id.equals(video.owner)){
        throw new ApiError(400,"User cannot delete this video")
    }

    const deletedVideo = await Video.deleteOne({
        _id:video._id
    })
    if(!deletedVideo){
        throw new ApiError(500,"Internal error while deleting video")
    }

    //delete thumbnail,videoFile from cloudinary
    await deleteOnCloudinary(video.thumbnail)
    await deleteVideoOnCloudinary(video.videoFile)

    //return response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
    )
})

const updateVideo = asyncHandler(async(req,res) => {
    // get video id from params, title and description from body
    const {videoId} = req.params
    const {title,description} = req.body

    // check if video exist
    if(!videoId){
        throw new ApiError(400,"videoId not found")
    }

    // get video
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    // check if user is authorised to change the details
    if(!req.user?._id.equals(video.owner)){
        throw new ApiError(400,"User cannot update details of this video")
    }
    
    // set variables
    let newTitle = title || video.title;
    let newDescription = description || video.description;
    let newThumbnailPath;
    if(req.file){
        newThumbnailPath = req.file.path
    }

    let newThumbnail;
    // update in cloudinary if there is a thumbnail
    if(newThumbnailPath){
        newThumbnail = await uploadOnCloudinary(newThumbnailPath)
        await deleteOnCloudinary(video.thumbnail)

        if(!newThumbnail){
            throw new ApiError(500,"Interal error while uploading new thumbnail")
        }
        newThumbnail = newThumbnail.url
    }else{
        newThumbnail = video.thumbnail
    }

    // update the object
    const updatedVideo = await Video.findOneAndUpdate(
        {
            _id:videoId
        },
        {
            title:newTitle,
            description:newDescription,
            thumbnail:newThumbnail
        },
        {
            new:true
        }
    )
    if(!updatedVideo){
        throw new ApiError(500,"Video could not be updated")
    }

    // return response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedVideo,
            "Video updated successfully"
        )
    )
})

const togglePublishStatus = asyncHandler(async(req,res) => {
    // get videoId from params
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"videoId not found")
    }
    // get video
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    // check if user is authorised to change the details
    if(!req.user?._id.equals(video.owner)){
        throw new ApiError(400,"User cannot toggle details of this video")
    }

    // toggle status
    const toggledStatusInVideo = await Video.findOneAndUpdate(
        {
            _id:videoId
        },
        {
            isPublished:!video.isPublished
        },
        {
            new:true
        }
    )
    if(!toggledStatusInVideo){
        throw new ApiError(500,"Status could not be toggled")
    }

    // return response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            toggledStatusInVideo,
            "Status updated successfully"
        )
    )
})

export {uploadVideo,deleteVideo,getVideoById,updateVideo,togglePublishStatus}