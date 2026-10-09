import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'API de Árbol Genealógico',
      version: '1.0.0',
      description:
        'API REST para registrar personas y consultar relaciones familiares hasta segundo grado de consanguinidad.'
    },

    servers: [
      {
        url: 'https://parcial-practica.onrender.com',
        description: 'Servidor en producción'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce el token JWT obtenido al iniciar sesión.'
        }
      }
    },

    tags: [
      {
        name: 'Personas',
        description: 'Operaciones de gestión de personas y árbol familiar'
      },
      {
        name: 'Autenticación',
        description: 'Registro de usuarios e inicio de sesión'
      }
    ]
  },

  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;