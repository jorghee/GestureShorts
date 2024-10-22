# <samp>Entrada de nuestra aplicación</samp>
**El archivo de entrada para realizar la renderización en el navegador (en este caso,
en el entorno de Electron) es el archivo `main.jsx`.** Aqui se vé cómo React
obtiene el elemento de id `root` de `index.js` y dentro de esta etiqueta, se
renderiza el componente `App.jsx`

# <samp>El componente `App.jsx`</samp>
Componente padre de nuestro proyecto. Si hacemos una revisión rápida, el componente
solo usa la lógica definida en cada directorio que vemos

1. Usamos el módulo `hooks` para poder establecer estados en la aplicación:
llamamos a `hooks/useWebcam` para establecer la conexión con la cámara de nuestro
computador, llamamos a useHandLandmarker para poder establecer la conexión con el
framework Mediapipe para estar listos para detectar las manos

2. Usamos el módulo `components` para renderizar otros componentes dentro del
componente padre `App`

3. Usamos gestureController para poder gestionar los resultados que nos brinda la
predicción de las manos que hace Mediapipe. En otras palabras...

  > Ya tengo los resultados de Mediapipe, ahora qué quiero hacer con ello. Quiero
  crear una lógica con los resultados para luego usar la librería nut-tree-fork/nut-js
  y hacer un control de mi escritorio

  **Lo que se ha descrito lo gestiona `gestureController/gestureController`**, y es
  este controlador quien hace la conexión entre la creación de los gestos y lo que
  quiero hacer con los gestos.

# :eyes: <samp>Qué modificaremos en el proceso Renderer (en este directorio)</samp>
Como se explicó en la sección anterior, solo el modulo `gestureController` realiza
la lógica de qué hacer con los resultados. Por ello, solo debemos modificar este
módulo par poder conectar los gestos y controles que establecemos en
[Main process](../../main/)

# :zap: <samp>Acerca de React</samp>
Debemos tener claro que React nativo es un framework de Javascript creado
por Meta para agilizar la creación de aplicaciones web sin la necesidad de separar
la lógica del frontend con la del backend.

> El creador de React era un ingeniero backend que quizo crear y gestionar los
elementos del DOM virtual desde Javascript, creando funciones que hagan el trabajo
por nosotros

Imaginemos que tenemos una etiqueta en HTML

```html
<div id="root"></div>
```

La funcionalidad que nos brinda React es poder renderizar conjunto de elementos
desde Javascript

```javascript
import React from "react";
import ReactDOM from "react-dom";

const appDomElem = document.getElementById("root");
const root = ReactDOM.createRoot(appDomElem);

// Componente sin JSX
const MyComponent = () => {
  return React.createElement(
    "div", // Tipo de elemento (tag div)
    null,  // Propiedades
    React.createElement("h1", null, "¡Hola, mundo!"),
    React.createElement("p", null, "Esto es React sin JSX.")
  );
};

root.render(
  React.createElement(MyComponent),
);
```

## :fire: <samp>El azucar sintáctico JSX</samp>
JSX es una extensión de ECMAScript que está basado en XML que nos va a permitir
**crear de una forma más declarativa nuestros elementos** y asi evitar escribir
React nativo, que es complicado para aplicaciones de gran envergadura.

- Entonces, se necesita algún compilador que se encargue de poder traducir JSX a
React nativo. Uno de los programas es [**Babel**](https://babeljs.io/)

```javascript
// Componente con JSX
const MyComponent = () => (
  <div>
    <h1>¡Hola, mundo!</h1>
    <p>Esto es React con JSX.</p>
  </div>
);

root.render(
  <MyComponent />
);
```
## :eyes: <samp>Renderización de React</samp>
React **no puede renderizar más de un elemento a la vez**. Por ejemplo, si el
componente `MyComponent` creado en el ejemplo anterior los renderizamos más de
una vez, es un error de renderización

```javascript
// Error
root.render(
  <MyComponent />
  <MyComponent />
);
```

Para solucionar este problema, React nos proporciona un componente suyo que permite
envolver todos nuestros elementos, `React.Fragment`.

```javascript
// Sin JSX
root.render(
  React.createElement(React.Fragment, null, MyComponent, MyComponent),
);

// Con JSX
root.render(
  <>
    <MyComponent />
    <MyComponent />
  </>
);
```

## :skull: <samp>Estados en React</samp>
### <samp>(such as useState, useRef, useEffect, and useCallback)</samp>
El estado es una forma de almacenar datos que pueden cambiar con el tiempo. Cada
componente puede tener su propio estado (un estado **siempre** está asociado a un
componente), y cuando el estado cambia, React vuelve a renderizar el componente
automáticamente.

- **El hook `useState`** recibe un valor inicial y devuelve un arreglo de dos
elementos: el valor inicial y la función que se encarga de cambiar dicho valor inicial.

    > *Tener en cuenta que la `entidad Estado` que devuelve el Hook es un objeto,
    por lo tanto, React solo reacciona cuando dicho objeto es cambiado por otro
    objeto no cuando el mismo objeto se ha cambiado (debe cambiar de objeto para
    producir un renderizado).*

- **El hook `useRef`.** se utiliza para crear una referencia mutable que persiste a
lo largo de todo el ciclo de vida del componente. A diferencia de `useState`, cuando
cambias un valor referenciado con `useRef`, no provoca un nuevo renderizado del componente.

    > *Es útil en situaciones donde necesitas almacenar un valor que quieres que
    sobreviva a los re-renderizados, pero no necesitas que ese valor desencadene un
    re-render.*

- **El hook `useEffect`** se usa para gestionar **efectos secundarios** en los
componentes. Su ejecución depende de tres condiciones:

    > Nos permite ejecutar código arbitrario cuando el componente se monta en el DOM
    y cada vez que cambian las dependencias que nosotros le digamos

    1. **Primera ejecución.** Al renderizar el componente por primera vez, el
    contenido de `useEffect` se ejecuta después de que se haya completado el
    renderizado.

    2. **Dependencias.** El segundo argumento de useEffect es un array de
    dependencias. React ejecutará el código de `useEffect` cada vez que una de las
    dependencias cambie.

        > *Si el array está vacío ([]), el efecto solo se ejecutará una vez, tras el
        primer renderizado.*

    3. **Cleanup.** Si el efecto retorna una función, esta función se ejecuta antes
    de desmontar el componente o antes de ejecutar el efecto de nuevo si cambian las
    dependencias

- **El hook `useCallback`.** se utiliza para **memorizar funciones**, es decir, para
evitar que una función se recree en cada renderizado, a menos que cambien sus
dependencias

## Propiedades en React (Props)
- Las props son la forma en que los componentes pueden recibir datos. Puedes pasar
datos de un componente padre a un componente hijo a través de las props.

