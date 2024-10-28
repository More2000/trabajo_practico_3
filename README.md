## **TP3 - Sistema de Gestión de Tareas Básico**

## **Descripción**
Desarrollar un sistema básico para gestionar tareas.
El sistema tendrá dos microservicios que se comunicarán mediante gRPC y una API REST para la interacción con los usuarios.

## **Objetivo**
El objetivo es implementar una funcionalidad básica de gestión de tareas y mostrar cómo gRPC puede usarse para comunicación interna entre microservicios.

### **Funcionalidades**
1. **Implementación de API REST**:
    - Express para construir la API REST del Microservicio de Gestión de Tareas.
    - Implementación de endpoints para crear y listar tareas.
2. **Definición del Servicio gRPC**:
    - Creación de un `tasks.proto` que define el servicio **gRPC** para el Análisis de Tareas.
3. **Implementación del Servicio gRPC**:
    - **Servicio de Análisis de Tareas**: Implementación de lógica para analizar las tareas, como contar el número total de tareas.
    - Configuración del servicio para que pueda ser invocado por el Microservicio de Gestión de Tareas.
4. **Comunicación entre Microservicios**:
    - El Microservicio de Gestión de Tareas invoca el servicio **gRPC** del Microservicio de Análisis de Tareas para obtener estadísticas sobre las tareas.
    - El Microservicio de Gestión de Tareas invoca el servicio **gRPC** del Microservicio de Extra para obtener otros datos sobre las tareas.
    - Endpoint adicional en la **API REST** que devuelve las estadísticas sobre el número total de tareas.
5. **Configuración y Conexión a la Base de Datos**:
    - Conexión a la base de datos para almacenar y recuperar la información de las tareas.
    - Manejo correcto de las operaciones de base de datos desde el Microservicio de Gestión de Tareas.
6. **Documentación y Pruebas**:
    - Documentación de los endpoints **REST** y el servicio **gRPC**.
    - https://www.notion.so/Redes-y-Comunicaciones-1181d373023780fab296fbf6d7cc1973
