---
name: motion-gsap
description: >-
  Implements GSAP motion for Dashboard PC from npm only, with reduced-motion
  fallbacks and cleanup on unmount. Use when adding animations, tweens,
  timelines, page transitions, complete-task effects, or when the user mentions
  GSAP, animaciones, motion, o efectos.
---

# Motion GSAP

GSAP es parte del producto, no decoración. Tres momentos en v1: entrada del tablero, cambio de vista, completar tarea. Nada más sin pedirlo.

## Instalación (segura)

- Solo `npm install gsap`. Versión en lockfile. Nunca CDN, jsDelivr ni `<script>` remoto.
- Import nombrado: `import gsap from "gsap"`.
- No instales plugins extra (ScrollTrigger, Flip, SplitText, Draggable) salvo que el usuario lo pida.
- Un módulo de motion (`src/lib/` o `src/features/<feature>/`), no tweens sueltos en cada componente.

## Contrato técnico

- Anima `transform` y `opacity`. Nunca `width`/`height`/`top` por frame.
- `gsap.matchMedia()` con `(prefers-reduced-motion: reduce)`: estado final visible, duración 0, sin stagger.
- En React: crear en `useEffect`/`useLayoutEffect` y **revertir o `kill()` al desmontar**. Sin timelines huérfanas.
- No mezcles `translate-*` de Tailwind en el mismo nodo que GSAP mueve.
- No animes listas en cada tick del store. El tablero denso no flota.

## Reduced motion

```ts
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set(targets, { clearProps: "transform", opacity: 1 });
});
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // timeline corta; easing del módulo de motion, no magia suelta
});
return () => mm.revert();
```

## Cuidar el proyecto

- Si CSS transition basta (hover de botón), no uses GSAP.
- Duraciones e easings centralizados (constantes), no números mágicos.
- No `console.log` dentro del ticker.
