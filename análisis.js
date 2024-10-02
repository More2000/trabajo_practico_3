// IMPORTACIONES
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

// PATH DEL PROTO
const PROTO_PATH = path.join(process.cwd(), 'simple.proto');

// CARGA DE ARCHIVO PROTO
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const taskProto = grpc.loadPackageDefinition(packageDefinition).SimpleService;

// FUNCION PARA DEVOLVER ESTADISTICAS DE TAREA
function add(call, callback) {
  const { number1, number2 } = call.request;
  const result = number1 + number2;
  callback(null, { result });
}

// SERVIDOR
function main() {
  const server = new grpc.Server();
  server.addService(simpleProto.service, { add });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
  });
}

main();
