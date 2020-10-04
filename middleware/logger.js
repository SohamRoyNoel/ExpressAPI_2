// @desc    Logs request to console
const logger = (req, res, next) => {
      console.log(
            `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}` //LOGGED : GET http://localhost:5000/api/v1/bootcamps
      );
      next();
}

module.exports = logger;