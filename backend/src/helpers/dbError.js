export const dbError = (error) => {
  if (error.code === 11000) {
    return {
      ok: false, 
      status:400,
      errors: Object.keys(error.keyValue).map((field) => ({
        message: `The ${field} ${error.keyValue[field]} is already in use`,
        field
      })),
    };
  }

  return {
    ok: false,
    status:400,
    errors: Object.values(error.errors).map(({ message, path: field }) => ({
      message,
      field,
    })),
  };
};
