import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { promisify } from "util";

const __dirname = path.resolve();

const uploadImage = (files, pathImg = "products") => {
  return new Promise((resolve, reject) => {
    let image = [];
    let imagesName = [];

    if (pathImg === "users") {
      image.push(files.image[0]);
    } else {
      image = [...files.image];
    }

    image.forEach(({ name, mv }) => {
      let tempImgName = "";
      const splitImageName = name.split(".");
      const imageExtension = splitImageName[splitImageName.length - 1];
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
