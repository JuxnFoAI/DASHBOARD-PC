# Decisiones

Registro corto de lo que se eligió en Dashboard PC. Cada punto dice por qué, qué otra vía había y qué se corrigió cuando algo fallaba.

## Datos en este navegador

**Decisión.** No hay cuenta ni servidor. Las tareas viven en este navegador.

**Por qué.** El tablero es de un solo equipo. Así no hay claves de API que guardar ni un servicio que mantener.

**Otra vía.** Un servidor con usuario y contraseña, para abrir el tablero en otro dispositivo.

**Problema.** Si se borra el navegador, las tareas se pierden. **Cierre:** exportar un JSON (respaldo) y un PDF (copia para leer). Importar un JSON sustituye el tablero entero, para no mezclar dos listas y duplicar tareas.

## Clave, si se quiere

**Decisión.** Al entrar se elige una clave (mínimo 8 caracteres) o se continúa sin ella. Con clave, las tareas se cifran con AES-GCM. La clave no se guarda: hace falta de nuevo al entrar, a los 10 minutos sin uso y al minuto de ocultar la pestaña.

**Por qué.** Quien comparte el equipo puede cerrar las tareas. Quien no quiere clave no queda bloqueado. Olvidar la clave no tiene recuperación, porque no hay servidor que la recuerde.

**Otra vía.** Exigir clave siempre, o no cifrar nunca.

**Problema.** Había tableros viejos guardados en claro, sin la marca de “sin clave”. Tratarlos como cifrados los dejaba ilegibles. **Cierre:** tres casos al abrir: cifrado, sin clave a propósito, o respaldo viejo en claro (se puede importar una vez). El PDF sigue siendo legible aunque el JSON vaya cifrado.

## Cómo se cifra

**Decisión.** El navegador deriva la clave con PBKDF2 (muchas repeticiones) y cifra con AES-GCM. El archivo guarda sal, vector y texto cifrado, no la clave. La clave vive solo en memoria mientras la bóveda está abierta.

**Por qué.** Es el cifrado que ya trae el navegador. No hace falta una librería ni guardar un secreto en el código.

**Otra vía.** Guardar la clave en el navegador para no volver a pedirla, o ofuscar el JSON (parece secreto y no lo es).

**Problema.** Si la clave quedara en disco, cualquiera con este navegador podría leer las tareas. **Cierre:** al bloquear se borra de memoria y hay que escribirla otra vez.

## Vencidas es una vista, no un estado

**Decisión.** El estado de una tarea es Por hacer, En curso, Hecha o Bloqueada. “Vencidas” sale de la fecha: el día ya pasó y la tarea no está hecha. El día de hoy no cuenta. En las listas, Vencidas gana sobre Por hacer, En curso y Bloqueadas. Hecha nunca sale como vencida.

**Por qué.** La fecha cambia sola al pasar el día. El estado lo cambia la persona. Una tarea puede estar en curso y, a la vez, fuera de fecha.

**Otra vía.** Un quinto estado, “Vencida”, que la persona marca a mano.

**Problema.** Con un estado extra, la tarea seguía en Por hacer y también en Vencidas, y los conteos no coincidían. **Cierre:** una sola vista por tarea. Gráficas, Hoy y Layout usan la misma regla.

## Borrar en dos pasos

**Decisión.** Eliminar manda la tarea a la papelera. Borrar del todo solo funciona si ya está ahí.

**Por qué.** Un clic no debe perder el trabajo.

**Otra vía.** Borrar en el momento, sin papelera.

**Problema.** Se podía intentar borrar del todo una tarea que aún estaba en el tablero. **Cierre:** si no está en la papelera, la app lo rechaza.

## Una vista a la vez

**Decisión.** El tablero muestra una lista: Vencidas, Por hacer, En curso, Hechas o Bloqueadas. Al entrar abre En curso.

**Por qué.** Es lo que se suele mirar primero: el trabajo activo. El resto se abre desde la barra.

**Otra vía.** Un kanban con todas las columnas a la vez.

**Problema.** Cinco columnas a la vez aprietan títulos, notas y fechas en una pantalla chica. **Cierre:** una lista ancha y la cuenta de cada vista en Layout.

## Estado compartido y reglas aparte

**Decisión.** Lo que varias pantallas necesitan (tareas, bóveda, tema) está en Zustand. Crear, borrar, vencer o leer un respaldo son funciones puras, con pruebas.

**Por qué.** La pantalla solo muestra. La regla se puede probar sin abrir el navegador.

**Otra vía.** Redux, o dejar cada regla dentro del componente.

**Problema.** Con la regla pegada al botón, un fallo de fecha o de cifrado solo se veía al usar la app. **Cierre:** la función devuelve el resultado o un error claro, y el componente muestra reintentar o el mensaje.

## PDF hecho aquí

**Decisión.** El PDF se arma en el proyecto, sin librería de documentos. Un título no puede romper el archivo: paréntesis y caracteres raros se escapan.

**Por qué.** El PDF es una copia para leer. El proyecto ya no suma dependencias “por si acaso”.

**Otra vía.** Una librería tipo pdf-lib. Menos código propio, más peso y otro paquete que vigilar.

**Problema.** Un título con paréntesis o texto tipo código rompía el archivo o se leía mal. **Cierre:** el texto se escribe como literal PDF. Si todo está en la papelera, el PDF dice que no hay tareas en el tablero.

## Movimiento solo donde se nota

**Decisión.** GSAP anima la entrada, los iconos y alguna gráfica. Si el sistema pide menos movimiento, la app salta al estado final y limpia la animación al salir de la pantalla.

**Por qué.** El movimiento marca el cambio de vista. No debe marear ni quedarse corriendo en segundo plano.

**Otra vía.** Animar todo con CSS, o una librería de animación de React.

**Problema.** Una animación a medias dejaba la interfaz a medias al cambiar de sección. **Cierre:** al desmontar se revierte. Quien pide poco movimiento ve el resultado directo.
