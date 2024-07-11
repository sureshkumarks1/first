const notFound = (req, res, next) => {
  res.redirect("/404");
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: error?.message,
    stack: error?.stackTrace,
    statusCode: error.statusCode,
    Title: error?.title,
  });
  // if (req.session.name == undefined) {
  //   return res.redirect("http://localhost:3000/login");
  // }
  // res.redirect("/500");
};

const newErrorhandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.json({
    title: "Not Found",
    message: err.message,
    stackTrace: err.stackTrace,
  });
};

module.exports = { errorHandler, notFound, newErrorhandler };

// const logger = require('./logger')

// const requestLogger = (request, response, next) => {
//   logger.info('Method:', request.method)
//   logger.info('Path:  ', request.path)
//   logger.info('Body:  ', request.body)
//   logger.info('---')
//   next()
// }

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// const errorHandler = (error, request, response, next) => {
//   logger.error(error.message)

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message })
//   }

//   next(error)
// }

// module.exports = {
//   requestLogger,
//   unknownEndpoint,
//   errorHandler
// }
