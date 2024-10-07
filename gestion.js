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

// IMPORTACIONES GRPC
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

// PATH DEL PROTO
const PROTO_PATH = path.join(process.cwd(), 'tasks.proto');

// CARGA DE ARCHIVO PROTO
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const taskProto = grpc.loadPackageDefinition(packageDefinition).tasks;

// CLIENTE gRPC
const client = new taskProto.TaskAnalysisService('localhost:50051', grpc.credentials.createInsecure());

/////////////////////////////////////////////////////////////////////////

// ENDPOINT: OBTENER ESTADÍSTICAS DE TAREAS
app.get('/tareas/estadisticas', async (req, res) => {
  client.getTaskStats({}, (error, response) => {
    if (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).send('Error obteniendo estadísticas');
    } else {
      res.status(200).json(response);
    }
  });
});

// ENDPOINT: OBTENER TAREAS CON PALABRA CLAVE
app.get('/tareas/keyword/:keyword', async (req, res) => {
  const { keyword } = req.params;
  client.getTasksWithKeyword({ keyword }, (error, response) => {
    if (error) {
      console.error('Error al obtener tareas con palabra clave:', error);
      res.status(500).send('Error obteniendo tareas con palabra clave');
    } else {
      res.status(200).json(response);
    }
  });
});

//////////////////////////////////////////////////////////////////////////

// ENDPOINT: CREAR UNA NUEVA TAREA
app.post('/tarea', async (req, res) => {
  const { title, description, creationPerson, assignedPerson } = req.body;
  try {
    const nuevaTarea = {
      title: title,
      description: description,
      creationDate: new Date(),
      creationPerson: creationPerson,
      assignedPerson: assignedPerson
    };
      await collection.insertOne(nuevaTarea);
      res.status(200).send('TAREA AGREGADA EN LA BASE DE DATOS');
  } catch (error) {
    console.error('TAREA NO AGREGADA A LA BASE DE DATOS:', error);
    res.status(500).send('Error inserting data');
  }
});

// [ENDPOINT ADICIONAL]: LISTAR TODAS LAS TAREAS
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