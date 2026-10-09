import express from 'express';
import {
  registrar,
  iniciarSesion
} from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /web/auth/registro:
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Usuario Prueba
 *               correo:
 *                 type: string
 *                 example: prueba@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ClaveSegura123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos incorrectos
 *       409:
 *         description: El correo ya está registrado
 */
router.post('/registro', registrar);

/**
 * @swagger
 * /web/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 example: prueba@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ClaveSegura123
 *     responses:
 *       200:
 *         description: Inicio de sesión correcto; devuelve un token JWT
 *       401:
 *         description: Correo o contraseña incorrectos
 */
router.post('/login', iniciarSesion);

export default router;