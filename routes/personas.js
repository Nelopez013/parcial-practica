import express from 'express';
import Persona from '../models/Persona.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);


/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       required:
 *         - nombres
 *         - apellidos
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador de la persona
 *         nombres:
 *           type: string
 *           example: Carlos
 *         apellidos:
 *           type: string
 *           example: Lopez
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           example: '1970-05-15'
 *         sexo:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *         padres:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de los padres registrados
 */

/**
 * @swagger
 * /web/agregarPersonas:
 *   post:
 *     summary: Registrar una persona
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       201:
 *         description: Persona registrada correctamente
 *       400:
 *         description: Datos incorrectos
 */
router.post('/agregarPersonas', async (req, res) => {
  try {
    const persona = await Persona.create(req.body);
    res.status(201).json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /web/consultarPersonas:
 *   get:
 *     summary: Consultar todas las personas
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Lista de personas
 */
router.get('/consultarPersonas', async (req, res) => {
  try {
    const personas = await Persona.find().populate('padres');
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /web/consultarPersona/{id}:
 *   get:
 *     summary: Consultar una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona encontrada
 *       404:
 *         description: Persona no encontrada
 */
router.get('/consultarPersona/:id', async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id).populate('padres');

    if (!persona) {
      return res.status(404).json({ mensaje: 'Persona no encontrada' });
    }

    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido o solicitud incorrecta' });
  }
});

/**
 * @swagger
 * /web/actualizarPersonas/{id}:
 *   put:
 *     summary: Actualizar una persona
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       200:
 *         description: Persona actualizada
 *       404:
 *         description: Persona no encontrada
 */
router.put('/actualizarPersonas/:id', async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!persona) {
      return res.status(404).json({ mensaje: 'Persona no encontrada' });
    }

    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /web/eliminarPersonas/{id}:
 *   delete:
 *     summary: Eliminar una persona
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona eliminada
 *       404:
 *         description: Persona no encontrada
 */
router.delete('/eliminarPersonas/:id', async (req, res) => {
  try {
    const persona = await Persona.findByIdAndDelete(req.params.id);

    if (!persona) {
      return res.status(404).json({ mensaje: 'Persona no encontrada' });
    }

    await Persona.updateMany(
      { padres: persona._id },
      { $pull: { padres: persona._id } }
    );

    res.json({ mensaje: 'Persona eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido o solicitud incorrecta' });
  }
});

/**
 * @swagger
 * /web/consultarArbol/{id}:
 *   get:
 *     summary: Consultar árbol familiar hasta segundo grado
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona y sus relaciones familiares
 *       404:
 *         description: Persona no encontrada
 */
router.get('/consultarArbol/:id', async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id).populate({
      path: 'padres',
      populate: { path: 'padres' }
    });

    if (!persona) {
      return res.status(404).json({ mensaje: 'Persona no encontrada' });
    }

    const hijos = await Persona.find({ padres: persona._id });
    const idsPadres = persona.padres.map(p => p._id);

    const hermanos = idsPadres.length
      ? await Persona.find({
          _id: { $ne: persona._id },
          padres: { $in: idsPadres }
        })
      : [];

    const abuelos = persona.padres.flatMap(p => p.padres || []);

    const nietos = hijos.length
      ? await Persona.find({ padres: { $in: hijos.map(h => h._id) } })
      : [];

    res.json({
      persona,
      padres: persona.padres,
      hijos,
      hermanos,
      abuelos,
      nietos
    });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido o solicitud incorrecta' });
  }
});

export default router;