import mongoose from 'mongoose';

const personaSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  fechaNacimiento: {
    type: Date
  },
  sexo: {
    type: String,
    enum: ['Masculino', 'Femenino', 'Otro']
  },
  padres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Persona'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Persona', personaSchema);
