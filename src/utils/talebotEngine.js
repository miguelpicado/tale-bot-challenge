// TaleBot Pro Engine Logic
// Grid layout: rows (0 to numRows-1), cols (0 to numCols-1)
// Orientations: 0 = Up/North (▲), 1 = Right/East (►), 2 = Down/South (▼), 3 = Left/West (◄)

export const DIRECTIONS = [
  { name: 'Norte', dx: 0, dy: -1, angle: 0, arrow: '▲' },
  { name: 'Este', dx: 1, dy: 0, angle: 90, arrow: '►' },
  { name: 'Sur', dx: 0, dy: 1, angle: 180, arrow: '▼' },
  { name: 'Oeste', dx: -1, dy: 0, angle: 270, arrow: '◄' },
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

// Map cell coordinates label format (A1, A2... B1, B2...)
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

// Expand command list handling LOOP commands
export function expandLoopCommands(rawCommands) {
  const expanded = [];
  const historyBeforeLoop = [];

  for (let i = 0; i < rawCommands.length; i++) {
    const cmd = rawCommands[i];
    if (cmd.id === 'LOOP') {
      // Repeat the block of commands preceding the LOOP command
      expanded.push(...historyBeforeLoop);
    } else {
      expanded.push(cmd);
      historyBeforeLoop.push(cmd);
    }
  }

  return expanded;
}

// Execute commands and compute complete trajectory
export function simulatePath(start, rawCommands, numRows = 3, numCols = 4) {
  const commands = expandLoopCommands(rawCommands);

  let currR = start.r;
  let currC = start.c;
  let currDir = start.dir || 0;
  let isPenDown = start.penDown || false;

  const trajectory = [{ r: currR, c: currC, dir: currDir, penDown: isPenDown, step: 0 }];
  const visitedCells = new Set([`${currR},${currC}`]);
  const penLines = [];
  const events = [];
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
            penLines.push({
              from: { r: prevR, c: prevC },
              to: { r: currR, c: currC },
              step: idx + 1
            });
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
            penLines.push({
              from: { r: prevR, c: prevC },
              to: { r: currR, c: currC },
              step: idx + 1
            });
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
      case 'DANCE':
        events.push({ type: 'DANCE', r: currR, c: currC, step: idx + 1 });
        break;
      case 'SOUND':
        events.push({ type: 'SOUND', r: currR, c: currC, step: idx + 1 });
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
    events,
    endPosition: { r: currR, c: currC, dir: currDir },
    isOutOfBounds,
    expandedCommands: commands
  };
}

// Find shortest command path from Start to End avoiding obstacles (BFS)
export function solveNavigationPath(start, end, obstacles = [], numRows = 3, numCols = 4) {
  const obstacleSet = new Set(obstacles.map(o => `${o.r},${o.c}`));
  const queue = [{ r: start.r, c: start.c, dir: start.dir || 0, path: [] }];
  const visited = new Set([`${start.r},${start.c},${start.dir || 0}`]);

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.r === end.r && current.c === end.c) {
      return current.path;
    }

    // Try FORWARD
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

    // Try TURN LEFT
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

    // Try TURN RIGHT
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

// Drawing shapes presets
export const SHAPE_PRESETS = [
  {
    id: 'cuadrado_loop',
    name: 'Cuadrado con Bucle 🔁',
    description: 'Dibuja un cuadrado usando el botón Bucle (Avanzar + Girar Der x4)',
    start: { r: 2, c: 0, dir: 0 },
    commands: [
      COMMAND_TYPES.PEN_DOWN,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.LOOP, // Repeats the 2 forward + turn right block!
      COMMAND_TYPES.DANCE
    ]
  },
  {
    id: 'cuadrado',
    name: 'Cuadrado 🔲',
    description: 'Recorrido en forma de cuadrado (2x2 casillas)',
    start: { r: 2, c: 0, dir: 0 },
    commands: [
      COMMAND_TYPES.PEN_DOWN,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.DANCE
    ]
  },
  {
    id: 'letra_L',
    name: 'Letra L 🇱',
    description: 'Dibuja la letra L mayúscula',
    start: { r: 0, c: 0, dir: 2 },
    commands: [
      COMMAND_TYPES.PEN_DOWN,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_LEFT,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.DANCE
    ]
  },
  {
    id: 'letra_C',
    name: 'Letra C 🇨',
    description: 'Dibuja el contorno de la letra C',
    start: { r: 0, c: 2, dir: 3 },
    commands: [
      COMMAND_TYPES.PEN_DOWN,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_LEFT,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_LEFT,
      COMMAND_TYPES.FORWARD, COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.SOUND
    ]
  },
  {
    id: 'letra_O',
    name: 'Letra O ⭕',
    description: 'Dibuja un círculo/cuadrado cerrado O',
    start: { r: 1, c: 1, dir: 0 },
    commands: [
      COMMAND_TYPES.PEN_DOWN,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.DANCE
    ]
  },
  {
    id: 'zigzag',
    name: 'Zig-Zag ⚡',
    description: 'Patrón serpenteante en zig-zag',
    start: { r: 2, c: 0, dir: 0 },
    commands: [
      COMMAND_TYPES.PEN_DOWN,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_LEFT,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_RIGHT,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.DANCE
    ]
  }
];
