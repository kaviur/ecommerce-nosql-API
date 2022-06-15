import { response, request } from "express";
import { errorResponse } from "../helpers/responses.helper.js";

const validateExtensionImages = (req = request, res = response, next) => {
  const validExtensions = ["jpg", "png", "jpeg", "gif", "JPG", "PNG", "JPEG"];
  const image = req.files?.image || null;
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

const validateImages = (req = request, res = response, next) => {
  const { files } = req;
  try {
    if (
      !files ||
      Object.keys(files).length === 0 ||
      !files.image ||
      files.length == 0
    ) {
      throw new Error("Images are required");
    }
  } catch (error) {
    return errorResponse(res, error, 400);
  }
  validateExtensionImages(req, res, next);
};

export { validateExtensionImages, validateImages };
