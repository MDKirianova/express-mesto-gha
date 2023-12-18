const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

const JWT_SECRET = 'secret';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
};
