import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { callbackUrl } from "../config/config.js";
import { encripPassword } from "../helpers/bcrypt.helper.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      uppercase: true,
      trim: true,
      unique: [true, "The Email is already registered"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image: {
      type: String,
    },
    role: {
      type: Number,
      default: 1,
      min:1,
      max:3
    },
    provider: {
      local: {
        type: Boolean,
        default: false,
      },
      facebook: {
        type: Boolean,
        default: false,
      },
      google: {
        type: Boolean,
        default: false,
      },
      twitter: {
        type: Boolean,
        default: false,
      },
      github: {
        type: Boolean,
        default: false,
      },
      instagram: {
        type: Boolean,
        default: false,
      },
    },
    idProvider: {
      facebook: {
        type: String,
        default: null,
      },
      google: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId:{
      type: String,
    },
    addresses: [
      {
        country: {
          type: String,
          required: [true, "Country is required"],
        },
        city: {
          type: String,
          required: [true, "City is required"],
        },
        adress: {
          type: String,
          required: [true, "Adress is required"],
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      this.password = await encripPassword(this.password);
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.toJSON = function () {
  const { password, __v, createdAt, updatedAt, provider, idProvider, ...user } =
    this.toObject();
  return user;
};

userSchema.methods.saveUrlImg = function (fileNames) {
  this.image = `${callbackUrl}/public/user/${fileNames[0]}`;
};

userSchema.methods.changePassword = async function (password) {
  try {
    this.password = await encripPassword(password);
  } catch (error) {
    console.log(error);
  }
};
export default mongoose.model("User", userSchema);
