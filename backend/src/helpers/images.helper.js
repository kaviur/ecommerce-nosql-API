import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { promisify } from "util";

const validExtensions = ["jpg", "png", "jpeg", "gif", "JPG", "PNG", "JPEG"];
const __dirname = path.resolve();

const uploadImage = (files, pathImg = "users") => {
  return new Promise((resolve, reject) => {
    const { image } = files;
    let imagesName = [];

    image.forEach(({ name, mv }) => {
      let tempImgName = "";
      const splitImageName = name.split(".");
      const imageExtension = splitImageName[splitImageName.length - 1];
      if (!validExtensions.includes(imageExtension))
        return reject({
          errors: {
            message: `Invalid extension, allowed extension are: [${validExtensions}]`,
          },
        });
      tempImgName = `${uuidv4()}.${imageExtension}`;
      const sendtoPath = path.join(
        __dirname,
        `/src/storage/${pathImg}`,
        tempImgName
      );
      imagesName.push(tempImgName);
      mv(sendtoPath, (err) => {
        if (err) return reject(err);
      });
    });
    resolve(imagesName);
  });
};

const deleteImages = async (imageName, imagePath = "users") => {
  const pathDeleteimg = `src/storage/${imagePath}`;
  if (Array.isArray(imageName)) {
    imageName.forEach((img) => {
      promisify(fs.unlink)(
        path.resolve(__dirname, pathDeleteimg, img.split("/").pop())
      );
    });
    return;
  }
  promisify(fs.unlink)(
    path.resolve(__dirname, pathDeleteimg, imageName.split("/").pop())
  );
};

export { uploadImage, deleteImages };
