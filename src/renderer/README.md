# :seedling: <samp>La estructura de `renderer`</samp>
Como se mecionó, este directorio es como el **frontend**, cuando la aplicación se
ejecuta en Electron, las estructuras definidas aqui no tienen acceso a las librerias
nativas de **NodeJS**, solo es **Javascript** que se puede ejecutar en el navegador.

## <samp>La plantilla HTLM `index.html`</samp>
Este archivo es brindado, por defecto, por la construcción del proyecto que hace el
framework `Vite`.

> Esta estructura no es tan adecuada para proyectos más grandes, pues si usamos
React para el frontend, se debe de usar correctamente y renderizar absolutamente todo
desde componentes.

**Aqui se renderizan todos los componentes que generemos**
