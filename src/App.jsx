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
import { Flag, Star, OctagonAlert, RotateCw, Save, Sparkles, Wand2 } from 'lucide-react';

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

  // Active Interactive Map Placement Tool: 'SELECT', 'START', 'TARGET', 'OBSTACLE'
  const [activeTool, setActiveTool] = useState('SELECT');

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

  // Save custom challenges to LocalStorage when updated
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

    // Adjust grid coordinates to stay inside bounds
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

  // Grid Canvas Cell Click Handler (Based on active painting tool)
  const handleCellClick = (r, c) => {
    if (activeTool === 'START') {
      setCurrentChallenge({
        ...currentChallenge,
        start: { r, c, dir: currentChallenge.start.dir || 0 }
      });
    } else if (activeTool === 'TARGET') {
      setCurrentChallenge({
        ...currentChallenge,
        target: { r, c }
      });
    } else if (activeTool === 'OBSTACLE') {
      const existingIdx = currentChallenge.obstacles.findIndex(o => o.r === r && o.c === c);
      let updatedObs = [...currentChallenge.obstacles];
      if (existingIdx >= 0) {
        updatedObs.splice(existingIdx, 1);
      } else {
        updatedObs.push({ r, c });
      }
      setCurrentChallenge({
        ...currentChallenge,
        obstacles: updatedObs
      });
    }
  };

  // Rotate Robot Start Facing Angle (0° Up -> 90° Right -> 180° Down -> 270° Left)
  const handleRotateRobotStart = () => {
    const nextDir = ((currentChallenge.start.dir || 0) + 1) % 4;
    setCurrentChallenge({
      ...currentChallenge,
      start: { ...currentChallenge.start, dir: nextDir }
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
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
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
        // Trigger celebration confetti if reached target
        const lastPos = trajectory[trajectory.length - 1];
        if (lastPos.r === currentChallenge.target.r && lastPos.c === currentChallenge.target.c) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        return;
      }

      setRobotSimState(trajectory[step]);
      setCurrentStep(step);
      setActivePenLines(penLines.slice(0, step));
      step++;
    }, 600);
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
      {/* Navigation Bar Header */}
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
          commands: []
        })}
        hasGoogleDriveConfigured={!!getSavedGoogleClientId()}
      />

      {/* Main App Workspace */}
      <main style={{
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem',
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 450px) 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Interactive Map Grid Canvas & Controls */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Active Painter Tools Selector */}
          <div className="tb-card" style={{ padding: '0.8rem 1.2rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem' }}>
              🎨 Herramienta de Edición del Mapa:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTool('SELECT')}
                className="tb-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  background: activeTool === 'SELECT' ? '#00A3FF' : '#F1F5F9',
                  color: activeTool === 'SELECT' ? 'white' : '#64748B'
                }}
              >
                👁️ Seleccionar
              </button>

              <button
                onClick={() => setActiveTool('START')}
                className="tb-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  background: activeTool === 'START' ? '#FFC700' : '#F1F5F9',
                  color: activeTool === 'START' ? '#0F172A' : '#64748B'
                }}
              >
                <Flag size={14} /> Poner Inicio 🤖
              </button>

              <button
                onClick={() => setActiveTool('TARGET')}
                className="tb-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  background: activeTool === 'TARGET' ? '#10B981' : '#F1F5F9',
                  color: activeTool === 'TARGET' ? 'white' : '#64748B'
                }}
              >
                <Star size={14} /> Poner Meta ⭐️
              </button>

              <button
                onClick={() => setActiveTool('OBSTACLE')}
                className="tb-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  background: activeTool === 'OBSTACLE' ? '#F43F5E' : '#F1F5F9',
                  color: activeTool === 'OBSTACLE' ? 'white' : '#64748B'
                }}
              >
                <OctagonAlert size={14} /> Obstáculo 🛑
              </button>
            </div>
          </div>

          {/* Grid Canvas Map */}
          <GridCanvas
            numRows={numRows}
            numCols={numCols}
            themeKey={currentChallenge.theme || 'CLASICO'}
            startPos={currentChallenge.start}
            targetPos={currentChallenge.target}
            obstacles={currentChallenge.obstacles || []}
            currentRobotState={robotSimState}
            penLines={activePenLines}
            activeTool={activeTool}
            onCellClick={handleCellClick}
            onRotateRobotStart={handleRotateRobotStart}
          />

          {/* Challenge Details Editor */}
          <ChallengeEditor
            challenge={currentChallenge}
            onChangeChallenge={setCurrentChallenge}
            onAssignToSlot={setActiveSlot}
            currentSlot={activeSlot}
          />

          {/* Save to Local Library Button */}
          <button
            onClick={handleSaveToLocalLibrary}
            className="tb-btn tb-btn-purple"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            <Save size={18} /> Guardar este Reto en Mi Biblioteca
          </button>
        </section>

        {/* Right Column: TaleBot Controller & Generator Panels */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Virtual TaleBot Hardware Controller */}
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

          {/* Automatic Challenge Generator */}
          <GeneratorPanel
            numRows={numRows}
            numCols={numCols}
            onApplyGeneratedChallenge={handleApplyGeneratedChallenge}
          />
        </section>
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
