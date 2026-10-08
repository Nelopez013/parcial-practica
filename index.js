import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import personasRoutes from './routes/personas.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de árbol genealógico funcionando'
  });
});

app.use('/web', personasRoutes);

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  console.log('MongoDB Atlas conectado correctamente');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
} catch (error) {
  console.error('Error al conectar con MongoDB:', error.message);
  process.exit(1);
}