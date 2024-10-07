// IMPORTACIONES
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { MongoClient } from "mongodb";

// HABILITAMOS EL .ENV
import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

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

// MONGODB
const uri = env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db('redes_y_comunicaciones');
const collection = db.collection('trabajo_practico_3');

/////////////////////////////////////////////////////////////////////////

// FUNCION PARA DEVOLVER ESTADISTICAS DE TAREA
async function GetTaskStats(call, callback) {
  try {
    
    // TOTAL DE TAREAS
    const totalTasks = await collection.countDocuments();

    // TAREAS ASIGNADAS A PERSONA
    const assignedTasksAggregation = await collection.aggregate([
      { $group: { _id: "$assignedPerson", count: { $sum: 1 } } }
    ]).toArray();
    const tasksAssignedPerPerson = {};
    assignedTasksAggregation.forEach(item => {
      tasksAssignedPerPerson[item._id] = item.count;
    });

    // TAREAS CREADAS POR PERSONA
    const createdTasksAggregation = await collection.aggregate([
      { $group: { _id: "$creationPerson", count: { $sum: 1 } } }
    ]).toArray();
    const tasksCreatedPerPerson = {};
    createdTasksAggregation.forEach(item => {
      tasksCreatedPerPerson[item._id] = item.count;
    });

    callback(null, {
      tareas_Totales: totalTasks,
      tareas_Asignadas: tasksAssignedPerPerson,
      tareas_Creadas: tasksCreatedPerPerson,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de tareas:', error);
    callback(error, null);
  }
}


/////////////////////////////////////////////////////////////////////////

// SERVIDOR
function main() {
  const server = new grpc.Server();
  server.addService(taskProto.TaskAnalysisService.service, { GetTaskStats: GetTaskStats });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
    server.start();
  });
}

main();
