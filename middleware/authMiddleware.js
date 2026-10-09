import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      mensaje: 'Debes iniciar sesión para acceder a este recurso'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const datosUsuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = datosUsuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
};
