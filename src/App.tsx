/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityLogEntry,
  BusinessLotSummary,
  ConstructionProject,
  FinancialTransaction,
  GameClock,
  GameSpeed,
  IncidentAlert,
  InterCompanySolicitation,
  LotId,
  MeetingSession,
  NPCEntity,
  RoomEntity,
  VehicleEntity
} from './types/game';
import {
  INITIAL_CONSTRUCTION,
  INITIAL_MEETING,
  INITIAL_NPCS,
  INITIAL_ROOMS,
  INITIAL_VEHICLES,
  LOT_CONFIGS
} from './simulation/catalogs';
import {
  calculateBalancesFromTransactions,
  calculateGameTime,
  createInterCompanyTransactions,
  updateConstructionProgress,
  validateAndApplyMeetingProposal
} from './simulation/rules';
import { GameRenderer } from './rendering/renderer';
import { soundEngine } from './audio/synth';
import { TitleScreen } from './components/TitleScreen';
import { TopHUD } from './components/TopHUD';
import { AgentSidebar } from './components/AgentSidebar';
import { ActivityLogDock } from './components/ActivityLogDock';
import { MyDayWidget } from './components/MyDayWidget';
import { CharacterModal } from './components/CharacterModal';
import { RoomCardsView } from './components/RoomCardsView';
import { InspectionDrawer } from './components/InspectionDrawer';
import { ManagementDrawer } from './components/ManagementDrawer';
import { PauseModal } from './components/PauseModal';
import { Plus, Minus, Navigation } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'quatro_lotes_save_v1';

export default function App() {
  // Game Shell State Machine: 'title' | 'playing' | 'paused'
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused'>('title');

  // Canvas and Renderer refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  // Entities stored in refs for 60fps simulation loop without tearing down React
  const roomsRef = useRef<RoomEntity[]>(INITIAL_ROOMS);
  const npcsRef = useRef<NPCEntity[]>(INITIAL_NPCS);
  const vehiclesRef = useRef<VehicleEntity[]>(INITIAL_VEHICLES);
  const constructionRef = useRef<ConstructionProject>(INITIAL_CONSTRUCTION);
  const meetingRef = useRef<MeetingSession>(INITIAL_MEETING);
  const solicitationsRef = useRef<InterCompanySolicitation[]>([
    {
      id: 'sol_01',
      fromLot: 'retail',
      toLot: 'logistics',
      title: 'Frete de Encomendas para Clientes do Comércio',
      description: '45 pacotes consolidados para envio imediato via furgão.',
      value: 1200,
      status: 'in_progress',
      createdAtGameSecond: 0,
      completionPercent: 60
    },
    {
      id: 'sol_02',
      fromLot: 'education',
      toLot: 'retail',
      title: 'Suprimento de Apostilas e Papelaria A4',
      description: '80 resmas e 120 cadernos pautados para o novo semestre.',
      value: 1800,
      status: 'completed',
      createdAtGameSecond: 0,
      completionPercent: 100
    }
  ]);
  const transactionsRef = useRef<FinancialTransaction[]>([
    {
      id: 'tx_init_01',
      timestamp: 0,
      lotId: 'education',
      category: 'tuition',
      description: 'Mensalidades turmas regulares de Informática e Gestão',
      amount: 14200
    },
    {
      id: 'tx_init_02',
      timestamp: 0,
      lotId: 'retail',
      category: 'retail_sale',
      description: 'Vendas balcão e encomendas de materiais de escritório',
      amount: 18500
    },
    {
      id: 'tx_init_03',
      timestamp: 0,
      lotId: 'logistics',
      category: 'freight',
      description: 'Contratos corporativos de armazenagem e distribuição',
      amount: 22000
    },
    {
      id: 'tx_init_04',
      timestamp: 0,
      lotId: 'offices',
      category: 'project_contract',
      description: 'Locação coworking e chamados de infraestrutura de TI',
      amount: 16800
    }
  ]);

  // Live Activity Log stream matching reference
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([
    {
      id: 'log_1',
      timestamp: '07:00:10',
      npcId: 'npc_elisa',
      npcName: 'Elisa',
      lotId: 'offices',
      projectTag: 'app-mobile',
      actionText: 'PR #12 mergeado: Módulo de entregas publicado 🎉',
      iconType: 'check'
    },
    {
      id: 'log_2',
      timestamp: '07:01:25',
      npcId: 'npc_joana',
      npcName: 'Joana',
      lotId: 'logistics',
      projectTag: 'armazenagem-express',
      actionText: 'Manifesto de carga validado para saída do furgão V05',
      iconType: 'box'
    },
    {
      id: 'log_3',
      timestamp: '07:02:40',
      npcId: 'npc_patricia',
      npcName: 'Patrícia',
      lotId: 'retail',
      projectTag: 'loja-virtual',
      actionText: 'Venda balcão registrada no caixa · Cupom fiscal emitido',
      iconType: 'cart'
    },
    {
      id: 'log_4',
      timestamp: '07:03:15',
      npcId: 'npc_camila',
      npcName: 'Camila',
      lotId: 'education',
      projectTag: 'treinamento-dev',
      actionText: 'Laboratório de informática: 12 estações sincronizadas',
      iconType: 'code'
    }
  ]);

  // Game Clock
  const clockRef = useRef<GameClock>({
    gameSeconds: 0,
    speed: 1,
    isPaused: false,
    day: 1,
    dayOfWeek: 'Segunda-feira',
    hour: 7,
    minute: 0,
    timeOfDay: 'morning'
  });

  // UI state synchronized at throttled interval
  const [hudClock, setHudClock] = useState<GameClock>(clockRef.current);
  const [totalCash, setTotalCash] = useState<number>(200000);
  const [cashByLot, setCashByLot] = useState<Record<string, number>>({
    education: 48000,
    logistics: 56000,
    retail: 52000,
    offices: 44000
  });

  // Selected Entity and Modals
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(undefined);
  const [characterModalNpc, setCharacterModalNpc] = useState<NPCEntity | null>(null);
  const [roomCardsOpen, setRoomCardsOpen] = useState(false);
  const [managementDrawerOpen, setManagementDrawerOpen] = useState(false);
  const [managementTab, setManagementTab] = useState<'overview' | 'construction' | 'meetings' | 'solicitations' | 'finances'>('overview');
  const [alerts, setAlerts] = useState<IncidentAlert[]>([
    {
      id: 'alt_01',
      lotId: 'education',
      title: 'Alta Demanda de Informática',
      message: 'Fila de espera de 14 alunos para o laboratório de programação.',
      severity: 'medium',
      createdAt: 0,
      resolved: false
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [followPlayer, setFollowPlayer] = useState(true);

  // Keyboard input tracking
  const keysHeld = useRef<Set<string>>(new Set());

  // Check ?autostart=1 query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState('playing');
      document.body.dataset.state = 'playing';
    } else {
      document.body.dataset.state = 'title';
    }
  }, []);

  // Update body dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Window resize handler for canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && rendererRef.current) {
        rendererRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard controls for WASD, Pause, Mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysHeld.current.add(e.code);

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          clockRef.current.isPaused = !clockRef.current.isPaused;
          setHudClock({ ...clockRef.current });
          soundEngine.playClick();
        }
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (gameState === 'playing') {
          setGameState('paused');
          soundEngine.playClick();
        } else if (gameState === 'paused') {
          setGameState('playing');
          soundEngine.playClick();
        }
      }

      if (e.code === 'KeyM') {
        const muted = soundEngine.toggleMute();
        setIsMuted(muted);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysHeld.current.delete(e.code);
    };

    const handleBlur = () => {
      keysHeld.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState]);

  // Simulation & Render Loop at 60 FPS
  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new GameRenderer(canvasRef.current);
    rendererRef.current.resize(window.innerWidth, window.innerHeight);

    let lastTime = performance.now();
    let animId: number;
    let stepAccumulator = 0;
    let logTimer = 0;

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05);

      if (gameState === 'playing' && !clockRef.current.isPaused && clockRef.current.speed > 0) {
        // Master rule: 1 real second = 10 game seconds * speed
        const gameSecAdvance = dt * 10 * clockRef.current.speed;
        clockRef.current.gameSeconds += gameSecAdvance;

        const timeInfo = calculateGameTime(clockRef.current.gameSeconds);
        clockRef.current.day = timeInfo.day;
        clockRef.current.dayOfWeek = timeInfo.dayOfWeek;
        clockRef.current.hour = timeInfo.hour;
        clockRef.current.minute = timeInfo.minute;
        clockRef.current.timeOfDay = timeInfo.timeOfDay;

        // Player Movement via WASD or Arrow Keys
        const player = npcsRef.current.find((n) => n.id === 'npc_player');
        if (player) {
          const moveSpeed = 6 * dt;
          let dx = 0;
          let dy = 0;

          if (keysHeld.current.has('KeyW') || keysHeld.current.has('ArrowUp')) dy -= moveSpeed;
          if (keysHeld.current.has('KeyS') || keysHeld.current.has('ArrowDown')) dy += moveSpeed;
          if (keysHeld.current.has('KeyA') || keysHeld.current.has('ArrowLeft')) dx -= moveSpeed;
          if (keysHeld.current.has('KeyD') || keysHeld.current.has('ArrowRight')) dx += moveSpeed;

          if (dx !== 0 || dy !== 0) {
            player.x = Math.max(2, Math.min(68, player.x + dx));
            player.y = Math.max(2, Math.min(52, player.y + dy));
            player.state = 'walking';
            if (Math.abs(dx) > Math.abs(dy)) {
              player.direction = dx > 0 ? 'east' : 'west';
            } else {
              player.direction = dy > 0 ? 'south' : 'north';
            }
          } else if (player.state === 'walking') {
            player.state = 'idle';
          }
        }

        // Periodic logic step (every 0.5s)
        stepAccumulator += dt;
        if (stepAccumulator >= 0.5) {
          stepAccumulator = 0;

          // Update construction 7-day progress
          const constProgress = updateConstructionProgress(
            constructionRef.current,
            clockRef.current.day
          );
          constructionRef.current.currentDayOfProject = constProgress.currentDayOfProject;
          constructionRef.current.currentMilestone = constProgress.milestone;
          constructionRef.current.progressPercent = constProgress.progressPercent;
          if (constProgress.isCompleted && constructionRef.current.status !== 'completed') {
            constructionRef.current.status = 'completed';
            soundEngine.playSuccess();
          }

          // Advance inter-company solicitations
          solicitationsRef.current = solicitationsRef.current.map((sol) => {
            if (sol.status === 'in_progress') {
              const newPct = Math.min(100, sol.completionPercent + 5);
              return {
                ...sol,
                completionPercent: newPct,
                status: newPct >= 100 ? 'completed' : 'in_progress'
              };
            }
            return sol;
          });

          // Sync balances
          const balanceCalc = calculateBalancesFromTransactions(200000, transactionsRef.current);
          setTotalCash(balanceCalc.consolidatedCash);
          setCashByLot(balanceCalc.byLot);
          setHudClock({ ...clockRef.current });
        }

        // Live Log generator (every 8 seconds)
        logTimer += dt;
        if (logTimer >= 8) {
          logTimer = 0;
          const randomNpc = npcsRef.current[Math.floor(Math.random() * (npcsRef.current.length - 1)) + 1];
          if (randomNpc) {
            const h = String(clockRef.current.hour).padStart(2, '0');
            const m = String(clockRef.current.minute).padStart(2, '0');
            const s = String(Math.floor(Math.random() * 59)).padStart(2, '0');
            const newLog: ActivityLogEntry = {
              id: `log_${Date.now()}`,
              timestamp: `${h}:${m}:${s}`,
              npcId: randomNpc.id,
              npcName: randomNpc.name,
              lotId: randomNpc.lotId === 'common' ? 'offices' : randomNpc.lotId,
              projectTag: randomNpc.projectTag || 'geral',
              actionText: randomNpc.currentActivityDesc,
              iconType: 'check'
            };
            setActivityLogs((prev) => [newLog, ...prev.slice(0, 19)]);
          }
        }
      }

      // Render Scene
      if (rendererRef.current) {
        rendererRef.current.render({
          rooms: roomsRef.current,
          npcs: npcsRef.current,
          vehicles: vehiclesRef.current,
          construction: constructionRef.current,
          selectedEntityId,
          timeOfDay: clockRef.current.timeOfDay,
          followPlayer
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, selectedEntityId, followPlayer]);

  // Click on Canvas to Select / Inspect or Move Player
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || gameState !== 'playing') return;

    const { gridX, gridY } = rendererRef.current.screenToWorld(e.clientX, e.clientY);

    // 1. Check if clicked an NPC
    const clickedNpc = npcsRef.current.find(
      (n) => Math.abs(n.x - gridX) <= 1 && Math.abs(n.y - gridY) <= 1
    );
    if (clickedNpc) {
      soundEngine.playClick();
      setSelectedEntityId(clickedNpc.id);
      setCharacterModalNpc(clickedNpc);
      return;
    }

    // 2. Check if clicked a Vehicle
    const clickedVehicle = vehiclesRef.current.find(
      (v) => Math.abs(v.x - gridX) <= 2 && Math.abs(v.y - gridY) <= 2
    );
    if (clickedVehicle) {
      soundEngine.playClick();
      setSelectedEntityId(clickedVehicle.id);
      return;
    }

    // 3. Check if clicked the 7-day Construction site
    if (gridX >= 29 && gridX <= 39 && gridY >= 32 && gridY <= 44) {
      soundEngine.playHammer();
      setSelectedEntityId(constructionRef.current.id);
      return;
    }

    // 4. Check if clicked a Room
    const clickedRoom = roomsRef.current.find(
      (r) =>
        gridX >= r.gridX &&
        gridX < r.gridX + r.width &&
        gridY >= r.gridY &&
        gridY < r.gridY + r.height
    );
    if (clickedRoom) {
      soundEngine.playClick();
      setSelectedEntityId(clickedRoom.id);
      return;
    }

    // 5. Otherwise, move player
    const player = npcsRef.current.find((n) => n.id === 'npc_player');
    if (player) {
      player.x = gridX;
      player.y = gridY;
      soundEngine.playFootstep();
    }
    setSelectedEntityId(undefined);
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!rendererRef.current) return;
    rendererRef.current.camera.zoom = Math.max(0.6, Math.min(2.5, rendererRef.current.camera.zoom + delta));
    soundEngine.playClick();
  };

  // Focus on specific lot
  const handleFocusLot = (lotId: LotId) => {
    if (!rendererRef.current) return;
    setFollowPlayer(false);
    const coords: Record<LotId, { x: number; y: number }> = {
      education: { x: 16 * 32, y: 14 * 32 },
      logistics: { x: 52 * 32, y: 14 * 32 },
      retail: { x: 16 * 32, y: 42 * 32 },
      offices: { x: 52 * 32, y: 42 * 32 }
    };
    const c = coords[lotId];
    rendererRef.current.camera.x = c.x;
    rendererRef.current.camera.y = c.y;
    rendererRef.current.camera.zoom = 1.4;
  };

  // Select NPC from sidebar
  const handleSelectNpcFromSidebar = (npcId: string) => {
    const npc = npcsRef.current.find((n) => n.id === npcId);
    if (npc) {
      setSelectedEntityId(npc.id);
      setCharacterModalNpc(npc);
      if (rendererRef.current) {
        setFollowPlayer(false);
        rendererRef.current.camera.x = npc.x * 32;
        rendererRef.current.camera.y = npc.y * 32;
        rendererRef.current.camera.zoom = 1.6;
      }
    }
  };

  // Proposal Approval handler
  const handleApproveProposal = (proposalId: string) => {
    const prop = meetingRef.current.proposals.find((p) => p.id === proposalId);
    if (!prop) return;

    const outcome = validateAndApplyMeetingProposal(
      prop,
      totalCash,
      clockRef.current.gameSeconds
    );
    if (outcome.success && outcome.transaction) {
      prop.status = 'approved';
      transactionsRef.current.unshift(outcome.transaction);
      setTotalCash(outcome.newCash);

      if (prop.actionType === 'hire_staff') {
        const newStaff: NPCEntity = {
          id: `npc_hired_${Date.now()}`,
          name: 'Prof. Gabriel (Contratado)',
          role: 'teacher',
          lotId: 'education',
          projectTag: 'ensino-superior',
          x: 18,
          y: 8,
          direction: 'south',
          state: 'working',
          energy: 95,
          satisfaction: 95,
          salary: 280,
          assignedRoomId: 'room_edu_classroom',
          currentActivityDesc: 'Assumindo nova turma de reforço acadêmico',
          avatarColor: '#d97706',
          hairColor: '#171717',
          shirtColor: '#1e40af',
          speechBubble: { text: 'Iniciando nova turma', icon: '🎓', type: 'work' }
        };
        npcsRef.current.push(newStaff);
      }
      soundEngine.playSuccess();
    }
  };

  // Contract new 7-day construction project
  const handleContractNewConstruction = (name: string, lotId: LotId, cost: number) => {
    if (cost > totalCash) return;
    const downpayment = Math.round(cost * 0.3);

    const newProject: ConstructionProject = {
      id: `bld_${Date.now()}`,
      name,
      lotId,
      targetRoomCategory: lotId === 'education' ? 'computer_lab' : 'loading_dock',
      targetGridX: 30,
      targetGridY: 34,
      targetWidth: 8,
      targetHeight: 9,
      costTotal: cost,
      paidAmount: downpayment,
      startDay: clockRef.current.day,
      plannedDurationDays: 7,
      currentDayOfProject: 1,
      currentMilestone: 'isolation_prep',
      progressPercent: 14,
      status: 'in_progress',
      blockedReason: null,
      assignedWorkers: ['npc_worker_01'],
      materialsDelivered: true
    };

    constructionRef.current = newProject;
    transactionsRef.current.unshift({
      id: `tx_const_${Date.now()}`,
      timestamp: clockRef.current.gameSeconds,
      lotId,
      category: 'construction',
      description: `Entrada (30%) de Obra 7 Dias: ${name}`,
      amount: -downpayment
    });

    const balanceCalc = calculateBalancesFromTransactions(200000, transactionsRef.current);
    setTotalCash(balanceCalc.consolidatedCash);
    soundEngine.playHammer();
  };

  // Create inter-company solicitation
  const handleCreateSolicitation = (from: LotId, to: LotId, title: string, value: number) => {
    const newSol: InterCompanySolicitation = {
      id: `sol_${Date.now()}`,
      fromLot: from,
      toLot: to,
      title,
      description: `Ordem de cooperação entre ${from.toUpperCase()} e ${to.toUpperCase()}`,
      value,
      status: 'in_progress',
      createdAtGameSecond: clockRef.current.gameSeconds,
      completionPercent: 10
    };
    solicitationsRef.current.unshift(newSol);

    const [exp, rev] = createInterCompanyTransactions(
      from,
      to,
      value,
      title,
      clockRef.current.gameSeconds
    );
    transactionsRef.current.unshift(exp, rev);

    const balanceCalc = calculateBalancesFromTransactions(200000, transactionsRef.current);
    setTotalCash(balanceCalc.consolidatedCash);
    setCashByLot(balanceCalc.byLot);
  };

  // Convene meeting
  const handleConveneMeeting = (lotId: LotId) => {
    const managers: Record<LotId, { id: string; name: string; role: string }> = {
      education: { id: 'npc_helena', name: 'Helena', role: 'Diretora Pedagógica' },
      logistics: { id: 'npc_sandra', name: 'Sandra', role: 'Supervisora de Logística' },
      retail: { id: 'npc_renata', name: 'Renata', role: 'Gerente Comercial' },
      offices: { id: 'npc_beatriz', name: 'Beatriz', role: 'Gestora de Projetos' }
    };
    const m = managers[lotId];
    meetingRef.current = {
      ...INITIAL_MEETING,
      id: `meet_${Date.now()}`,
      lotId,
      managerId: m.id,
      managerName: m.name,
      managerRole: `${m.role} (${lotId.toUpperCase()})`,
      status: 'in_session'
    };
    soundEngine.playBell();
  };

  // Save / Load state
  const handleSave = () => {
    const stateData = {
      clock: clockRef.current,
      rooms: roomsRef.current,
      npcs: npcsRef.current,
      vehicles: vehiclesRef.current,
      construction: constructionRef.current,
      transactions: transactionsRef.current,
      solicitations: solicitationsRef.current
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateData));
    soundEngine.playSuccess();
  };

  const handleLoad = () => {
    const dataStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!dataStr) return;
    try {
      const data = JSON.parse(dataStr);
      if (data.clock) clockRef.current = data.clock;
      if (data.rooms) roomsRef.current = data.rooms;
      if (data.npcs) npcsRef.current = data.npcs;
      if (data.vehicles) vehiclesRef.current = data.vehicles;
      if (data.construction) constructionRef.current = data.construction;
      if (data.transactions) transactionsRef.current = data.transactions;
      if (data.solicitations) solicitationsRef.current = data.solicitations;

      const balanceCalc = calculateBalancesFromTransactions(200000, transactionsRef.current);
      setTotalCash(balanceCalc.consolidatedCash);
      setCashByLot(balanceCalc.byLot);
      setHudClock({ ...clockRef.current });
      soundEngine.playSuccess();
    } catch {
      // Ignored
    }
  };

  // Lookups for inspection drawer
  const selectedRoom = roomsRef.current.find((r) => r.id === selectedEntityId);
  const selectedNpc = npcsRef.current.find((n) => n.id === selectedEntityId);
  const selectedVehicle = vehiclesRef.current.find((v) => v.id === selectedEntityId);
  const selectedConstruction = constructionRef.current.id === selectedEntityId ? constructionRef.current : undefined;

  // Summaries of lots
  const lotsSummary: BusinessLotSummary[] = (['education', 'logistics', 'retail', 'offices'] as LotId[]).map((lotId) => {
    const cfg = LOT_CONFIGS[lotId];
    const lotNpcs = npcsRef.current.filter((n) => n.lotId === lotId);
    return {
      lotId,
      name: cfg.name,
      specialty: cfg.tagline,
      cash: cashByLot[lotId] || cfg.baseCash,
      dailyRevenue: lotId === 'education' ? 14200 : lotId === 'retail' ? 18500 : lotId === 'logistics' ? 22000 : 16800,
      dailyExpenses: lotId === 'education' ? 6400 : lotId === 'retail' ? 8200 : lotId === 'logistics' ? 9500 : 7100,
      reputation: lotId === 'education' ? 92 : lotId === 'retail' ? 89 : lotId === 'logistics' ? 91 : 94,
      employeeCount: lotNpcs.length,
      activeContracts: lotId === 'logistics' ? 8 : lotId === 'offices' ? 12 : lotId === 'education' ? 5 : 4
    };
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 1. Canvas Viewport for 2D Pixel Art Simulation */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
      />

      {/* 2. Title Screen Overlay (shown when in 'title' state) */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={() => {
            setGameState('playing');
          }}
        />
      )}

      {/* 3. Playing HUD & Habblaud Style UI */}
      {gameState === 'playing' && (
        <>
          {/* Top Status Bar */}
          <TopHUD
            clock={hudClock}
            cashByLot={cashByLot}
            totalCash={totalCash}
            alerts={alerts}
            isMuted={isMuted}
            agentCount={npcsRef.current.length}
            onSetSpeed={(speed) => {
              clockRef.current.speed = speed;
              clockRef.current.isPaused = speed === 0;
              setHudClock({ ...clockRef.current });
            }}
            onToggleMute={() => {
              const muted = soundEngine.toggleMute();
              setIsMuted(muted);
            }}
            onOpenManagement={(tab) => {
              setManagementTab(tab);
              setManagementDrawerOpen(true);
            }}
            onOpenRoomCards={() => setRoomCardsOpen(true)}
            onFocusLot={handleFocusLot}
          />

          {/* Left: Agent & Project Sidebar (from image_e6cf33b7.png) */}
          <AgentSidebar
            npcs={npcsRef.current}
            selectedNpcId={selectedEntityId}
            onSelectNpc={handleSelectNpcFromSidebar}
          />

          {/* Bottom Left: Meu Dia Widget */}
          <MyDayWidget workingHoursText="2 h 16 min" waitingCount={0} />

          {/* Bottom Center: Live Activity Log Stream */}
          <ActivityLogDock logs={activityLogs} />

          {/* Floating Zoom & Camera Controls */}
          <div className="fixed bottom-4 right-4 z-30 flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg pointer-events-auto">
            <button
              type="button"
              onClick={() => handleZoom(0.2)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Aproximar Câmera"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.2)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Afastar Câmera"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setFollowPlayer(!followPlayer);
                soundEngine.playClick();
              }}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                followPlayer ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={followPlayer ? 'Câmera Seguindo Alex' : 'Câmera Livre'}
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Character Reference Modal (matching uploaded reference sheets) */}
          {characterModalNpc && (
            <CharacterModal
              npc={characterModalNpc}
              onClose={() => setCharacterModalNpc(null)}
              onReassign={(id, act) => {
                const target = npcsRef.current.find((n) => n.id === id);
                if (target) {
                  target.currentActivityDesc = act;
                }
                setCharacterModalNpc(null);
              }}
            />
          )}

          {/* 6-Room Showcase Modal (matching image_4dbac532.png) */}
          {roomCardsOpen && (
            <RoomCardsView
              onClose={() => setRoomCardsOpen(false)}
              onSelectRoom={(roomId) => {
                setRoomCardsOpen(false);
                const rm = roomsRef.current[0];
                if (rm && rendererRef.current) {
                  rendererRef.current.camera.x = rm.gridX * 32 + 80;
                  rendererRef.current.camera.y = rm.gridY * 32 + 80;
                  rendererRef.current.camera.zoom = 1.6;
                }
              }}
            />
          )}

          {/* Quick Inspection Drawer for rooms, vehicles, and construction */}
          {selectedEntityId && !characterModalNpc && (
            <InspectionDrawer
              selectedRoom={selectedRoom}
              selectedVehicle={selectedVehicle}
              selectedConstruction={selectedConstruction}
              onClose={() => setSelectedEntityId(undefined)}
              onCleanRoom={(roomId) => {
                const r = roomsRef.current.find((rm) => rm.id === roomId);
                if (r) r.cleanliness = 100;
              }}
              onMaintainRoom={(roomId) => {
                const r = roomsRef.current.find((rm) => rm.id === roomId);
                if (r) {
                  r.maintenance = 100;
                  r.equipmentStatus = 'optimal';
                }
              }}
              onOrderDelivery={(vehId) => {
                const v = vehiclesRef.current.find((vh) => vh.id === vehId);
                if (v) {
                  v.status = 'in_route';
                  v.destinationDesc = 'Em trânsito com 45 volumes entregues';
                }
              }}
            />
          )}

          {/* Management Drawer (Meetings, 7-Day Construction, DRE, Inter-Lot Services) */}
          {managementDrawerOpen && (
            <ManagementDrawer
              initialTab={managementTab}
              lotsSummary={lotsSummary}
              construction={constructionRef.current}
              meeting={meetingRef.current}
              solicitations={solicitationsRef.current}
              transactions={transactionsRef.current}
              totalCash={totalCash}
              onClose={() => setManagementDrawerOpen(false)}
              onApproveProposal={handleApproveProposal}
              onContractNewConstruction={handleContractNewConstruction}
              onCreateSolicitation={handleCreateSolicitation}
              onConveneMeeting={handleConveneMeeting}
            />
          )}
        </>
      )}

      {/* 4. Pause Modal (when 'paused') */}
      {gameState === 'paused' && (
        <PauseModal
          day={hudClock.day}
          totalCash={totalCash}
          employeeCount={npcsRef.current.length}
          averageSatisfaction={91}
          isMuted={isMuted}
          onResume={() => setGameState('playing')}
          onSave={handleSave}
          onLoad={handleLoad}
          onToggleMute={() => {
            const muted = soundEngine.toggleMute();
            setIsMuted(muted);
          }}
          onExitToTitle={() => setGameState('title')}
        />
      )}
    </div>
  );
}
