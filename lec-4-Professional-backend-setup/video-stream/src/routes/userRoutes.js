import express from 'express';
import { changePassword, editUserDetails, getUserDetails, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage } from '../controllers/userController.js';
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
router.put("/edit-profile", verifyJwt, editUserDetails);
router.post("/edit-avatar", verifyJwt, upload.single("avatar"), updateAvatar);
router.post("/edit-cover-image", verifyJwt, upload.single("coverImage"), updateCoverImage);





export default router;