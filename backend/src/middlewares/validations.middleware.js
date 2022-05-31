import { response, request } from "express";
import { errorResponse } from "../helpers/responses.helper.js";

const validateExtensionImages = (req = request, res = response, next) => {
  const validExtensions = ["jpg", "png", "jpeg", "gif", "JPG", "PNG", "JPEG"];
  const { image } = req.files;
  let images = [];

  if (image) {
    if (Array.isArray(image)) {
      images = [...image];
    } else {
      images.push(image);
    }
    try {
      images.forEach(({ name }) => {
        const splitImageName = name.split(".");
        const imageExtension = splitImageName[splitImageName.length - 1];
        if (!validExtensions.includes(imageExtension)) {
          throw new Error(
            `Invalid extension, allowed extension are: [${validExtensions}]`
          );
        }
      });
      req.files.image = images;
    } catch (error) {
      return errorResponse(res, error, 400);
    }
  }
  next();
};

export { validateExtensionImages };
