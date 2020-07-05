const jwt = require('jsonwebtoken');

// Verificamos el token
const verifyToken = (req, res, next) => {
  let token = req.get('Authorization');
  jwt.verify(token, process.env.JWT_SECRET.toString(), (error, decoded) => {
    if (error) {
      return res.status(401).json({
        ok: false,
        error,
      });
    }
    req.user = decoded.user;
    next();
  });
};

// Verificamos el rol del usuario
const verifyRole = (req, res, next) => {
  let user = req.user;
  if (user.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      error: {
        message: `No tienes autorizacion para realizar esta operacion`,
      },
    });
  }
  next();
};

module.exports = { verifyToken, verifyRole };
