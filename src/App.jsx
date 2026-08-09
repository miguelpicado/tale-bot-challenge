import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
import ShapeCatalogDrawer from './components/ShapeCatalogDrawer';

import { PRESET_CHALLENGES } from './utils/presets';
import { simulatePath, solveNavigationPath, COMMAND_TYPES } from './utils/talebotEngine';
import { saveChallengesToLocal, loadChallengesFromLocal, getSavedGoogleClientId } from './utils/storage';

export default function App() {
  // Orientation: 'landscape' (3x4) or 'portrait' (4x3)
  const [orientation, setOrientation] = useState('landscape');
  const numRows = orientation === 'landscape' ? 3 : 4;
  const numCols = orientation === 'landscape' ? 4 : 3;

  // Active A4 Sheet Slot (1 or 2)
  const [activeSlot, setActiveSlot] = useState(1);

  // Challenges for Slot 1 and Slot 2
  const [challenge1, setChallenge1] = useState(PRESET_CHALLENGES[0]);
  const [challenge2, setChallenge2] = useState(PRESET_CHALLENGES[1]);

  const currentChallenge = activeSlot === 1 ? challenge1 : challenge2;
  const setCurrentChallenge = (updated) => {
    if (activeSlot === 1) setChallenge1(updated);
    else setChallenge2(updated);
  };

  // Active Mode Name Badge
  const [activeModeName, setActiveModeName] = useState('Navegación y Obstáculos');
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Saved challenges in LocalStorage
  const [savedChallenges, setSavedChallenges] = useState([]);

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
    alert('¡Reto guardado con éxito en tu biblioteca local!');
  };

  const handleToggleOrientation = () => {
    const nextOrient = orientation === 'landscape' ? 'portrait' : 'landscape';
    setOrientation(nextOrient);

    const nextRows = nextOrient === 'landscape' ? 3 : 4;
    const nextCols = nextOrient === 'landscape' ? 4 : 3;

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

  const handleClearCommands = () => {
    setCurrentChallenge({ ...currentChallenge, commands: [] });
  };

  const handleAutoSolvePath = () => {
    const solvedCmds = solveNavigationPath(
      currentChallenge.start,
      currentChallenge.target,
      currentChallenge.obstacles,
      numRows,
      numCols
    );

    if (solvedCmds) {
      solvedCmds.push(COMMAND_TYPES.DANCE);
      setCurrentChallenge({ ...currentChallenge, commands: solvedCmds });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } else {
      alert('No se encontró un camino válido hasta la meta con los obstáculos actuales.');
    }
  };

  const handleRunSimulation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setRobotSimState(null);
      setActivePenLines([]);
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

    let step = 0;
    const interval = setInterval(() => {
      if (step >= trajectory.length) {
        clearInterval(interval);
        setIsPlaying(false);
        const lastPos = trajectory[trajectory.length - 1];
        if (lastPos.r === currentChallenge.target.r && lastPos.c === currentChallenge.target.c) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        }
        return;
      }

      setRobotSimState(trajectory[step]);
      setCurrentStep(step);
      setActivePenLines(penLines.slice(0, step));
      step++;
    }, 550);
  };

  const handleGenerateA4Pages = (generatedList) => {
    if (generatedList.length >= 2) {
      setChallenge1(generatedList[0]);
      setChallenge2(generatedList[1]);
      setActiveModeName(`Fichas Autogeneradas (${generatedList.length} Retos)`);
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

  return (
    <div style={{ height: '100vh', maxMaxHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Header
        orientation={orientation}
        onToggleOrientation={handleToggleOrientation}
        onOpenNewChallengeModal={() => setShowNewChallengeModal(true)}
        onOpenSavePrintModal={() => setShowSavePrintModal(true)}
        onOpenLibrary={() => setShowLibrary(true)}
        onOpenChallengeEditorModal={() => setShowChallengeEditorModal(true)}
        activeModeName={activeModeName}
      />

      {/* Main Hero Workspace - Fits 16:9 Screen without Vertical Scroll */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '0.8rem 1.5rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.8rem',
        overflow: 'hidden'
      }}>
        {/* Top Split Area: Proportionally sized Map + Wider 500px Sidebar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 500px', // Wider sidebar, proportionally smaller map
          gap: '1.4rem',
          alignItems: 'center',
          width: '100%',
          flex: 1,
          maxHeight: 'calc(100vh - 180px)',
          overflow: 'hidden'
        }}>
          {/* Hero Grid Canvas */}
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <GridCanvas
              numRows={numRows}
              numCols={numCols}
              themeKey={currentChallenge.theme || 'CLASICO'}
              startPos={currentChallenge.start}
              targetPos={currentChallenge.target}
              obstacles={currentChallenge.obstacles || []}
              currentRobotState={robotSimState}
              penLines={activePenLines}
              onSetStartPos={handleSetStartPos}
              onSetTargetPos={handleSetTargetPos}
              onToggleObstacle={handleToggleObstacle}
              onClearCell={handleClearCell}
            />
          </section>

          {/* Right Controller Sidebar (500px wide, fits nicely) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
            <TaleBotController
              commands={currentChallenge.commands || []}
              onAddCommand={handleAddCommand}
              onRemoveLastCommand={handleRemoveLastCommand}
              onClearCommands={handleClearCommands}
              onRunSimulation={handleRunSimulation}
              onAutoSolvePath={handleAutoSolvePath}
              isPlaying={isPlaying}
              penMarkerActive={currentChallenge.penMarkerMode}
              onTogglePenMarker={() => setCurrentChallenge({
                ...currentChallenge,
                penMarkerMode: !currentChallenge.penMarkerMode
              })}
            />

            {isDrawingMode && (
              <ShapeCatalogDrawer onSelectShape={handleSelectShapeFromDrawer} />
            )}
          </aside>
        </div>

        {/* FULL WIDTH Command Sequence Bar aligned under BOTH map and sidebar */}
        <CommandSequenceBar
          commands={currentChallenge.commands || []}
          isPlaying={isPlaying}
          currentStep={currentStep}
        />
      </main>

      {/* Modals */}
      {showNewChallengeModal && (
        <NewChallengeModal
          numRows={numRows}
          numCols={numCols}
          onGenerateA4Pages={handleGenerateA4Pages}
          onOpenShapesMode={() => {
            setIsDrawingMode(true);
            setActiveModeName('Dibujo y Formas para Rotuladores');
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
          challenge1={challenge1}
          challenge2={challenge2}
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
          onClose={() => setShowLibrary(false)}
        />
      )}

      {showDriveModal && (
        <GoogleDriveModal
          challenges={[challenge1, challenge2, ...savedChallenges]}
          onClose={() => setShowDriveModal(false)}
        />
      )}
    </div>
  );
}
