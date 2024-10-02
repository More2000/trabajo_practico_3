// MONGODB
import { MongoClient } from "mongodb";
// EXPRESS
import express from 'express';

// HABILITAMOS EL .ENV
import dotenv from 'dotenv';
dotenv.config();

// PROCESAMOS EL .ENV
const env = process.env;

// PUERTO DE GESTIÓN
const PORT = process.env.PORT_GESTION;

// DEFINIMOS LA URI DE LA BASE DE DATOS
const uri = env.MONGODB_URI;

// LEVANTAMOS LA PÁGINA CON EXPRESS
const app = express();

// USAMOS CORS
import cors from 'cors';
app.use(cors());

// PARSEAMOS LOS JSON QUE USE LA APP
import bodyParser from 'body-parser';
app.use(bodyParser.json());

// SETEAMOS LA BASE DE DATOS (MONGO)
const clientdb = new MongoClient(uri);

// NOMBRE DE LA BASE DE DATOS [MONGODB]
const db = clientdb.db('redes_y_comunicaciones');

// NOMBRE DE LA COLECCIÓN [MONGODB]
const collection = db.collection('trabajo_practico_3');

// NOS CONECTAMOS A LA BASE DE DATOS
try {
  await clientdb.connect();
  console.log("CONECTADO A MONGO DB")
}
catch(er) {
  console.log("ERROR AL CONECTAR A LA DB")
}

// ENDPOINT: CREAR UNA NUEVA TAREA
app.post('/tarea', async (req, res) => {
  const { title, description } = req.body;
  try {
    const nuevaTarea = {
      title: title,
      description: description
    };
      await collection.insertOne(nuevaTarea);
      res.status(200).send('TAREA AGREGADA EN LA BASE DE DATOS');
  } catch (error) {
    console.error('TAREA NO AGREGADA A LA BASE DE DATOS:', error);
    res.status(500).send('Error inserting data');
  }
});

// ENDPOINT: LISTAR TODAS LAS TAREAS
app.get('/tareas', async (req, res) => {
  try {
    const result = await collection.find({}).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('NO SE PUDO OBTENER TAREAS:', error);
    res.status(500).send('Error fetching data');
  }
});

// APP LISTEN
app.listen(PORT, () => {
    console.log(`Microservicio de Gestión corriendo en ${PORT}`);
  });