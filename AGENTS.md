<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Chess 3D Academy — Reglas del proyecto

## Visión

Ser la **mejor aplicación de ajedrez** existente: aprendizaje profundo + belleza 3D con propósito. Cada interacción enseña; cada pixel importa.

---

## Diseño responsive — OBLIGATORIO

Toda página y layout **debe verse perfecto** en estas tres variantes. Probar mentalmente (y en dispositivo real cuando sea posible) antes de dar por terminado cualquier cambio de UI.

### 1. Desktop (`md:` y superior, ≥768px ancho)

- Layout `/play`: tablero 3D a la **izquierda** (~70%), sidebar fijo a la **derecha** (`w-[24rem]`).
- Layout `/journey`: mapa a la izquierda, misiones/logros en columna sticky derecha (`lg:grid-cols-[1fr_20rem]`).
- Landing: hero en **dos columnas** (texto | escena 3D).
- Calidad visual 3D: **alta** (`useVisualQuality` → bloom completo, DPR hasta 2).
- Tipografía generosa; hover states en cards y botones.

### 2. Móvil vertical / portrait (`max-md`, ancho < 768px, alto > ancho)

- Layout `/play`: tablero **arriba** (`min-h-[52dvh]`), sidebar **abajo** con scroll (`max-h-[48dvh]`).
- Landing: escena 3D **arriba** (`h-[42dvh]`), copy **debajo**.
- Journey: misiones/logros **arriba**, mapa **debajo** (`order-1` / `order-2`).
- Nav compacta: iconos sin texto donde no quepa; botones `size="sm"`.
- Calidad visual 3D: **baja** (sin post-procesado pesado, DPR ≤ 1.25).
- Usar `100dvh` (no `100vh`) para altura viewport con barra de navegación móvil.
- Clase `.safe-area` en layouts raíz para notch/home indicator.

### 3. Móvil horizontal / landscape (`max-md:landscape`)

- Layout `/play`: igual que desktop mini — tablero **izquierda** (`flex-row`), sidebar **estrecho** (`w-[15.5rem]`), sin `max-h` en sidebar.
- Journey: grid de dos columnas compacto (`grid-cols-[1fr_14rem]`).
- Landing: hero en dos columnas apretadas; escena 3D altura `calc(100dvh - 5rem)`.
- Padding y gaps reducidos (`p-2`, `gap-2` en sidebar).
- Calidad visual 3D: **media** (bloom moderado, DPR hasta 1.5).

### Breakpoints Tailwind usados

| Prefijo | Uso en este proyecto |
|---------|---------------------|
| (default) | Móvil portrait |
| `sm:` | Teléfonos grandes |
| `md:` | Tablet / desktop |
| `lg:` | Journey sidebar sticky |
| `max-md:landscape:` | Móvil horizontal exclusivo |

### Hook de calidad visual

`hooks/use-visual-quality.ts` — **usar siempre** en componentes 3D pesados (`ChessScene`, efectos). No hardcodear DPR ni bloom.

---

## Animaciones de piezas — convenciones

- Arco según tipo: caballo = `jump` (arco alto), peón = arco bajo, captura = más rápido + arco extra.
- Lógica en `lib/chess/piece-animation-math.ts`; hook en `hooks/use-piece-animation.ts`.
- Capturas: `CapturedPieceEffect` muestra pieza capturada desvaneciéndose en `capturedSquare`.
- `LastMove` incluye `capturedPiece` y `capturedSquare` (en passant usa casilla distinta al destino).

---

## Stack

Next.js 16 · TypeScript · React Three Fiber · Zustand · chess.js · Tailwind 4 · shadcn/ui

## Archivos privados (no commitear)

- `roadmap.md` — roadmap interno
- `PROJECT.md` — visión extendida

## Comandos

```bash
npm run dev
npm test
npm run build
npm run lint
```
