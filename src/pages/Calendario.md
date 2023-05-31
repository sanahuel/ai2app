# Gestión de nuevas capturas

Las capturas tienen los siguientes parámetros:

- Hora de inicio
- Duración
- Holgura Positiva = Cuánto se puede mover hacia adelante
- Holgura Negativa = Cuánto se puede mover hacia atrás

A partir de los parámetros fijados por el usuario se itera a través de las capturas antiguas (BBDD) y las nuevas buscando solapes entre estas.

En caso de encontrar solapes se intenta gestionar de la siguiente forma:

- Si las holguras lo permiten se desplazan las capturas. En caso contrario se avanza el experimento tantos minutos como dure el solape y se vuelve a iterar (hasta que se pueda llegar a una hora de comienzo para la cual no haya solapes o estos se puedan gestionar).
- Si se puede ajustar por holguras se intentará repartir el movimiento a partes iguales entre la captura antigua y la nueva, moviendo cada una la mitad del tiempo de solape.
- Si no se puede repartir a partes iguales, se reparte de forma tan equitativa como se pueda entre las capturas.

**IMPORTANTE**: Para que el algoritmo funcione correctamente tanto las nuevas capturas (_newEvents_) como las antiguas (_oldEvents_) deben estar ordenadas cronológicamente. Si en cualquiera de los dos arrays hay elementos desordenados (saltos hacia atrás en tiempo) llevará a error.
