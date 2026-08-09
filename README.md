# 🤖 TaleBot Studio — Crea e imprime retos

> Una aplicación web de código abierto (Open Source) para crear, previsualizar e imprimir retos de programación y dibujos para el robot educativo **TaleBot Pro** (MatataStudio).

![TaleBot Studio](https://img.shields.io/badge/TaleBot-Studio-FF5C1B?style=for-the-badge&logo=robot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)

---

## 🌟 Características Principales

- 🗺️ **Tablero Interactivo 5x4 / 4x5:** Alterna entre orientación **Horizontal (Paisaje)** y **Vertical (Retrato)** en tiempo real.
- 🕹️ **Mando igual al del robot físico:** roseta de cuatro botones en cruz alrededor del arranque naranja, más cuatro cápsulas blancas (micro, bucle, baile, borrar), con los mismos colores que la cubierta del TaleBot Pro. Atajos de teclado: flechas, `M`, `L`, `B` e `Intro`.
- 💡 **Barra LED en tiempo real:** un LED por paso programado, que se enciende conforme se ejecuta la secuencia.
- 🎨 **Capa de Dibujo con Rotuladores (Pen Marker):** Dibuja trazos de rotulador dinámicos en el mapa mientras TaleBot ejecuta secuencias de movimiento.
- 🖨️ **Impresión A4 Doble Cara (Fichas + Solución):**
  - **Página 1:** 2 Retos vacíos con el mapa ilustrado y la rejilla de comandos en blanco para que los niños dibujen las flechas.
  - **Página 2:** 2 Soluciones exactas alineadas al reverso para impresión a doble cara.
  - Hoja opcional con los 14 obstáculos recortables.
- ⚡️ **Generador Automático de Retos:**
  1. *Navegación con Obstáculos* (Resuelto con algoritmo BFS).
  2. *Formas y Letras* (Cuadrados, Rectángulos, Zig-Zag, Letras L, C, U, O, etc.).
  3. *Recorridos Aleatorios por Pasos*.
- 🖼️ **Temas del tablero:** Estudio, Órbita 🚀, Selva 🦁, Isla 🏴‍☠️ y Lienzo para rotuladores.
- 💾 **Persistencia y Exportación:** Guardado local, importación/exportación de archivos `.json` e integración lista para Google Drive API.

---

## 🎨 Interfaz

La interfaz sigue una idea sencilla: **el marco se calla y el contenido juega**. El cromado
(barra superior, paneles, modales) es papel cálido y neutro; el color fuerte se reserva para el
tablero, el robot y los botones del mando, que son los que llevan significado.

- **Color:** papel `#FBF7F1` y tinta `#1A1410` como base; ámbar `#FFB020` y naranja `#FF5C1B` como
  acento; cian `#00BFC4` para los estados vivos. Los colores de los comandos son los del robot
  físico y no se tocan: son los que el niño ve en el aparato y en los LED.
- **Tipografía:** *Fredoka* para títulos, *Plus Jakarta Sans* para interfaz y *JetBrains Mono* para
  las coordenadas de casilla, los contadores y los atajos de teclado, que son datos y no decoración.
- **Tablero:** chasis oscuro con el tapete del tema dentro. Las casillas alternan dos tonos en
  damero, sin arcoíris, para que destaquen el robot, la meta y los obstáculos.
- **Iconos propios:** los 14 obstáculos son SVG dibujados a mano (`src/components/ObstacleIcon.jsx`),
  no emoji: se ven igual en cualquier sistema y se distinguen a 24 px.
- **Movimiento:** cada comando tiene su propia duración (avanzar 620 ms, girar 440 ms, bailar
  1500 ms) y el robot arranca, cruza la casilla y frena con esa misma cadencia. Todo respeta
  `prefers-reduced-motion`.

Sin dependencias nuevas: todo el sistema visual son tokens CSS en `src/index.css`.

---

## 🚀 Despliegue en GitHub Pages

Este proyecto es una Single Page Application (SPA) 100% estática en el cliente (sin necesidad de servidor backend).

### Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

El repositorio incluye el flujo de trabajo en `.github/workflows/deploy.yml`.

1. Crea un repositorio en tu cuenta de GitHub (ej. `Tale-Bot-Challenge`).
2. Sube el código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TaleBot Pro Challenge Studio"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/Tale-Bot-Challenge.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings > Pages** y en **Source** selecciona **GitHub Actions**.
4. ¡Listo! En cada `push` a `main`, la web se desplegará automáticamente.

### Configurar un Dominio Personalizado

Si compras un dominio (ej. `talebot-challenges.com`):
1. En GitHub, ve a **Settings > Pages > Custom domain**.
2. Introduce tu dominio y guarda el archivo `CNAME` que GitHub generará en la carpeta `public/CNAME`.

---

## 🛠️ Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/TU_USUARIO/Tale-Bot-Challenge.git
cd Tale-Bot-Challenge

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar versión de producción
npm run build
```

---

## 🤝 Contribuciones y Comunidad

¡Cualquier sugerencia, corrección o nuevo tema ilustrado es bienvenido! Siéntete libre de abrir un *Issue* o enviar un *Pull Request*.

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia [MIT](LICENSE).
