import express from 'express';
import Persona from '../models/Persona.js';

const router = express.Router();

// Crear persona
router.post('/agregarPersonas', async (req, res) => {
  try {
    const persona = await Persona.create(req.body);
    res.status(201).json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Consultar todas las personas
router.get('/consultarPersonas', async (req, res) => {
  try {
    const personas = await Persona.find().populate('padres');
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Consultar una persona
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

// Actualizar persona
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

// Eliminar persona
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

// Consultar árbol familiar
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
