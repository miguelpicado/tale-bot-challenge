// TaleBot Pro Engine Logic

export const DIRECTIONS = [
  { id: 'NORTH', name: 'Norte', dx: 0, dy: -1, angle: 0, arrow: '▲' },
  { id: 'EAST', name: 'Este', dx: 1, dy: 0, angle: 90, arrow: '►' },
  { id: 'SOUTH', name: 'Sur', dx: 0, dy: 1, angle: 180, arrow: '▼' },
  { id: 'WEST', name: 'Oeste', dx: -1, dy: 0, angle: 270, arrow: '◄' },
];

export const COMMAND_TYPES = {
  FORWARD: { id: 'FORWARD', name: 'Avanzar', color: '#10B981', textColor: '#FFFFFF', icon: '⬆️', ledColor: '#34D399', key: '↑' },
  BACKWARD: { id: 'BACKWARD', name: 'Retroceder', color: '#EF4444', textColor: '#FFFFFF', icon: '⬇️', ledColor: '#F87171', key: '↓' },
  TURN_LEFT: { id: 'TURN_LEFT', name: 'Girar Izquierda', color: '#FFC700', textColor: '#0F172A', icon: '↩️', ledColor: '#FFD166', key: '←' },
  TURN_RIGHT: { id: 'TURN_RIGHT', name: 'Girar Derecha', color: '#00A3FF', textColor: '#FFFFFF', icon: '↪️', ledColor: '#38BDF8', key: '→' },
  DANCE: { id: 'DANCE', name: 'Bailar', color: '#8B5CF6', textColor: '#FFFFFF', icon: '💃', ledColor: '#A78BFA', key: 'B' },
  SOUND: { id: 'SOUND', name: 'Sonido / Micro', color: '#06B6D4', textColor: '#FFFFFF', icon: '🔊', ledColor: '#22D3EE', key: 'M' },
  LOOP: { id: 'LOOP', name: 'Bucle (Repetir)', color: '#84CC16', textColor: '#FFFFFF', icon: '🔁', ledColor: '#A3E635', key: 'L' },
  CLEAR: { id: 'CLEAR', name: 'Borrar', color: '#FFFFFF', textColor: '#0F172A', icon: '🗑️', ledColor: '#FFFFFF', key: 'DEL' },
  PEN_DOWN: { id: 'PEN_DOWN', name: 'Bajar Rotulador', color: '#14B8A6', textColor: '#FFFFFF', icon: '🖊️', ledColor: '#2DD4BF', key: 'P' },
  PEN_UP: { id: 'PEN_UP', name: 'Subir Rotulador', color: '#64748B', textColor: '#FFFFFF', icon: '✍️', ledColor: '#94A3B8', key: 'U' },
  BRAZOS: { id: 'BRAZOS', name: 'Poner Brazos 🦾', color: '#F97316', textColor: '#FFFFFF', icon: '🦾', ledColor: '#FB923C', key: 'A' },
  ALAS: { id: 'ALAS', name: 'Poner Alas 🪽', color: '#3B82F6', textColor: '#FFFFFF', icon: '🪽', ledColor: '#60A5FA', key: 'W' },
};

// Obstáculos y pasadas intermedias recortables.
// `blocking` marca los que cierran el paso: el resolutor automático rodea esos
// y atraviesa el resto (recogidas y paradas obligadas sí se pueden pisar).
export const OBSTACLE_TYPES = [
  { id: 'ALAS', name: 'Poner Alas', icon: '🪽', blocking: false, description: 'Pasada intermedia: Poner alas a TaleBot' },
  { id: 'BRAZOS', name: 'Poner Brazos', icon: '🦾', blocking: false, description: 'Pasada intermedia: Poner brazos a TaleBot' },
  { id: 'ARBOL', name: 'Árbol', icon: '🌳', blocking: true, description: 'Rodear o volar por encima con Alas 🪽' },
  { id: 'MURO', name: 'Muro', icon: '🧱', blocking: true, description: 'Rodear o derribar con Brazos 🦾' },
  { id: 'PUENTE_NS', name: 'Puente Norte-Sur', icon: '🌉', blocking: true, description: 'Pasar solo en sentido vertical (Norte-Sur)' },
  { id: 'PUENTE_EO', name: 'Puente Este-Oeste', icon: '🌉', blocking: true, description: 'Pasar solo en sentido horizontal (Este-Oeste)' },
  { id: 'FUEGO', name: 'Fuego', icon: '🔥', blocking: true, description: 'Barrera insuperable (no se puede cruzar ni volar)' },
  { id: 'LAGO', name: 'Lago', icon: '🌊', blocking: true, description: 'Cruzar volando con las Alas 🪽 de TaleBot' },
  { id: 'FIESTA', name: 'Fiesta', icon: '💃', blocking: false, description: 'Obliga a parar y ejecutar comando BAILAR 💃' },
  { id: 'VOZ', name: 'Mensaje de Voz', icon: '🎙️', blocking: false, description: 'Obliga a parar y reproducir SONIDO 🔊' },
  { id: 'ROTONDA', name: 'Rotonda', icon: '🔄', blocking: false, description: 'Obliga a dar una vuelta completa (360°) en la casilla' },
  { id: 'MEDIO_MURO', name: 'Medio Muro', icon: '🚧', blocking: true, description: 'Obliga a dar media vuelta (180°) y continuar marcha atrás' },
  { id: 'TESORO', name: 'Tesoro', icon: '🪙', blocking: false, description: 'Premio o moneda recolectable' },
  { id: 'ALTO', name: 'Señal de Alto', icon: '🛑', blocking: true, description: 'Obstáculo de detención estándar' }
];

const BLOCKING_IDS = new Set(OBSTACLE_TYPES.filter(o => o.blocking).map(o => o.id));

export function isBlocking(obstacle) {
  return BLOCKING_IDS.has(obstacle?.type || 'ALTO');
}

/**
 * Cuánto dura cada comando en la simulación, en ms.
 * El robot real acelera, recorre la casilla y frena; los giros son más cortos
 * y el baile ocupa un compás entero.
 */
export const COMMAND_DURATION = {
  FORWARD: 620,
  BACKWARD: 680,
  TURN_LEFT: 440,
  TURN_RIGHT: 440,
  DANCE: 2000,
  SOUND: 520,
  LOOP: 200,
  PEN_DOWN: 360,
  PEN_UP: 360
};

export const DEFAULT_STEP_MS = 520;

export function durationOf(commandId) {
  return COMMAND_DURATION[commandId] ?? DEFAULT_STEP_MS;
}

export function getCellLabel(row, col, numRows = 5) {
  const rowLettersFromBottom = ['A', 'B', 'C', 'D', 'E', 'F'];
  const letterIndex = Math.max(0, numRows - 1 - row);
  const letter = rowLettersFromBottom[letterIndex] || 'A';
  return `${letter}${col + 1}`;
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
    const cmdId = typeof cmd === 'string' ? cmd : (cmd?.id || cmd);

    if (cmdId === 'LOOP') {
      if (historyBeforeLoop.length > 0) {
        // Cada pulsación del botón Bucle (LOOP) repite la secuencia previa exactamente 1 vez
        expanded.push(...historyBeforeLoop);
      }
    } else {
      expanded.push(cmd);
      historyBeforeLoop.push(cmd);
    }
  }

  return expanded;
}

// Random Non-Self-Intersecting Path Generator (No cell repeats!)
export function generateRandomNoRepeatPath(numRows = 4, numCols = 5, targetSteps = 6) {
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
      const options = [];

      // Forward
      const fDir = DIRECTIONS[currDir];
      const fR = currR + fDir.dy;
      const fC = currC + fDir.dx;
      if (fR >= 0 && fR < numRows && fC >= 0 && fC < numCols && !visited.has(`${fR},${fC}`)) {
        options.push({ type: 'FORWARD', nextR: fR, nextC: fC, nextDir: currDir, cmds: [COMMAND_TYPES.FORWARD] });
      }

      // Turn Left + Forward
      const lDirIdx = turnLeftDir(currDir);
      const lDir = DIRECTIONS[lDirIdx];
      const lR = currR + lDir.dy;
      const lC = currC + lDir.dx;
      if (lR >= 0 && lR < numRows && lC >= 0 && lC < numCols && !visited.has(`${lR},${lC}`)) {
        options.push({ type: 'TURN_LEFT', nextR: lR, nextC: lC, nextDir: lDirIdx, cmds: [COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD] });
      }

      // Turn Right + Forward
      const rDirIdx = turnRightDir(currDir);
      const rDir = DIRECTIONS[rDirIdx];
      const rR = currR + rDir.dy;
      const rC = currC + rDir.dx;
      if (rR >= 0 && rR < numRows && rC >= 0 && rC < numCols && !visited.has(`${rR},${rC}`)) {
        options.push({ type: 'TURN_RIGHT', nextR: rR, nextC: rC, nextDir: rDirIdx, cmds: [COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD] });
      }

      if (options.length === 0) break;

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

  return {
    start: { r: numRows - 1, c: 0, dir: 0 },
    target: { r: 0, c: numCols - 1 },
    commands: [COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE]
  };
}

export function simulatePath(start, rawCommands, numRows = 4, numCols = 5) {
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
    const cmdId = typeof cmd === 'string' ? cmd : (cmd?.id || cmd);

    const prevR = currR;
    const prevC = currC;

    switch (cmdId) {
      case 'FORWARD': {
        const dirObj = DIRECTIONS[currDir];
        const nextR = currR + dirObj.dy;
        const nextC = currC + dirObj.dx;

        if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols) {
          currR = nextR;
          currC = nextC;
          visitedCells.add(`${currR},${currC}`);
          penLines.push({
            type: 'LINE',
            from: { r: prevR, c: prevC },
            to: { r: currR, c: currC },
            dir: currDir,
            step: idx + 1
          });
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
          penLines.push({
            type: 'LINE',
            from: { r: prevR, c: prevC },
            to: { r: currR, c: currC },
            dir: (currDir + 2) % 4,
            step: idx + 1
          });
        } else {
          isOutOfBounds = true;
        }
        break;
      }
      case 'TURN_LEFT': {
        const prevDir = currDir;
        currDir = turnLeftDir(currDir);
        penLines.push({
          type: 'ARC',
          arcType: 'TURN_LEFT',
          cell: { r: currR, c: currC },
          fromDir: prevDir,
          toDir: currDir,
          step: idx + 1
        });
        break;
      }
      case 'TURN_RIGHT': {
        const prevDir = currDir;
        currDir = turnRightDir(currDir);
        penLines.push({
          type: 'ARC',
          arcType: 'TURN_RIGHT',
          cell: { r: currR, c: currC },
          fromDir: prevDir,
          toDir: currDir,
          step: idx + 1
        });
        break;
      }
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
      commandId: cmdId
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

export function solveNavigationPath(start, end, obstacles = [], numRows = 4, numCols = 5) {
  // Solo cierran el paso los obstáculos marcados como `blocking`
  const obstacleSet = new Set(obstacles.filter(isBlocking).map(o => `${o.r},${o.c}`));
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

export function solvePathWithWaypoints(start, end, waypoints = [], obstacles = [], numRows = 4, numCols = 5) {
  if (!waypoints || waypoints.length === 0) {
    return solveNavigationPath(start, end, obstacles, numRows, numCols);
  }

  let currentStart = { ...start };
  const fullPath = [];

  for (let i = 0; i < waypoints.length; i++) {
    const wp = waypoints[i];
    const segment = solveNavigationPath(currentStart, wp, obstacles, numRows, numCols);
    if (!segment) return null;

    fullPath.push(...segment);

    if (wp.type === 'FIESTA') {
      fullPath.push(COMMAND_TYPES.DANCE);
    } else if (wp.type === 'VOZ') {
      fullPath.push(COMMAND_TYPES.SOUND);
    }

    const sim = simulatePath(currentStart, segment, numRows, numCols);
    currentStart = sim.endPosition;
  }

  const finalSegment = solveNavigationPath(currentStart, end, obstacles, numRows, numCols);
  if (!finalSegment) return null;

  fullPath.push(...finalSegment);
  return fullPath;
}

export const SHAPE_PRESETS = [
  // --- GEOMETRÍA (12) ---
  { id: 'cuadrado_2x2', category: 'Geometría', name: 'Cuadrado 🔲', description: 'Cuadrado de 2x2 casillas', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'cuadrado_loop', category: 'Geometría', name: 'Cuadrado Bucle 🔁', description: 'Cuadrado perfecto con botón Bucle (3 pulsaciones)', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.LOOP, COMMAND_TYPES.LOOP, COMMAND_TYPES.LOOP, COMMAND_TYPES.DANCE] },
  { id: 'rectangulo', category: 'Geometría', name: 'Rectángulo ▭', description: 'Rectángulo alargado de 3x1 casillas', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'triangulo', category: 'Geometría', name: 'Triángulo Escaleno 📐', description: 'Trazo triangular en rejilla', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'rombo', category: 'Geometría', name: 'Rombo Diamond ♦️', description: 'Figura en diamante', start: { r: 2, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'cruz', category: 'Geometría', name: 'Cruz Simón ➕', description: 'Cruz de cuatro brazos', start: { r: 2, c: 2, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'escalera', category: 'Geometría', name: 'Escalera 🪜', description: 'Peldaños escalonados hacia arriba', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'espiral_cuadrada', category: 'Geometría', name: 'Espiral 🌀', description: 'Espiral envolvente hacia el centro', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'marco_exterior', category: 'Geometría', name: 'Marco Grande 🔲', description: 'Perímetro exterior del tapete', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_U_geo', category: 'Geometría', name: 'Canal en U 🪣', description: 'Trazo abierto en forma de U', start: { r: 0, c: 0, dir: 2 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'doble_cuadrado', category: 'Geometría', name: 'Gemelos ♊️', description: 'Dos cuadrados adyacentes', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'laberinto_z', category: 'Geometría', name: 'Zig-Zag Z ⚡️', description: 'Trazo en zigzag horizontal', start: { r: 3, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },

  // --- LETRAS (12) ---
  { id: 'letra_L', category: 'Letras', name: 'Letra L 🇱', description: 'Letra L mayúscula', start: { r: 0, c: 0, dir: 2 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_F', category: 'Letras', name: 'Letra F 🇫', description: 'Letra F con dos brazos', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_H', category: 'Letras', name: 'Letra H 🇭', description: 'Letra H de dos columnas', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_E', category: 'Letras', name: 'Letra E 🇪', description: 'Letra E mayúscula', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_T', category: 'Letras', name: 'Letra T 🇹', description: 'Letra T mayúscula', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_C', category: 'Letras', name: 'Letra C 🇨', description: 'Letra C abierta a la derecha', start: { r: 0, c: 2, dir: 3 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_U', category: 'Letras', name: 'Letra U 🇺', description: 'Letra U mayúscula', start: { r: 0, c: 0, dir: 2 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_O', category: 'Letras', name: 'Letra O 🇴', description: 'Letra O cerrada', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_P', category: 'Letras', name: 'Letra P 🇵', description: 'Letra P con bucle superior', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_I', category: 'Letras', name: 'Letra I 🇮', description: 'Letra I recta con bases', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_J', category: 'Letras', name: 'Letra J 🇯', description: 'Letra J con gancho inferior', start: { r: 0, c: 2, dir: 2 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'letra_Z', category: 'Letras', name: 'Letra Z 🇿', description: 'Letra Z con trazo en zapatilla', start: { r: 0, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },

  // --- NÚMEROS (10) ---
  { id: 'num_0', category: 'Números', name: 'Número 0 0️⃣', description: 'Cero en forma rectangular', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_1', category: 'Números', name: 'Número 1 1️⃣', description: 'Uno vertical directo', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_2', category: 'Números', name: 'Número 2 2️⃣', description: 'Dos con base horizontal', start: { r: 0, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_3', category: 'Números', name: 'Número 3 3️⃣', description: 'Tres con doble curva', start: { r: 0, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_4', category: 'Números', name: 'Número 4 4️⃣', description: 'Cuatro en silla invertida', start: { r: 0, c: 0, dir: 2 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_5', category: 'Números', name: 'Número 5 5️⃣', description: 'Cinco con techo y barriga', start: { r: 0, c: 2, dir: 3 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_6', category: 'Números', name: 'Número 6 6️⃣', description: 'Seis con panza inferior', start: { r: 0, c: 2, dir: 3 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_7', category: 'Números', name: 'Número 7 7️⃣', description: 'Siete con visera horizontal', start: { r: 0, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_8', category: 'Números', name: 'Número 8 8️⃣', description: 'Ocho en doble bucle', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'num_9', category: 'Números', name: 'Número 9 9️⃣', description: 'Nueve con cabeza redonda', start: { r: 2, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },

  // --- SÍMBOLOS (8) ---
  { id: 'sim_flecha', category: 'Símbolos', name: 'Flecha Directa ➔', description: 'Flecha apuntando a la meta', start: { r: 3, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_rayo', category: 'Símbolos', name: 'Rayo ⚡️', description: 'Rayo en tres quiebros', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_corazon', category: 'Símbolos', name: 'Corazón 🧡', description: 'Vértice y arcos de corazón', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_estrella', category: 'Símbolos', name: 'Estrella Trazo ⭐️', description: 'Estrella en cruz con brazos', start: { r: 2, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_corona', category: 'Símbolos', name: 'Corona 👑', description: 'Corona de 3 picos', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_ancla', category: 'Símbolos', name: 'Ancla Pirata ⚓️', description: 'Ancla marítima', start: { r: 0, c: 1, dir: 2 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_llave', category: 'Símbolos', name: 'Llave Secreta 🔑', description: 'Llave de castillo', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'sim_escudo', category: 'Símbolos', name: 'Escudo 🛡️', description: 'Escudo protector', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },

  // --- DIBUJOS (8) ---
  { id: 'dib_casita', category: 'Dibujos', name: 'Casita 🏠', description: 'Paredes y tejado de casita', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_coche', category: 'Dibujos', name: 'Coche 🚗', description: 'Chasis de automóvil', start: { r: 3, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_barco', category: 'Dibujos', name: 'Barco ⛵️', description: 'Casco y mástil de velero', start: { r: 3, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_arbol', category: 'Dibujos', name: 'Árbol 🌲', description: 'Tronco y copa de pino', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_LEFT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_sol', category: 'Dibujos', name: 'Sol ☀️', description: 'Sol central con rayos', start: { r: 2, c: 2, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.BACKWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_pez', category: 'Dibujos', name: 'Pez 🐟', description: 'Cuerpo y cola de pez', start: { r: 2, c: 0, dir: 1 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_bandera', category: 'Dibujos', name: 'Bandera 🚩', description: 'Mástil y estandarte', start: { r: 3, c: 0, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] },
  { id: 'dib_robot', category: 'Dibujos', name: 'Robot 🤖', description: 'Cabeza y antena TaleBot', start: { r: 3, c: 1, dir: 0 }, commands: [COMMAND_TYPES.PEN_DOWN, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD, COMMAND_TYPES.DANCE] }
];
