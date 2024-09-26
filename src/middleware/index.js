const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("@routers");

const middleware = (app) => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(router);

  // send error response
  app.use((err, _req, res, _next) => {
    console.log(err);

    if (err.status === 400) {
      if (err.message.split(":").length < 2) {
        res.status(400).json({
          code: 400,
          message: err.message,
        });

        return;
      }

      const errorData = err.message.split("|");
      const data = [];
      for (let i = 0; i < errorData.length; i++) {
        const singleData = errorData[i].split(":");
        if (errorData[i] !== "false") {
          const singleErrorObject = {
            field: singleData[0],
            errorData: singleData[singleData.length - 1],
          };
          data.push(singleErrorObject);
        }
      }

      res.status(400).json({
        code: 400,
        message: "Bad Request",
        data,
      });
      return;
    }

    res.status(err.status || 500).json({
      code: err.status || 500,
      message:
        err.message || "Server unable to response. Please try again later.",
    });
  });
};

module.exports = middleware;
