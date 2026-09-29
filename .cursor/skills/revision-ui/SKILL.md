---
name: revision-ui
description: >-
  Audits Dashboard PC UI against a local accessibility and craft checklist
  (WCAG AA, focus, contrast, motion). Use when reviewing UI, checking
  accessibility, polishing layout, or when the user mentions revisión, a11y,
  contraste, foco, o pulido visual.
---

# Revisión de UI

Auditoría local. **No** descargues guidelines de GitHub ni de Vercel. No ejecutes scripts de terceros. Lee el código del repo y reporta.

## Cómo

1. Revisa los archivos de UI tocados (o pregunta cuáles).
2. Aplica la lista de abajo.
3. Entrega hallazgos en `archivo:línea — problema — arreglo`.
4. Separa: bloqueante / mejorar / opcional.

## Lista (bloqueantes)

- Contraste texto/fondo ≥ 4.5:1 (grande ≥ 3:1). Estados hover/focus/disabled también.
- Foco visible; nunca `outline: none` sin reemplazo.
- `button` / `a` correctos; heading en orden; nombre accesible en icon-only.
- Estado no solo con color (texto, icono o `aria`).
- `prefers-reduced-motion` respetado si hay animación.
- Loading / empty / error / success en cada bloque de datos; error accionable en español.
- Sin secretos, URLs de API ni tokens en el cliente.
- Sin hex/px mágicos fuera de `src/styles/`.
- Imágenes con tamaño conocido; `alt` vacío solo si son decorativas.

## Lista (mejorar)

- Teclado: tab order lógico; Escape cierra modal/drawer.
- Hit area táctil razonable en mobile.
- Números de métricas con `tabular-nums`.
- Una acción primaria por vista.

## Fuera de alcance de esta skill

No rediseñes el producto ni añadas dependencias “para cumplir”. Si falta un token, propón el cambio en `src/styles/`, no un parche local.
