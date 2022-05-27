import bcrypt from "bcrypt";

const encripPassword = async (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (error) {
    console.log(error);
  }
};

const validatePassword = (password, hash) => {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {}
};

export { encripPassword, validatePassword };
