// MONGODB
import { MongoClient } from "mongodb";

// EXPRESS
import express from 'express';

// DEMÁS IMPORTACIONES
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';

// HABILITAMOS EL .ENV
import dotenv from 'dotenv';
dotenv.config();

// PROCESAMOS EL .ENV
const env = process.env;

// DEFINIMOS PUERTOS
const PORT = env.PORT_SERVER;
const PORT_GESTION = env.PORT_GESTION;

// DEFINIMOS LA URI DE LA BASE DE DATOS
const uri = env.MONGODB_URI;

// LEVANTAMOS LA PÁGINA CON EXPRESS
const app = express();

// USAMOS CORS
app.use(cors());

// PARSEAMOS LOS JSON QUE USE LA APP
app.use(bodyParser.json());

// SETEAMOS LA BASE DE DATOS (MONGO)
const client = new MongoClient(uri);

// NOMBRE DE LA BASE DE DATOS [MONGODB]
const db = client.db('redes_y_comunicaciones');

// NOMBRE DE LA COLECCIÓN [MONGODB]
const collection = db.collection('trabajo_practico_3');

// NOS CONECTAMOS A LA BASE DE DATOS
try {
  await client.connect();
  console.log("CONECTADO A MONGO DB")
}
catch(er) {
  console.log("ERROR AL CONECTAR A LA DB")
}

// CREAR TAREA
app.post('/tarea', async (req, res) => {
  const {title, description} = req.body;
  try {
   const response = await axios.post(`http://localhost:${PORT_GESTION}/tarea`, {   
    title: title,
    description: description     
   });
    const resp = response.data;
    res.json(resp);
} catch (error) {
   console.error( error);
   res.status(500).send("ERROR GESTION");
}
})

//LISTADO DE TAREAS
app.get('/tareas', async (req, res) => {
  try {
   const response = await axios.get(`http://localhost:${PORT_GESTION}/tareas`);
    const resp = response.data;
    res.json(resp);
   } catch (error) {
   console.error( error);
   res.status(500).send("Error interno del servidor ENDPOINT-3");
}
})


// APP LISTEN
app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto ' + PORT);
});