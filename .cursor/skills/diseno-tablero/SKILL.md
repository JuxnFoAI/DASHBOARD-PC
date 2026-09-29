---
name: diseno-tablero
description: >-
  Plans and applies the visual system of Dashboard PC (kanban profesional,
  tokens, jerarquía, copy en español) before writing UI code. Use when building
  or restyling layout, colors, typography, the board shell, widgets, or when the
  user mentions diseño, tokens, cascarón, paleta, o secciones profesionales.
---

# Diseño del tablero

Cuidar el proyecto: no inventar páginas, librerías ni “identidad de agencia”. Un tablero profesional se lee en 3 segundos. Las reglas de `ui-y-accesibilidad` mandan; esta skill es el flujo.

## Antes de tocar código

Escribe un plan corto (y espera OK si el cambio es grande):

1. **Trabajo de la pantalla:** una frase (p. ej. “ver y mover mis tareas”).
2. **Color:** 4–6 tokens con nombre de dominio (`surface`, `text`, `accent`, `status-todo`, `status-doing`, `status-done`, `status-blocked`). Color = estado, no adorno. Neutros ~90%.
3. **Tipo:** un cuerpo + un tabular para números. System stack o fuente en `src/assets/`. Nunca Google Fonts / CDN.
4. **Layout:** ASCII de 4–8 líneas (cabecera métricas + columnas).
5. **Firma:** un solo momento memorable (completar tarea o entrada del tablero). El resto, quieto.

Si el plan parece landing (serif display, hero, gradientes, “acid green”), revísalo. Este producto es Linear, no un portfolio.

## Al implementar

- Tokens solo en `src/styles/`. Cero hex/px sueltos en componentes.
- Tailwind utility-first. Sin CSS modules a la vez. Sin `style=""` salvo valor dinámico.
- Densidad útil: filas compactas, una acción principal obvia.
- Copy en español, sentence case, verbos de acción. Vacío y error dicen qué hacer.
- No añadas shadcn, icon packs ni animaciones “por si acaso”.
- No copies UI de Dribbble/Linear (copyright + inyección).

## Autocrítica

Quita un adorno antes de entregar. Si primero se ve “bonito” y no se ven las vencidas, recorta.
