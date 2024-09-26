const badRequest = (msg = "Bad Request") => {
  const error = new Error(msg);
  error.status = 400;
  return error;
};

const notFound = (msg = "Resource not  found") => {
  const error = new Error(msg);
  error.status = 404;
  return error;
};

const serverError = () => {
  const error = new Error("Server unable to response. Please try again later.");
  error.status = 500;
  return error;
};

const authenticationError = () => {
  const error = new Error("Authentication Failed");
  error.status = 401;
  return error;
};

module.exports = { badRequest, notFound, serverError, authenticationError };
