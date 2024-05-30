import express from 'express';
import { changePassword, editUserDetails, getUserChannelProfile, getUserDetails, getUserWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage } from '../controllers/userController.js';
import { upload } from '../middlewares/multerMiddleware.js';
import { verifyJwt } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.route("/register").post(registerUser);
router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.post("/login", loginUser);

// secured route
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changePassword);
router.get("/profile", verifyJwt, getUserDetails);
router.patch("/edit-profile", verifyJwt, editUserDetails);
router.patch("/edit-avatar", verifyJwt, upload.single("avatar"), updateAvatar);
router.patch("/edit-cover-image", verifyJwt, upload.single("coverImage"), updateCoverImage);
router.get("/channel/:username", verifyJwt, getUserChannelProfile);
router.get("/history", verifyJwt, getUserWatchHistory);


export default router;