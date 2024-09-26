const {
  signUp,
  signIn,
  refreshToken,
  forgotPassword,
  verifyOtp,
} = require("@controller/v1/auth");

const authRoutes = (router) => {
  router.post("/auth/sign-up", signUp);
  router.post("/auth/sign-in", signIn);
  router.post("/auth/refresh", refreshToken);
  router.post("/auth/forgot-password", forgotPassword);
  router.post("/auth/verify-otp", verifyOtp);
};
 
module.exports = authRoutes;
