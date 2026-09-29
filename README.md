# Dashboard PC

Tablero de tareas en el navegador. Los datos se quedan en este equipo. Con clave, van cifrados. Sin clave, quedan en claro en este navegador.

## Uso

La barra izquierda abre cada parte. Layout muestra el conteo de cada vista y una lista corta de lo urgente: vencidas, luego bloqueadas, luego en curso. El tablero enseña una vista a la vez: Vencidas, Por hacer, En curso, Hechas o Bloqueadas. Vencidas sale de la fecha; no es un estado. Gráficas cuenta esas mismas vistas. Hoy junta vencidas y en curso. Buscar filtra por título o por la nota. Lo eliminado va a la papelera hasta que lo borres del todo.

Una tarea tiene título, estado, una nota opcional y, si hace falta, un día de vencimiento.

## Arranque

Node.js 22.12 o superior.

```bash
npm install
npm run dev
```

Queda en `http://localhost:5173`. La primera vez eliges la clave (mínimo 8 caracteres) o entras sin clave.

`npm test` corre las pruebas. `npm run lint` el lint. `npm run build` deja el build en `dist/`. `npm run preview` lo sirve.

## La clave

No hay cuenta ni servidor. Si activas la clave, cifra las tareas en el navegador (AES-GCM) y no se guarda. Si la olvidas, no hay recuperación. La app la pide otra vez al entrar, a los 10 minutos sin uso y al minuto de ocultar la pestaña.

En Datos, el candado activa o desactiva la clave. Sin clave, las tareas y el JSON exportado quedan en claro: cualquiera con este navegador puede leerlos. Con clave, el JSON va cifrado. El PDF siempre es una copia legible. Importar un JSON sustituye el tablero. Un respaldo antiguo en claro se puede importar una vez.

No hace falta `.env`. `VITE_API_BASE_URL` está vacío porque no hay API.

## Código

React, TypeScript, Vite y Tailwind. El estado compartido va en Zustand. GSAP se usa solo para el movimiento.

`src/features/` agrupa el producto: `board`, `layout`, `charts`, `search`, `today`, `data` y `vault`. La interfaz compartida está en `src/components`. Color, tipo y sombra, en `src/styles`.

`@/` apunta a `src/`. El resto de alias sigue el mismo criterio: `@features/`, `@components/`, `@lib/`.
