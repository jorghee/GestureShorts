# :skull: <samp>El entorno de Electron</samp>
Electron es un marco de desarrollo de código abierto que permite crear aplicaciones
de escritorio multiplataforma utilizando tecnologías web como JavaScript, HTML y CSS.

# <samp>¿Cómo funciona Electron?</samp>

Electron combina dos tecnologías clave:

- **Chromium.** Es el motor de renderizado detrás del navegador Google Chrome, que se usa para mostrar y ejecutar interfaces web dentro de una aplicación de escritorio.

- **Node.js.** Un entorno de ejecución para JavaScript en el **backend**, que permite
a la aplicación interactuar con el sistema operativo. Node.js le da a la aplicación la
capacidad de acceder a APIs de bajo nivel, algo que normalmente no está disponible en
un navegador web.

# <samp>Arquitectura de Electron</samp>

La arquitectura de una aplicación Electron consta de dos procesos principales:

## <samp>Proceso principal (Main Process)</samp>
- Controla la vida útil de la aplicación. Es el primer proceso que se ejecuta y puede
abrir o cerrar ventanas, manejar la comunicación entre procesos y acceder a las APIs
del sistema operativo.

- El proceso principal puede ejecutar código de Node.js directamente, lo que permite gestionar tareas como el acceso al sistema de archivos y ejecutar scripts en segundo plano.

- **En este caso Vite abstrae este proceso en el directorio [main](./main/)**

## <samp>Proceso de renderizado (Renderer Process)</samp>
- **Cada ventana abierta en una aplicación Electron se ejecuta en su propio proceso
de renderizado**.

- **El proceso de renderizado no tiene acceso directo a las APIs del OS**, pero puede
comunicarse con el proceso principal para realizar esas tareas

- **En este caso Vite abstrae este proceso en el directorio [renderer](./renderer/)**

## El directorio [preload](./preload/)
Este directorio se encarga de realizar la conexión entre los dos procesos
