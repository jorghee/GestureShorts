# <samp>Enhancing the GestureControlMapper component's performance</samp>
## <samp>Puntos a mejorar</samp>
- Evitar que al seleccionar un gesto o un control sea un estado del
componente ya que eso hará que se renderice innecesariamente cada vez que se 
selecciona una función. Posiblemente sea imposible por las renderizaciones 
necesarias para los evento de selección

- Debemos evitar que al seleccionar un gesto para un control especifico, este 
nuevamente se pueda usar para seleccionarlo con otro control. Al parecer va a 
ser necesario usar un Mapa para poder sobreescribir el elemento (Done)

## <samp>Lo que nos falta</samp>
- Una vez que ya tenemos el arreglo de objetos con las propiedades gesture y control, 
debemos de guardarlo en algún lugar. La idea es que en un archivo JSON se guarde una 
configuración por defecto, luego si el usuario modifica, tambien se guarde como la 
última modifacación

## <samp>Dudas pendientes</samp>
- Cuando modificamos alguna parte de un componente (es decir, lo que se renderiza),
¿es necesario volver a renderizar el componente o es automático?


