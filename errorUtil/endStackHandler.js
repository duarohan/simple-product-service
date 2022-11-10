module.exports = (err, req, res, next) => {
    res.status(err.statusCode || 500);
    if (err.bodyError) {
      res.send({
        error: `${err.bodyError}`,
      });
    } else {
      res.send();
    }
  };