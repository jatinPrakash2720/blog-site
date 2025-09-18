import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { IMAGE_FOLDERS } from "../constants.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, options = {}) => {
  const { folder, userId, blogId } = options;
  try {
    if (!localFilePath) return null;
    if (!folder) throw new Error("Image Folder type is required for upload.");

    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2,8)}`;

    let filename;
    switch (folder) {
      case IMAGE_FOLDERS.AVATAR:
      case IMAGE_FOLDERS.COVER:
        if (!userId) throw new Error("A userId is required for avatar and covers.");
        filename = `${folder.slice(0, -1)}-${userId}-${uniqueSuffix}`;
        break;
      
      case IMAGE_FOLDERS.THUMBNAIL:
      case IMAGE_FOLDERS.BLOG_CONTENT:
        if (!blogId) throw new Error("A blogId is required for thumbnail and blog content.");
        filename = `${folder.slice(0, -1)}-${blogId}-${uniqueSuffix}`;
        break;
      default:
        throw new Error("Invalid image folder type specified.");
    }
    const publicId = `${folder}/${filename}`;

    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: publicId,
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    // console.log("File uploaded over Cloudinary: ", response.url);
    console.log(response);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      // Check if file still exists before trying to delete
      fs.unlinkSync(localFilePath);
    }
    console.log("Catch u-block of Cloudinary: ", error);
    return null;
  }
};

const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || imageUrl.length==0) return null;
    const publicId = imageUrl.split("/").pop().split(".")[0];

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    console.log("File deleted from Cloudinary ");
    console.log(response);

    return response;
  } catch (error) {
    console.log("Catch d-block of Cloudinary: ", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

// cloudinary.v2.uploader
//   .upload("dog.mp4", {
//     resource_type: "video",
//     public_id: "my_dog",
//     overwrite: true,
//     notification_url: "https://mysite.example.com/notify_endpoint",
//   })
//   .then((result) => console.log(result));
