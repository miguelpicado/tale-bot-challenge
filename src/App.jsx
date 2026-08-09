import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import GridCanvas from './components/GridCanvas';
import TaleBotController from './components/TaleBotController';
import GeneratorPanel from './components/GeneratorPanel';
import ChallengeEditor from './components/ChallengeEditor';
import PrintSheetPreview from './components/PrintSheetPreview';
import SavedLibraryModal from './components/SavedLibraryModal';
import GoogleDriveModal from './components/GoogleDriveModal';

import { PRESET_CHALLENGES } from './utils/presets';
import { simulatePath, solveNavigationPath, COMMAND_TYPES } from './utils/talebotEngine';
import { saveChallengesToLocal, loadChallengesFromLocal, getSavedGoogleClientId } from './utils/storage';
import { Save, Sparkles, Printer, Wand2 } from 'lucide-react';

export default function App() {
  // Orientation state: 'landscape' (3 rows x 4 cols) or 'portrait' (4 rows x 3 cols)
  const [orientation, setOrientation] = useState('landscape');
  const numRows = orientation === 'landscape' ? 3 : 4;
  const numCols = orientation === 'landscape' ? 4 : 3;

  // Active Slot Editor state (Slot 1 or Slot 2 for the A4 sheet)
  const [activeSlot, setActiveSlot] = useState(1);

  // Challenges for the 2 A4 Slots
  const [challenge1, setChallenge1] = useState(PRESET_CHALLENGES[0]);
  const [challenge2, setChallenge2] = useState(PRESET_CHALLENGES[1]);

  // Current active challenge being edited
  const currentChallenge = activeSlot === 1 ? challenge1 : challenge2;
  const setCurrentChallenge = (updated) => {
    if (activeSlot === 1) setChallenge1(updated);
    else setChallenge2(updated);
  };

  // Saved challenges array in localStorage
  const [savedChallenges, setSavedChallenges] = useState([]);

  // Simulation & Animation playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [robotSimState, setRobotSimState] = useState(null);
  const [activePenLines, setActivePenLines] = useState([]);

  // Modals state
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

  // Save custom challenges to LocalStorage
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

  // Toggle Orientation
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
      obstacles: prev.obstacles.map(adjustPos)
    }));

    setChallenge2(prev => ({
      ...prev,
      numRows: nextRows,
      numCols: nextCols,
      start: adjustPos(prev.start),
      target: adjustPos(prev.target),
      obstacles: prev.obstacles.map(adjustPos)
    }));
  };

  // Cell Popover Contextual Action Handlers
  const handleSetStartPos = (pos) => {
    setCurrentChallenge({
      ...currentChallenge,
      start: pos
    });
  };

  const handleSetTargetPos = (pos) => {
    setCurrentChallenge({
      ...currentChallenge,
      target: pos
    });
  };

  const handleToggleObstacle = (pos) => {
    const existingIdx = (currentChallenge.obstacles || []).findIndex(o => o.r === pos.r && o.c === pos.c);
    let updatedObs = [...(currentChallenge.obstacles || [])];
    if (existingIdx >= 0) {
      updatedObs.splice(existingIdx, 1);
    } else {
      updatedObs.push(pos);
    }
    setCurrentChallenge({
      ...currentChallenge,
      obstacles: updatedObs
    });
  };

  const handleToggleSpecialAction = ({ r, c, type }) => {
    const existingIdx = (currentChallenge.specialActions || []).findIndex(sa => sa.r === r && sa.c === c);
    let updatedSA = [...(currentChallenge.specialActions || [])];
    if (existingIdx >= 0) {
      if (updatedSA[existingIdx].type === type) {
        updatedSA.splice(existingIdx, 1);
      } else {
        updatedSA[existingIdx].type = type;
      }
    } else {
      updatedSA.push({ r, c, type });
    }
    setCurrentChallenge({
      ...currentChallenge,
      specialActions: updatedSA
    });
  };

  const handleClearCell = (r, c) => {
    let updatedObs = (currentChallenge.obstacles || []).filter(o => o.r !== r || o.c !== c);
    let updatedSA = (currentChallenge.specialActions || []).filter(sa => sa.r !== r || sa.c !== c);
    setCurrentChallenge({
      ...currentChallenge,
      obstacles: updatedObs,
      specialActions: updatedSA
    });
  };

  // TaleBot Commands Controller Handlers
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

  // Auto Solve Path using BFS
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
      setCurrentChallenge({
        ...currentChallenge,
        commands: solvedCmds
      });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } else {
      alert('No se encontró un camino válido hasta la meta con los obstáculos actuales.');
    }
  };

  // Live Step-by-step Simulation Player
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

  // Apply Generated Challenge from Generator Panel
  const handleApplyGeneratedChallenge = (genData) => {
    setCurrentChallenge({
      ...currentChallenge,
      ...genData,
      numRows,
      numCols
    });
    setRobotSimState(null);
    setActivePenLines([]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        orientation={orientation}
        onToggleOrientation={handleToggleOrientation}
        onOpenPrintPreview={() => setShowPrintPreview(true)}
        onOpenLibrary={() => setShowLibrary(true)}
        onOpenDriveModal={() => setShowDriveModal(true)}
        onResetChallenge={() => setCurrentChallenge({
          ...PRESET_CHALLENGES[0],
          numRows,
          numCols,
          start: { r: numRows - 1, c: 0, dir: 0 },
          target: { r: 0, c: numCols - 1 },
          obstacles: [],
          specialActions: [],
          commands: []
        })}
        hasGoogleDriveConfigured={!!getSavedGoogleClientId()}
      />

      {/* Main Hero Workspace */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem',
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Central Hero Column: Prominent Grid Map & Controller Dock */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          {/* Prominent Hero Grid Map Canvas */}
          <GridCanvas
            numRows={numRows}
            numCols={numCols}
            themeKey={currentChallenge.theme || 'CLASICO'}
            startPos={currentChallenge.start}
            targetPos={currentChallenge.target}
            obstacles={currentChallenge.obstacles || []}
            specialActions={currentChallenge.specialActions || []}
            currentRobotState={robotSimState}
            penLines={activePenLines}
            onSetStartPos={handleSetStartPos}
            onSetTargetPos={handleSetTargetPos}
            onToggleObstacle={handleToggleObstacle}
            onToggleSpecialAction={handleToggleSpecialAction}
            onClearCell={handleClearCell}
          />

          {/* Physical Controller Docked Directly Below Map */}
          <TaleBotController
            commands={currentChallenge.commands || []}
            onAddCommand={handleAddCommand}
            onRemoveLastCommand={handleRemoveLastCommand}
            onClearCommands={handleClearCommands}
            onRunSimulation={handleRunSimulation}
            onAutoSolvePath={handleAutoSolvePath}
            isPlaying={isPlaying}
            currentStep={currentStep}
            penMarkerActive={currentChallenge.penMarkerMode}
            onTogglePenMarker={() => setCurrentChallenge({
              ...currentChallenge,
              penMarkerMode: !currentChallenge.penMarkerMode
            })}
          />
        </section>

        {/* Right Sidebar: Challenge Details, Generator, & Save */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Challenge Details Editor & A4 Sheet Slot Assign */}
          <ChallengeEditor
            challenge={currentChallenge}
            onChangeChallenge={setCurrentChallenge}
            onAssignToSlot={setActiveSlot}
            currentSlot={activeSlot}
          />

          {/* Automatic Challenge Generator */}
          <GeneratorPanel
            numRows={numRows}
            numCols={numCols}
            onApplyGeneratedChallenge={handleApplyGeneratedChallenge}
          />

          {/* Save to Local Library Button */}
          <button
            onClick={handleSaveToLocalLibrary}
            className="tb-btn tb-btn-purple"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            <Save size={18} /> Guardar Reto en Mi Biblioteca
          </button>
        </aside>
      </main>

      {/* Modals & Overlays */}
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
