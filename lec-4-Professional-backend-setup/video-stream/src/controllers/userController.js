import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { uploadFile } from "../utils/fileHandler.js";
import { Response } from "../utils/responseHandler.js";
import { generateRefreshAndAccessToken } from "../utils/tokenGenerate.js";

const options = {
  httpOnly: true,
  secure: true,
};  

// Register a user
export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [email, username, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ErrorHandler(400, "All fileds are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ErrorHandler(409, "User with email or username already exists");
  }
//   console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ErrorHandler(400, "Avatar file is required");
  }

  const avatar = await uploadFile(avatarLocalPath);
  const coverImage = await uploadFile(coverImageLocalPath);

  if (!avatar) {
    throw new ErrorHandler(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ErrorHandler(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new Response(200, createdUser, "User registered Successfully"));
});

// login a user 
export const loginUser = asyncHandler(async (req, res) => {
    const { username , email, password } = req.body;

    if(!username && !email) throw new ErrorHandler(400, "Username or Email is Required");
    
    const findUser =  await User.findOne({ 
        $or : [ {username}, {email}]
    });

    if (!findUser) throw new ErrorHandler(404, "User not Found");

    const isMatch = await findUser.isPasswordCorrect(password);

    if(!isMatch) throw new ErrorHandler(404, "Incorrect Password");

    const { refreshToken, accessToken} = await generateRefreshAndAccessToken(findUser._id);

    // console.log("Tokens", refreshToken, accessToken);

    const loggedInUser = await User.findById(findUser._id).select(
      "-password -refreshToken ");
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new Response(200, {
            user: loggedInUser, accessToken, refreshToken
        }, 
        "User Login Successfully"));
});

// logout the user
export const logoutUser = asyncHandler(async (req, res) => {
    const id = req.user._id;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Response(200, {}, "User Logged Out"));
});

// refresh the token
export const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        const token = req.body.accessToken || req.cookies.accessToken;
    
        if(!token){
            throw new ErrorHandler(401, "Anauthorized Request");
        }
    
        const { id } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(id);
    
        if(!user) throw new ErrorHandler(401, "Invalid Token");
    
        if(token !== user.refreshToken){
            throw new ErrorHandler(401, "Refresh Token is Expired or Invalid");
        }
    
        const { newRefreshToken, accessToken } = await generateRefreshAndAccessToken(
          user._id
        );
        
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", newRefreshToken, options)
          .json(
            new Response(
              200,
              { accessToken, refreshToken:newRefreshToken },
              "Tokens Updated Successfully"
            )
          );
    } catch (error) {
        throw new ErrorHandler(401, error?.message || "Invalid Token")
    }

});
// export const refreshAccessToken = asyncHandler(async(req, res) => {
//     try {
//         const token = req.body.accessToken || req.cookies.accessToken;
    
//         if(!token){
//             throw new ErrorHandler(401, "Anauthorized Request");
//         }
    
//         const { id } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
//         const user = await User.findById(id);
    
//         if(!user) throw new ErrorHandler(401, "Invalid Token");
    
//         if(token !== user.refreshToken){
//             throw new ErrorHandler(401, "Refresh Token is Expired or Invalid");
//         }
    
//         const { newRefreshToken, accessToken } = await generateRefreshAndAccessToken(
//           user._id
//         );
        
//         return res
//           .status(200)
//           .cookie("accessToken", accessToken, options)
//           .cookie("refreshToken", newRefreshToken, options)
//           .json(
//             new Response(
//               200,
//               { accessToken, refreshToken:newRefreshToken },
//               "Tokens Updated Successfully"
//             )
//           );
//     } catch (error) {
//         throw new ErrorHandler(401, error?.message || "Invalid Token")
//     }

// });

// changing password
export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword , newPassword } = req.body;
    
    const user = await User.findById(req.user?._id);

    if(!user) throw new ErrorHandler(404, "User not Found");

    const isMatch = user.isPasswordCorrect(oldPassword);

    if(!isMatch) throw new ErrorHandler(404, "Password does not match");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json( new Response(200, "Password Updated Successfully"));
});

// getting user details
export const getUserDetails = asyncHandler(async (req, res) => {  
    return res
      .status(200)
      .json(new Response(200, req.user, "User fetched successfully"));
});

// updating user details
export const editUserDetails = asyncHandler(async (req, res) => {
    const { username, fullName, email } = req.body;

     if (!fullName || !email || !username) {
       throw new ErrorHandler(400, "All fields are required");
     }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          username,
          fullName,
          email
        }
      },
      {
        new : true,
      }
    ).select("-password");

    return res
      .status(200)
      .json(new Response(200, user, "Account details updated successfully"));
});

// updating cover image
export const updateCoverImage = asyncHandler(async (req, res) => {
  console.log(req.file);

  const coverImageLocalPath = req.file?.path;

  if(!coverImageLocalPath) throw new ErrorHandler(400, "Cover image file is missing")

  const newCoverImage = await uploadFile(coverImageLocalPath);

  if (!newCoverImage.url) {
    throw new ErrorHandler(400, "Error while uploading on cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      coverImage: newCoverImage.url,
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new Response(200, user, "Cover image updated successfully"));

});

// updating avatar image
export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) throw new ErrorHandler(400, "Avatar file is missing");

  const newAvatar = await uploadFile(avatarLocalPath);

  if (!newAvatar.url) {
    throw new ErrorHandler(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      avatar: newAvatar.url,
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new Response(200, user, "Avatar updated successfully"));
});

// get channel profile
export const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    console.log(username);

    if(!username){
      throw new ErrorHandler(400, "Username is missing");
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          email: 1,
          avatar: 1,
          coverImage: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
        },
      },
    ]);

    console.log(channel);

    if(!channel?.length){
      throw new ErrorHandler(400, "Channel does not exist");
    }

    console.log("channel -->", channel);

    return res
    .status(200)
    .json(new Response(200, channel, "Channel fetched successfuly"))

});

// get watch history
export const getUserWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
      {
        /*
          You cannot write like this because all the aggregation pipeline code 
          goes directly and not through mongoose so and if write like below it 
          work becase if look in mongodb how the document is stored you will find
          number are stored as number string as string but the _id is stored like
          ObjectId('66522b25000f79f0fd91da2d') like this so we need to match the 
          id like this in order match the id.

          $match: {
            _id: req.user?._id
          }
        */
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    return res
    .status(200)
    .json(
      new Response(200, user[0].watchHistory, "Watch history fetched successfully")
    )
});

// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const userlist = await User.find();

  return res
    .status(200)
    .json(new Response(200, userlist, "User list fetched sucessfully"));
});