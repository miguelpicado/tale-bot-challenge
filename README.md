# 🤖 TaleBot Pro - Challenge Studio & Worksheet Creator

> Una aplicación web de código abierto (Open Source) para crear, previsualizar e imprimir retos de programación y dibujos para el robot educativo **TaleBot Pro** (MatataStudio).

![TaleBot Pro Challenge Studio](https://img.shields.io/badge/TaleBot_Pro-Challenge_Studio-00A3FF?style=for-the-badge&logo=robot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)

---

## 🌟 Características Principales

- 🗺️ **Tablero Interactivo 3x4 / 4x3:** Alterna entre orientación **Horizontal (Paisaje)** y **Vertical (Retrato)** en tiempo real.
- 🕹️ **Control Consola TaleBot:** Botones con la misma paleta de colores y comportamiento del robot físico (Avanzar, Retroceder, Girar Izq/Der, Bailar, Sonido, Bajar/Subir Rotulador).
- 💡 **Barra LED en tiempo real:** Visualización interactiva de la barra LED del robot durante la programación y simulación.
- 🎨 **Capa de Dibujo con Rotuladores (Pen Marker):** Dibuja trazos de rotulador dinámicos en el mapa mientras TaleBot ejecuta secuencias de movimiento.
- 🖨️ **Impresión A4 Doble Cara (Fichas + Solución):** 
  - **Página 1:** 2 Retos vacíos con el mapa ilustrado y la rejilla de comandos en blanco para que los niños dibujen las flechas.
  - **Página 2:** 2 Soluciones exactas alineadas al reverso para impresión a doble cara.
- ⚡️ **Generador Automático de Retos:**
  1. *Navegación con Obstáculos* (Resuelto con algoritmo BFS).
  2. *Formas y Letras* (Cuadrados, Rectángulos, Zig-Zag, Letras L, C, U, O, etc.).
  3. *Recorridos Aleatorios por Pasos*.
- 🖼️ **Temas Ilustrados:** Matata Clásico, Espacio Estelar 🚀, Selva Salvaje 🦁, Isla del Tesoro 🏴‍☠️ y Lienzo Blanco para Rotuladores.
- 💾 **Persistencia y Exportación:** Guardado local, importación/exportación de archivos `.json` e integración lista para Google Drive API.

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
