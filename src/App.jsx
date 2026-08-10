import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Check, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import GridCanvas from './components/GridCanvas';
import CommandSequenceBar from './components/CommandSequenceBar';
import TaleBotController from './components/TaleBotController';
import ChallengeEditorModal from './components/ChallengeEditorModal';
import PrintSheetPreview from './components/PrintSheetPreview';
import SavedLibraryModal from './components/SavedLibraryModal';
import GoogleDriveModal from './components/GoogleDriveModal';
import NewChallengeModal from './components/NewChallengeModal';
import SavePrintModal from './components/SavePrintModal';
import ChallengeSidebarPanel from './components/ChallengeSidebarPanel';
import ShapeCatalogModal from './components/ShapeCatalogModal';

import { PRESET_CHALLENGES } from './utils/presets';
import { simulatePath, solveNavigationPath, durationOf, COMMAND_TYPES } from './utils/talebotEngine';
import { saveChallengesToLocal, loadChallengesFromLocal } from './utils/storage';

export default function App() {
  // Aviso flotante: reemplaza los alert() del navegador
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const notify = (message, tone = 'ok') => {
    setToast({ message, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Orientation: 'landscape' (4x5) or 'portrait' (5x4)
  const [orientation, setOrientation] = useState('landscape');
  const numRows = orientation === 'landscape' ? 4 : 5;
  const numCols = orientation === 'landscape' ? 5 : 4;

  // Active A4 Sheet Slot (1 or 2) and Page Index
  const [activeSlot, setActiveSlot] = useState(1);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Challenges for Slot 1 and Slot 2
  const [challenge1, setChallenge1] = useState(PRESET_CHALLENGES[0]);
  const [challenge2, setChallenge2] = useState(PRESET_CHALLENGES[1]);
  const [generatedChallengesList, setGeneratedChallengesList] = useState([]);

  const totalPageCount = (generatedChallengesList && generatedChallengesList.length > 0)
    ? Math.max(1, Math.ceil(generatedChallengesList.length / 2))
    : 1;

  const activeChallengeIndex = activePageIndex * 2 + (activeSlot - 1);
  const currentChallenge = (generatedChallengesList && generatedChallengesList.length > 0 && generatedChallengesList[activeChallengeIndex])
    ? generatedChallengesList[activeChallengeIndex]
    : (activeSlot === 1 ? challenge1 : challenge2);

  const setCurrentChallenge = (updated) => {
    if (generatedChallengesList && generatedChallengesList.length > 0) {
      const listCopy = [...generatedChallengesList];
      const targetIdx = activePageIndex * 2 + (activeSlot - 1);
      listCopy[targetIdx] = updated;
      setGeneratedChallengesList(listCopy);
      if (activePageIndex === 0) {
        if (activeSlot === 1) setChallenge1(updated);
        else setChallenge2(updated);
      }
    } else {
      if (activeSlot === 1) setChallenge1(updated);
      else setChallenge2(updated);
    }
  };

  // Ancho real del tablero: lo publica GridCanvas ya medido y con él ajustamos
  // la columna, de forma que la sidebar quede pegada al mapa
  const [boardWidth, setBoardWidth] = useState(null);

  // Active Mode Name Badge
  const [activeModeName, setActiveModeName] = useState('Navegación con obstáculos');

  // Saved challenges in LocalStorage
  const [savedChallenges, setSavedChallenges] = useState([]);

  // Rotuladores de las ruedas (Izquierdo y Derecho)
  const [leftPenEnabled, setLeftPenEnabled] = useState(true);
  const [leftPenColor, setLeftPenColor] = useState('#6D4C41'); // Marrón por defecto
  const [rightPenEnabled, setRightPenEnabled] = useState(true);
  const [rightPenColor, setRightPenColor] = useState('#2E7D32'); // Verde por defecto

  // Live simulation playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [robotSimState, setRobotSimState] = useState(null);
  const [activePenLines, setActivePenLines] = useState([]);

  // Modals state
  const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
  const [showSavePrintModal, setShowSavePrintModal] = useState(false);
  const [showChallengeEditorModal, setShowChallengeEditorModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showShapeCatalogModal, setShowShapeCatalogModal] = useState(false);

  // Load saved challenges from LocalStorage on mount
  useEffect(() => {
    const loaded = loadChallengesFromLocal();
    if (loaded && Array.isArray(loaded)) {
      setSavedChallenges(loaded);
    }
  }, []);

  const handleSaveToLocalLibrary = () => {
    const newChallenge = {
      ...currentChallenge,
      id: `custom_${Date.now()}`
    };
    const updatedList = [newChallenge, ...savedChallenges];
    setSavedChallenges(updatedList);
    saveChallengesToLocal(updatedList);
    notify('Reto guardado en tu biblioteca.');
  };

  const handleToggleOrientation = () => {
    const nextOrient = orientation === 'landscape' ? 'portrait' : 'landscape';
    setOrientation(nextOrient);

    const nextRows = nextOrient === 'landscape' ? 4 : 5;
    const nextCols = nextOrient === 'landscape' ? 5 : 4;

    const adjustPos = (pos) => ({
      r: Math.min(pos.r, nextRows - 1),
      c: Math.min(pos.c, nextCols - 1),
      dir: pos.dir || 0
    });

    setChallenge1(prev => ({
      ...prev,
      numRows: nextRows,
      numCols: nextCols,
      start: adjustPos(prev.start),
      target: adjustPos(prev.target),
      obstacles: (prev.obstacles || []).map(adjustPos)
    }));

    setChallenge2(prev => ({
      ...prev,
      numRows: nextRows,
      numCols: nextCols,
      start: adjustPos(prev.start),
      target: adjustPos(prev.target),
      obstacles: (prev.obstacles || []).map(adjustPos)
    }));
  };

  // Popover cell action handlers
  const handleSetStartPos = (pos) => {
    setCurrentChallenge({ ...currentChallenge, start: pos });
  };

  const handleSetTargetPos = (pos) => {
    setCurrentChallenge({ ...currentChallenge, target: pos });
  };

  const handleToggleObstacle = ({ r, c, type }) => {
    const existingIdx = (currentChallenge.obstacles || []).findIndex(o => o.r === r && o.c === c);
    let updatedObs = [...(currentChallenge.obstacles || [])];
    if (existingIdx >= 0) {
      if (updatedObs[existingIdx].type === type) {
        updatedObs.splice(existingIdx, 1);
      } else {
        updatedObs[existingIdx].type = type;
      }
    } else {
      updatedObs.push({ r, c, type: type || 'ALTO' });
    }
    setCurrentChallenge({ ...currentChallenge, obstacles: updatedObs });
  };

  const handleClearCell = (r, c) => {
    let updatedObs = (currentChallenge.obstacles || []).filter(o => o.r !== r || o.c !== c);
    setCurrentChallenge({ ...currentChallenge, obstacles: updatedObs });
  };

  // Controller command handlers
  const handleAddCommand = (cmdType) => {
    setCurrentChallenge({
      ...currentChallenge,
      commands: [...(currentChallenge.commands || []), cmdType]
    });
  };

  const handleRemoveLastCommand = () => {
    const cmds = [...(currentChallenge.commands || [])];
    cmds.pop();
    setCurrentChallenge({ ...currentChallenge, commands: cmds });
  };

  // Borrar es un reset completo: se va la secuencia, el trazo y el robot vuelve
  // a la casilla de salida
  const handleClearCommands = () => {
    stopSimulation();
    setCurrentChallenge({ ...currentChallenge, commands: [] });
  };

  const handleAutoSolvePath = () => {
    const { start, target, obstacles } = currentChallenge;

    // La meta encima de la salida no tiene recorrido que resolver: el BFS
    // devuelve [], que es truthy, y antes se daba por resuelto sin generar nada.
    if (start.r === target.r && start.c === target.c) {
      notify('La meta está en la casilla de salida. Colócala en otra casilla.', 'warn');
      return;
    }

    const solvedCmds = solveNavigationPath(start, target, obstacles, numRows, numCols);

    if (!solvedCmds || solvedCmds.length === 0) {
      notify('No hay camino hasta la meta. Quita algún obstáculo o mueve la salida.', 'warn');
      return;
    }

    solvedCmds.push(COMMAND_TYPES.DANCE);
    setCurrentChallenge({ ...currentChallenge, commands: solvedCmds });
    notify(`Recorrido resuelto en ${solvedCmds.length - 1} pasos.`);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  const playTimer = useRef(null);

  const stopSimulation = () => {
    clearTimeout(playTimer.current);
    playTimer.current = null;
    setIsPlaying(false);
    setRobotSimState(null);
    setActivePenLines([]);
    setCurrentStep(0);
  };

  useEffect(() => () => clearTimeout(playTimer.current), []);

  const handleRunSimulation = () => {
    if (isPlaying) {
      stopSimulation();
      return;
    }

    const { trajectory, penLines } = simulatePath(
      currentChallenge.start,
      currentChallenge.commands || [],
      numRows,
      numCols
    );

    setIsPlaying(true);
    setCurrentStep(0);
    setActivePenLines([]);

    // Cada comando dura lo suyo: avanzar cunde, girar es corto, bailar ocupa
    // un compás. El robot recibe su duración para animar con la misma cadencia.
    const advance = (step) => {
      if (step >= trajectory.length) {
        const lastPos = trajectory[trajectory.length - 1];
        if (lastPos && lastPos.r === currentChallenge.target.r && lastPos.c === currentChallenge.target.c) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        }

        // El baile/paso final dura 2 segundos (2000ms), luego vuelve al inicio
        playTimer.current = setTimeout(() => {
          playTimer.current = null;
          setIsPlaying(false);
          setRobotSimState(null); // Vuelve al inicio (startPos)
          setCurrentStep(0);
        }, 2000);
        return;
      }

      const frame = trajectory[step];
      const ms = durationOf(frame.commandId);

      setRobotSimState({ ...frame, stepMs: ms });
      setCurrentStep(step);
      setActivePenLines(penLines.filter(l => l.step <= step));

      playTimer.current = setTimeout(() => advance(step + 1), ms);
    };

    advance(0);
  };

  const handleGenerateA4Pages = (generatedList) => {
    if (generatedList.length >= 2) {
      setGeneratedChallengesList(generatedList);
      setActivePageIndex(0);
      setActiveSlot(1);
      setChallenge1(generatedList[0]);
      setChallenge2(generatedList[1]);
      setActiveModeName(`Fichas generadas · ${generatedList.length} retos`);
      setShowPrintPreview(true);
    }
  };

  const handleSelectShapeFromDrawer = (shape) => {
    setCurrentChallenge({
      ...currentChallenge,
      title: `Forma: ${shape.name}`,
      story: shape.description,
      start: shape.start,
      target: shape.start,
      obstacles: [],
      commands: shape.commands,
      penMarkerMode: true
    });
  };

  const displayPenLines = isPlaying
    ? activePenLines
    : (currentChallenge.penMarkerMode || (currentChallenge.commands && currentChallenge.commands.some(c => c.id === 'PEN_DOWN')))
      ? simulatePath(
          currentChallenge.start || { r: numRows - 1, c: 0, dir: 0 },
          currentChallenge.commands || [],
          numRows,
          numCols
        ).penLines
      : [];

  return (
    <div className="app">
      <Header
        orientation={orientation}
        onToggleOrientation={handleToggleOrientation}
        themeKey={currentChallenge.theme || 'CLASICO'}
        onChangeTheme={(thm) => setCurrentChallenge({ ...currentChallenge, theme: thm })}
        onOpenNewChallengeModal={() => setShowNewChallengeModal(true)}
        onOpenSavePrintModal={() => setShowSavePrintModal(true)}
        onOpenLibrary={() => setShowLibrary(true)}
        activeModeName={activeModeName}
      />

      <main className="work no-print">
        <div className="workspace">
          <div className="workspace__main" style={boardWidth ? { width: boardWidth } : undefined}>
            <section className="workspace__stage">
              <GridCanvas
                numRows={numRows}
                numCols={numCols}
                themeKey={currentChallenge.theme || 'CLASICO'}
                startPos={currentChallenge.start}
                targetPos={currentChallenge.target}
                obstacles={currentChallenge.obstacles || []}
                currentRobotState={robotSimState}
                penLines={displayPenLines}
                leftPenEnabled={leftPenEnabled}
                leftPenColor={leftPenColor}
                rightPenEnabled={rightPenEnabled}
                rightPenColor={rightPenColor}
                onSetStartPos={handleSetStartPos}
                onSetTargetPos={handleSetTargetPos}
                onToggleObstacle={handleToggleObstacle}
                onClearCell={handleClearCell}
                onBoardWidth={setBoardWidth}
              />
            </section>

            <CommandSequenceBar
              commands={currentChallenge.commands || []}
              isPlaying={isPlaying}
              currentStep={currentStep}
            />
          </div>

          <aside className="rail">
            {/* Mando arriba */}
            <TaleBotController
              commands={currentChallenge.commands || []}
              onAddCommand={handleAddCommand}
              onRemoveLastCommand={handleRemoveLastCommand}
              onClearCommands={handleClearCommands}
              onRunSimulation={handleRunSimulation}
              onAutoSolvePath={handleAutoSolvePath}
              isPlaying={isPlaying}
            />

            {/* Ficha abajo */}
            <ChallengeSidebarPanel
              currentSlot={activeSlot}
              onAssignToSlot={setActiveSlot}
              pageIndex={activePageIndex}
              totalPages={totalPageCount}
              onPageChange={setActivePageIndex}
              challenge={currentChallenge}
              onChangeChallenge={setCurrentChallenge}
              onOpenShapesModal={() => setShowShapeCatalogModal(true)}
              leftPenEnabled={leftPenEnabled}
              onToggleLeftPen={setLeftPenEnabled}
              leftPenColor={leftPenColor}
              onChangeLeftPenColor={setLeftPenColor}
              rightPenEnabled={rightPenEnabled}
              onToggleRightPen={setRightPenEnabled}
              rightPenColor={rightPenColor}
              onChangeRightPenColor={setRightPenColor}
            />
          </aside>
        </div>
      </main>

      {toast && (
        <div className={`toast${toast.tone === 'warn' ? ' toast--warn' : ''}`} role="status">
          {toast.tone === 'warn' ? <AlertTriangle size={16} /> : <Check size={16} />}
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {showNewChallengeModal && (
        <NewChallengeModal
          numRows={numRows}
          numCols={numCols}
          onGenerateA4Pages={handleGenerateA4Pages}
          onOpenShapesMode={() => {
            setShowShapeCatalogModal(true);
            setActiveModeName('Dibujo con rotulador');
          }}
          onClose={() => setShowNewChallengeModal(false)}
        />
      )}

      {showChallengeEditorModal && (
        <ChallengeEditorModal
          challenge={currentChallenge}
          onChangeChallenge={setCurrentChallenge}
          onAssignToSlot={setActiveSlot}
          currentSlot={activeSlot}
          onClose={() => setShowChallengeEditorModal(false)}
        />
      )}

      {showSavePrintModal && (
        <SavePrintModal
          onSaveLocal={handleSaveToLocalLibrary}
          onOpenDrive={() => setShowDriveModal(true)}
          onOpenPrint={() => setShowPrintPreview(true)}
          onClose={() => setShowSavePrintModal(false)}
        />
      )}

      {showPrintPreview && (
        <PrintSheetPreview
          challengesList={generatedChallengesList}
          challenge1={challenge1}
          challenge2={challenge2}
          leftPenEnabled={leftPenEnabled}
          leftPenColor={leftPenColor}
          rightPenEnabled={rightPenEnabled}
          rightPenColor={rightPenColor}
          onClose={() => setShowPrintPreview(false)}
        />
      )}

      {showLibrary && (
        <SavedLibraryModal
          savedChallenges={savedChallenges}
          onLoadChallenge={(ch) => {
            setCurrentChallenge(ch);
            setShowLibrary(false);
          }}
          onDeleteChallenge={(id) => {
            const updated = savedChallenges.filter(c => c.id !== id);
            setSavedChallenges(updated);
            saveChallengesToLocal(updated);
          }}
          onImportChallenges={(imported) => {
            const merged = [...imported, ...savedChallenges];
            setSavedChallenges(merged);
            saveChallengesToLocal(merged);
          }}
          onNotify={notify}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {showDriveModal && (
        <GoogleDriveModal
          challenges={[challenge1, challenge2, ...savedChallenges]}
          onClose={() => setShowDriveModal(false)}
        />
      )}

      {showShapeCatalogModal && (
        <ShapeCatalogModal
          onSelectShape={handleSelectShapeFromDrawer}
          onGenerateShapePages={handleGenerateA4Pages}
          onClose={() => setShowShapeCatalogModal(false)}
        />
      )}
    </div>
  );
}
