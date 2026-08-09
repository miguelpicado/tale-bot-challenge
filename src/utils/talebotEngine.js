// TaleBot Pro Engine Logic

export const DIRECTIONS = [
  { id: 'NORTH', name: 'Norte', dx: 0, dy: -1, angle: 0, arrow: '▲' },
  { id: 'EAST', name: 'Este', dx: 1, dy: 0, angle: 90, arrow: '►' },
  { id: 'SOUTH', name: 'Sur', dx: 0, dy: 1, angle: 180, arrow: '▼' },
  { id: 'WEST', name: 'Oeste', dx: -1, dy: 0, angle: 270, arrow: '◄' },
];

export const COMMAND_TYPES = {
  FORWARD: { id: 'FORWARD', name: 'Avanzar', color: '#FFB703', textColor: '#000000', icon: '⬆️', ledColor: '#FFD166', key: '↑' },
  BACKWARD: { id: 'BACKWARD', name: 'Retroceder', color: '#0284C7', textColor: '#FFFFFF', icon: '⬇️', ledColor: '#38BDF8', key: '↓' },
  TURN_LEFT: { id: 'TURN_LEFT', name: 'Girar Izquierda', color: '#10B981', textColor: '#FFFFFF', icon: '↩️', ledColor: '#34D399', key: '←' },
  TURN_RIGHT: { id: 'TURN_RIGHT', name: 'Girar Derecha', color: '#F43F5E', textColor: '#FFFFFF', icon: '↪️', ledColor: '#FB7185', key: '→' },
  DANCE: { id: 'DANCE', name: 'Bailar', color: '#8B5CF6', textColor: '#FFFFFF', icon: '💃', ledColor: '#A78BFA', key: 'B' },
  SOUND: { id: 'SOUND', name: 'Sonido / Micro', color: '#EC4899', textColor: '#FFFFFF', icon: '🔊', ledColor: '#F472B6', key: 'M' },
  LOOP: { id: 'LOOP', name: 'Bucle (Repetir)', color: '#FF6900', textColor: '#FFFFFF', icon: '🔁', ledColor: '#FF9500', key: 'L' },
  PEN_DOWN: { id: 'PEN_DOWN', name: 'Bajar Rotulador', color: '#14B8A6', textColor: '#FFFFFF', icon: '🖊️', ledColor: '#2DD4BF', key: 'P' },
  PEN_UP: { id: 'PEN_UP', name: 'Subir Rotulador', color: '#64748B', textColor: '#FFFFFF', icon: '✍️', ledColor: '#94A3B8', key: 'U' },
};

// 12 Printable Cut-out Obstacles
export const OBSTACLE_TYPES = [
  { id: 'ARBOL', name: 'Árbol', icon: '🌳', description: 'Rodear o volar por encima con Alas 🪽' },
  { id: 'MURO', name: 'Muro', icon: '🧱', description: 'Rodear o derribar con Brazos 🦾' },
  { id: 'PUENTE_NS', name: 'Puente Norte-Sur', icon: '🌉', description: 'Pasar solo en sentido vertical (Norte-Sur)' },
  { id: 'PUENTE_EO', name: 'Puente Este-Oeste', icon: '🌉', description: 'Pasar solo en sentido horizontal (Este-Oeste)' },
  { id: 'FUEGO', name: 'Fuego', icon: '🔥', description: 'Barrera insuperable (no se puede cruzar ni volar)' },
  { id: 'LAGO', name: 'Lago', icon: '🌊', description: 'Cruzar volando con las Alas 🪽 de TaleBot' },
  { id: 'FIESTA', name: 'Fiesta', icon: '💃', description: 'Obliga a parar y ejecutar comando BAILAR 💃' },
  { id: 'VOZ', name: 'Mensaje de Voz', icon: '🎙️', description: 'Obliga a parar y reproducir SONIDO 🔊' },
  { id: 'ROTONDA', name: 'Rotonda', icon: '🔄', description: 'Obliga a dar una vuelta completa (360°) en la casilla' },
  { id: 'MEDIO_MURO', name: 'Medio Muro', icon: '🚧', description: 'Obliga a dar media vuelta (180°) y continuar marcha atrás' },
  { id: 'TESORO', name: 'Tesoro', icon: '🪙', description: 'Premio o moneda recolectable' },
  { id: 'ALTO', name: 'Señal de Alto', icon: '🛑', description: 'Obstáculo de detención estándar' }
];

export function getCellLabel(row, col) {
  const rowLetters = ['A', 'B', 'C', 'D', 'E'];
  return `${rowLetters[row] || row + 1}${col + 1}`;
}

export function turnLeftDir(dir) {
  return (dir + 3) % 4;
}

export function turnRightDir(dir) {
  return (dir + 1) % 4;
}

export function expandLoopCommands(rawCommands) {
  const expanded = [];
  const historyBeforeLoop = [];

  for (let i = 0; i < rawCommands.length; i++) {
    const cmd = rawCommands[i];
    if (cmd.id === 'LOOP') {
      expanded.push(...historyBeforeLoop);
    } else {
      expanded.push(cmd);
      historyBeforeLoop.push(cmd);
    }
  }

  return expanded;
}

// Random Non-Self-Intersecting Path Generator (No cell repeats!)
export function generateRandomNoRepeatPath(numRows = 3, numCols = 4, targetSteps = 6) {
  let attempts = 0;
  
  while (attempts < 100) {
    attempts++;
    const startR = Math.floor(Math.random() * numRows);
    const startC = Math.floor(Math.random() * numCols);
    const startDir = Math.floor(Math.random() * 4);
    
    let currR = startR;
    let currC = startC;
    let currDir = startDir;
    
    const visited = new Set([`${currR},${currC}`]);
    const commands = [];

    for (let step = 0; step < targetSteps; step++) {
      // Find valid adjacent unvisited cell options
      const options = [];

      // Check Forward
      const fDir = DIRECTIONS[currDir];
      const fR = currR + fDir.dy;
      const fC = currC + fDir.dx;
      if (fR >= 0 && fR < numRows && fC >= 0 && fC < numCols && !visited.has(`${fR},${fC}`)) {
        options.push({ type: 'FORWARD', nextR: fR, nextC: fC, nextDir: currDir, cmds: [COMMAND_TYPES.FORWARD] });
      }

      // Check Turn Left then Forward
      const lDirIdx = turnLeftDir(currDir);
      const lDir = DIRECTIONS[lDirIdx];
      const lR = currR + lDir.dy;
      const lC = currC + lDir.dx;
      if (lR >= 0 && lR < numRows && lC >= 0 && lC < numCols && !visited.has(`${lR},${lC}`)) {
        options.push({ type: 'TURN_LEFT', nextR: lR, nextC: lC, nextDir: lDirIdx, cmds: [COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD] });
      }

      // Check Turn Right then Forward
      const rDirIdx = turnRightDir(currDir);
      const rDir = DIRECTIONS[rDirIdx];
      const rR = currR + rDir.dy;
      const rC = currC + rDir.dx;
      if (rR >= 0 && rR < numRows && rC >= 0 && rC < numCols && !visited.has(`${rR},${rC}`)) {
        options.push({ type: 'TURN_RIGHT', nextR: rR, nextC: rC, nextDir: rDirIdx, cmds: [COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD] });
      }

      if (options.length === 0) {
        // Dead end reached
        break;
      }

      // Pick a random unvisited neighbor option
      const chosen = options[Math.floor(Math.random() * options.length)];
      commands.push(...chosen.cmds);
      currR = chosen.nextR;
      currC = chosen.nextC;
      currDir = chosen.nextDir;
      visited.add(`${currR},${currC}`);
    }

    if (visited.size >= 3) {
      commands.push(COMMAND_TYPES.DANCE);
      return {
        start: { r: startR, c: startC, dir: startDir },
        target: { r: currR, c: currC },
        commands
      };
    }
  }

  // Fallback default
  return {
    start: { r: numRows - 1, c: 0, dir: 0 },
    target: { r: 0, c: numCols - 1 },
    commands: [COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  };
}

export function simulatePath(start, rawCommands, numRows = 3, numCols = 4) {
  const commands = expandLoopCommands(rawCommands);

  let currR = start.r;
  let currC = start.c;
  let currDir = start.dir || 0;
  let isPenDown = start.penDown || false;

  const trajectory = [{ r: currR, c: currC, dir: currDir, penDown: isPenDown, step: 0 }];
  const visitedCells = new Set([`${currR},${currC}`]);
  const penLines = [];
  let isOutOfBounds = false;

  commands.forEach((cmd, idx) => {
    if (isOutOfBounds) return;

    const prevR = currR;
    const prevC = currC;

    switch (cmd.id) {
      case 'FORWARD': {
        const dirObj = DIRECTIONS[currDir];
        const nextR = currR + dirObj.dy;
        const nextC = currC + dirObj.dx;

        if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols) {
          currR = nextR;
          currC = nextC;
          visitedCells.add(`${currR},${currC}`);
          if (isPenDown) {
            penLines.push({ from: { r: prevR, c: prevC }, to: { r: currR, c: currC }, step: idx + 1 });
          }
        } else {
          isOutOfBounds = true;
        }
        break;
      }
      case 'BACKWARD': {
        const dirObj = DIRECTIONS[currDir];
        const nextR = currR - dirObj.dy;
        const nextC = currC - dirObj.dx;

        if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols) {
          currR = nextR;
          currC = nextC;
          visitedCells.add(`${currR},${currC}`);
          if (isPenDown) {
            penLines.push({ from: { r: prevR, c: prevC }, to: { r: currR, c: currC }, step: idx + 1 });
          }
        } else {
          isOutOfBounds = true;
        }
        break;
      }
      case 'TURN_LEFT':
        currDir = turnLeftDir(currDir);
        break;
      case 'TURN_RIGHT':
        currDir = turnRightDir(currDir);
        break;
      case 'PEN_DOWN':
        isPenDown = true;
        break;
      case 'PEN_UP':
        isPenDown = false;
        break;
      default:
        break;
    }

    trajectory.push({
      r: currR,
      c: currC,
      dir: currDir,
      penDown: isPenDown,
      step: idx + 1,
      commandId: cmd.id
    });
  });

  return {
    trajectory,
    visitedCells: Array.from(visitedCells),
    penLines,
    endPosition: { r: currR, c: currC, dir: currDir },
    isOutOfBounds,
    expandedCommands: commands
  };
}

export function solveNavigationPath(start, end, obstacles = [], numRows = 3, numCols = 4) {
  const obstacleSet = new Set(obstacles.map(o => `${o.r},${o.c}`));
  const queue = [{ r: start.r, c: start.c, dir: start.dir || 0, path: [] }];
  const visited = new Set([`${start.r},${start.c},${start.dir || 0}`]);

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.r === end.r && current.c === end.c) {
      return current.path;
    }

    const dirObj = DIRECTIONS[current.dir];
    const nextR = current.r + dirObj.dy;
    const nextC = current.c + dirObj.dx;

    if (
      nextR >= 0 && nextR < numRows &&
      nextC >= 0 && nextC < numCols &&
      !obstacleSet.has(`${nextR},${nextC}`)
    ) {
      const key = `${nextR},${nextC},${current.dir}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          r: nextR,
          c: nextC,
          dir: current.dir,
          path: [...current.path, COMMAND_TYPES.FORWARD]
        });
      }
    }

    const leftDir = turnLeftDir(current.dir);
    const leftKey = `${current.r},${current.c},${leftDir}`;
    if (!visited.has(leftKey)) {
      visited.add(leftKey);
      queue.push({
        r: current.r,
        c: current.c,
        dir: leftDir,
        path: [...current.path, COMMAND_TYPES.TURN_LEFT]
      });
    }

    const rightDir = turnRightDir(current.dir);
    const rightKey = `${current.r},${current.c},${rightDir}`;
    if (!visited.has(rightKey)) {
      visited.add(rightKey);
      queue.push({
        r: current.r,
        c: current.c,
        dir: rightDir,
        path: [...current.path, COMMAND_TYPES.TURN_RIGHT]
      });
    }
  }

  return null;
}

// Dozens of Shape Presets categorized for Drawing Mode
export const SHAPE_PRESETS = [
  // --- FIGURAS GEOMÉTRICAS ---
  {
    id: 'cuadrado_loop',
    category: 'Figuras',
    name: 'Cuadrado Bucle 🔁',
    description: 'Cuadrado perfecto con el botón Bucle',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.LOOP, COMMAND_TYPES.DANCE]
  },
  {
    id: 'cuadrado',
    category: 'Figuras',
    name: 'Cuadrado 🔲',
    description: 'Cuadrado de 2x2 casillas',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'rectangulo',
    category: 'Figuras',
    name: 'Rectángulo █',
    description: 'Rectángulo horizontal de 3x1 casillas',
    start: { r: 2, c: 0, dir: 1 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'zigzag',
    category: 'Figuras',
    name: 'Zig-Zag ⚡',
    description: 'Línea serpenteante en zig-zag',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'escalera',
    category: 'Figuras',
    name: 'Escalera 🪜',
    description: 'Trazo simétrico de escalones',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'espiral',
    category: 'Figuras',
    name: 'Espiral 🌀',
    description: 'Giro en espiral hacia adentro',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'cruz',
    category: 'Figuras',
    name: 'Cruz ➕',
    description: 'Dibuja una cruz simétrica',
    start: { r: 1, c: 0, dir: 1 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },

  // --- LETRAS ---
  {
    id: 'letra_L',
    category: 'Letras',
    name: 'Letra L 🇱',
    description: 'Letra L mayúscula',
    start: { r: 0, c: 0, dir: 2 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'letra_C',
    category: 'Letras',
    name: 'Letra C 🇨',
    description: 'Contorno de la letra C',
    start: { r: 0, c: 2, dir: 3 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.SOUND]
  },
  {
    id: 'letra_U',
    category: 'Letras',
    name: 'Letra U 🇺',
    description: 'Contorno de la letra U',
    start: { r: 0, c: 0, dir: 2 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'letra_O',
    category: 'Letras',
    name: 'Letra O ⭕',
    description: 'Letra O o número Cero',
    start: { r: 1, c: 1, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'letra_E',
    category: 'Letras',
    name: 'Letra E 🇪',
    description: 'Trazo de la letra E',
    start: { r: 0, c: 2, dir: 3 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'letra_F',
    category: 'Letras',
    name: 'Letra F 🇫',
    description: 'Trazo de la letra F',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'letra_T',
    category: 'Letras',
    name: 'Letra T 🇹',
    description: 'Trazo de la letra T',
    start: { r: 0, c: 0, dir: 1 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'letra_H',
    category: 'Letras',
    name: 'Letra H 🇭',
    description: 'Trazo de la letra H',
    start: { r: 0, c: 0, dir: 2 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },

  // --- NÚMEROS Y DIBUJOS ---
  {
    id: 'num_1',
    category: 'Números',
    name: 'Número 1 1️⃣',
    description: 'Trazo vertical del número 1',
    start: { r: 0, c: 1, dir: 2 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'num_7',
    category: 'Números',
    name: 'Número 7 7️⃣',
    description: 'Trazo del número 7',
    start: { r: 0, c: 0, dir: 1 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'casa',
    category: 'Dibujos',
    name: 'Casa 🏠',
    description: 'Contorno de una casa con tejado',
    start: { r: 2, c: 0, dir: 0 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  },
  {
    id: 'flecha',
    category: 'Dibujos',
    name: 'Flecha ➡️',
    description: 'Dibuja una gran flecha hacia adelante',
    start: { r: 2, c: 0, dir: 1 },
    commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  }
];
