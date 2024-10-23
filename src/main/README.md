# :hammer: <samp>Estructura del Main process</samp>
- Contiene las implementaciones de los gestos y las implementaciones de los controles.

- Recordemos que estas funciones se ejecutan de forma aislada en este proceso y **no
son visibles en el proceso de renderizado**, es decir, no podemos exportarlas
directamente al módulo [renderer](../renderer/)

## <samp>El módulo [controls](./controls/)</samp>
La lógica de este módulo se basa en definir e implementar las funciones en un
archivo único (para cada función). Luego, referenciamos esta función en un objeto,
como se ve en el archivo [**availableControls**](./controls/availableControls.js)

```javascript
import performLeftClick from "./performLeftClick.js";

export const ac = {
  performLeftClick
};
```

Este archivo es necesario para encapsular las funciones y solo importar el objeto que contiene a todas las funciones. Lo usamos en [index.js](./index.js) y lo hace menos verboso en vez de importar todas las funciones por separado. Esta misma idea la veremos en el
módulo [gestures](./gestures/)

### <samp>Comportamiento de las funciones de control</samp>
Lo que **promete** cada función es realizar un control de escritorio recibiendo como
parametros: el **nombre del gesto como string** y **las articulaciones que luego se
pasan como argumento de la función *gesture***

#### :fearful: <samp>Por qué pasamos el string de la función y no la función misma</samp>

- Hacer visible la función a el Renderer process implica que lo que llega de este
proceso **se serializa**, por lo tanto, si el argumento fuera la función ***gesture***
ocurriria un error ya que en javascript **es imposible serializar una función**.

- Por otro lado, si no ocurriría el problema de serialización, entonces el módulo
[**gestures**](./gestures/) debería estar definida en el Renderer process ya que
desde ahí se pasaría la función **gesture**, lo que causa que sea complicado entender
la relación entre los gestos y los controles.

- Finalmente, el hecho de que reciba como argumento un **string** nos facilita
implementar el manejo de lo que queremos establecer desde el Renderer process, es
decir, podemos crear un arreglo de strings que referenciarán a los gestos
disponibles y manejarlo en la interfaz solo como **strings**

#### <samp>Cómo se maneja la función gesture dentro de la función controls</samp>

Como el argumento es un **string** que referencia a la función **gesture**, una forma
rápida de encontrar la función es establecer un **Map** donde **la clave es el **string
y el valor es la función**. Esto es lo que veremos en la siguiente función que trata
del módulo [**gestures**](./gestures/)

```javascript
const performLeftClick = async (gestureStr, landmarks) => {
  const gesture = ag.get(gestureStr);

  if (gesture && gesture(landmarks)) {
    await mouse.leftClick();
  }
};

```

## :skull: <samp>El módulo [gestures](./gestures/)</samp>
La lógica es la misma que del módulo visto en la sección anterior. Pero debemos tener
presente los siguiente

> **Las funciones que implementan los gestos deben comprometerse a devolver un
valor booleano**

Si analizamos **qué es un gesto** podemos clasificarlos arbitrariamente en dos tipos:
**los gestos instantáneos y los gestos que necesitan un lapso de tiempo**, for instance,
hacer click puede implica que ni bien se capte el indice con el pulgar juntos se
produzca la acción, sin embargo cambiar de escritorio no puede implicar mover la mano
de izquierda a derecha o viceversa en un instante de tiempo y se produzca la acción,
es claro que implica un lapso de tiempo.

> :warning: **A pesar de estos dos tipos de movimientos, todos deben comprometerse a
retornar un valor booleano, de lo contrario, ocurrirá un error al intentar manejar
la función en [controls](./controls/)**

- Las funciones reciben las articulaciones de solo una mano, podriamos hacer que se
pueda manejar las dos manos pero eso **es un gran reto**

Ejemplo del flujo de la función

```javascript
import { id } from "../../utils/utils.js";

export const isPinch = (landmarks) => {
  const thumbTip = landmarks[id.THUMB_TIP];
  const indexTip = landmarks[id.INDEX_FINGER_TIP];

  const distance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
  );

  return distance < 0.05; // Umbral
};
```

# <samp>Cómo invocamos a las funciones **desde** [Renderer process](../renderer/src/gestureController/)</samp>

## <samp>El archivo [./index.js](**index.js**)</samp>
Las gran mayoria de configuraciones que aparecen en este archivo son generados por
el framework Vite. Lo único que se ha establecido aqui y si deseamos crear nuevas
funciones que sean visibles en Renderer process, es usar el **protocolo IPC** que
usa Electron

**Por ejemplo**, por el momento estamos utilizando 2 funciones implementadas:
[**moveMouse**](./controls/mouseTracking.js) y
[**performLeftClick**](./controls/performLeftClick.js), por lo tanto tenemos que
hacerlas visibles en el Renderer process, entonces establecemos lo siguiente.

```javascript
ipcMain.handle("moveMouse", async (event, handedness, smoothed) => {
  await moveMouse(handedness, smoothed);
});

ipcMain.handle("performLeftClick", async (event, gestureStr, landmarks) => {
  await ac.performLeftClick(gestureStr, landmarks);
});
```

Puedes investigar más del protocolo IPC en
[Electron ipcMain](https://www.electronjs.org/docs/latest/api/ipc-main)


