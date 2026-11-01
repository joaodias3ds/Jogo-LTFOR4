/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConstructionProject, NPCEntity, RoomEntity, TimeOfDay, VehicleEntity } from '../types/game';

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export class GameRenderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public camera: Camera = { x: 35 * 32, y: 28 * 32, zoom: 1.25 };
  public tileSize: number = 32;
  private animFrame: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not get 2D canvas context');
    this.ctx = ctx;
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public screenToWorld(clientX: number, clientY: number): { gridX: number; gridY: number; worldX: number; worldY: number } {
    const rect = this.canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const worldX = (sx - centerX) / this.camera.zoom + this.camera.x;
    const worldY = (sy - centerY) / this.camera.zoom + this.camera.y;

    const gridX = Math.floor(worldX / this.tileSize);
    const gridY = Math.floor(worldY / this.tileSize);

    return { gridX, gridY, worldX, worldY };
  }

  public render(params: {
    rooms: RoomEntity[];
    npcs: NPCEntity[];
    vehicles: VehicleEntity[];
    construction: ConstructionProject;
    selectedEntityId?: string;
    timeOfDay: TimeOfDay;
    followPlayer: boolean;
  }) {
    const { rooms, npcs, vehicles, construction, selectedEntityId, timeOfDay, followPlayer } = params;
    const ctx = this.ctx;
    this.animFrame++;

    // Follow player smoothly if enabled
    if (followPlayer) {
      const player = npcs.find((n) => n.id === 'npc_player');
      if (player) {
        const targetX = player.x * this.tileSize + 16;
        const targetY = player.y * this.tileSize + 16;
        this.camera.x += (targetX - this.camera.x) * 0.1;
        this.camera.y += (targetY - this.camera.y) * 0.1;
      }
    }

    ctx.imageSmoothingEnabled = false;

    // Clear background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Apply camera transformation
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Draw Ground Terrain & Roads
    this.drawTerrain();

    // 2. Draw 4 Lots Outer Borders & Labels
    this.drawLotBoundaries();

    // 3. Draw Central Plaza & Landscaping
    this.drawPlazaAndPaths();

    // 4. Draw 7-Day Construction Site
    this.drawConstructionSite(construction, selectedEntityId === construction.id);

    // 5. Draw Rooms with Furnishings & Open Cutaway Interiors
    for (const room of rooms) {
      const isSelected = selectedEntityId === room.id;
      this.drawRoom(room, isSelected);
    }

    // 6. Draw Vehicles
    for (const veh of vehicles) {
      const isSelected = selectedEntityId === veh.id;
      this.drawVehicle(veh, isSelected);
    }

    // 7. Draw NPCs (sorted by Y for correct visual layering)
    const sortedNpcs = [...npcs].sort((a, b) => a.y - b.y);
    for (const npc of sortedNpcs) {
      const isSelected = selectedEntityId === npc.id;
      this.drawNPC(npc, isSelected);
    }

    // 8. Draw Speech / Activity Bubbles over NPCs (matching reference image)
    for (const npc of sortedNpcs) {
      if (npc.speechBubble) {
        this.drawSpeechBubble(npc);
      }
    }

    ctx.restore();

    // 9. Day/Night Light Overlay
    this.drawTimeOfDayLighting(timeOfDay);
  }

  private drawTerrain() {
    const ctx = this.ctx;
    const mapWidth = 72 * this.tileSize;
    const mapHeight = 56 * this.tileSize;

    // Grass perimeter with lush forest tone (like in Habblaud reference)
    ctx.fillStyle = '#416b38';
    ctx.fillRect(-96, -96, mapWidth + 192, mapHeight + 192);

    // Pine trees scattered along perimeter
    const pinePositions = [
      { x: -32, y: 100 }, { x: -32, y: 300 }, { x: -32, y: 600 },
      { x: mapWidth + 32, y: 120 }, { x: mapWidth + 32, y: 340 }, { x: mapWidth + 32, y: 580 },
      { x: 200, y: -48 }, { x: 500, y: -48 }, { x: 900, y: -48 }, { x: 1400, y: -48 }
    ];
    for (const p of pinePositions) {
      ctx.fillStyle = '#244520';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 16, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2d5a27';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 24);
      ctx.lineTo(p.x - 14, p.y + 12);
      ctx.lineTo(p.x + 14, p.y + 12);
      ctx.closePath();
      ctx.fill();
    }

    // Modern clean exterior pavement around complex
    ctx.fillStyle = '#576574';
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    // Sidewalks / Pavers
    ctx.fillStyle = '#718093';
    ctx.fillRect(28 * this.tileSize, 0, 12 * this.tileSize, mapHeight);
    ctx.fillRect(0, 26 * this.tileSize, mapWidth, 7 * this.tileSize);

    // Bottom main street (matching Habblaud road at bottom)
    const roadY = 51 * this.tileSize;
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(0, roadY, mapWidth, 5 * this.tileSize);

    // Road dashed line
    ctx.strokeStyle = '#f1f2f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(0, roadY + 2.5 * this.tileSize);
    ctx.lineTo(mapWidth, roadY + 2.5 * this.tileSize);
    ctx.stroke();
    ctx.setLineDash([]);

    // Streetlamp posts with warm lighting
    const lampPositions = [
      { x: 12 * this.tileSize, y: roadY - 8 },
      { x: 24 * this.tileSize, y: roadY - 8 },
      { x: 36 * this.tileSize, y: roadY - 8 },
      { x: 48 * this.tileSize, y: roadY - 8 },
      { x: 60 * this.tileSize, y: roadY - 8 }
    ];
    for (const lamp of lampPositions) {
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(lamp.x, lamp.y - 20, 3, 20);
      ctx.fillStyle = '#f6b93b';
      ctx.beginPath();
      ctx.arc(lamp.x + 1.5, lamp.y - 20, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawLotBoundaries() {
    const ctx = this.ctx;
    const ts = this.tileSize;

    const lots = [
      { id: 'education', name: 'LOTE 1 — EDUCAÇÃO', color: '#2563eb', x: 4, y: 4, w: 24, h: 22 },
      { id: 'logistics', name: 'LOTE 2 — LOGÍSTICA', color: '#d97706', x: 40, y: 4, w: 27, h: 22 },
      { id: 'retail', name: 'LOTE 3 — COMÉRCIO', color: '#059669', x: 4, y: 32, w: 24, h: 18 },
      { id: 'offices', name: 'LOTE 4 — ESCRITÓRIOS', color: '#7c3aed', x: 40, y: 32, w: 27, h: 18 }
    ];

    for (const lot of lots) {
      const px = lot.x * ts;
      const py = lot.y * ts;
      const pw = lot.w * ts;
      const ph = lot.h * ts;

      // Plot border
      ctx.strokeStyle = lot.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(px - 4, py - 4, pw + 8, ph + 8);

      // Plot label banner
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py - 20, 180, 18);
      ctx.fillStyle = lot.color;
      ctx.fillRect(px, py - 20, 4, 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText(lot.name, px + 10, py - 7);
    }
  }

  private drawPlazaAndPaths() {
    const ctx = this.ctx;
    const ts = this.tileSize;

    // Central Square
    const px = 29 * ts;
    const py = 21 * ts;
    const pw = 10 * ts;
    const ph = 8 * ts;

    // Decorated stone pavers
    ctx.fillStyle = '#dcdde1';
    ctx.fillRect(px, py, pw, ph);

    // Inner garden with lush grass
    ctx.fillStyle = '#44bd32';
    ctx.fillRect(px + 16, py + 16, pw - 32, ph - 32);

    // Central fountain / monument
    const cx = px + pw / 2;
    const cy = py + ph / 2;
    ctx.fillStyle = '#00a8ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f5f6fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wooden park benches
    const benchPositions = [
      { x: px + 24, y: py + 20 },
      { x: px + pw - 48, y: py + 20 },
      { x: px + 24, y: py + ph - 30 },
      { x: px + pw - 48, y: py + ph - 30 }
    ];
    for (const b of benchPositions) {
      ctx.fillStyle = '#e58e26';
      ctx.fillRect(b.x, b.y, 24, 8);
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(b.x + 2, b.y + 8, 3, 4);
      ctx.fillRect(b.x + 19, b.y + 8, 3, 4);
    }
  }

  private drawConstructionSite(project: ConstructionProject, isSelected: boolean) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    const cx = 29 * ts;
    const cy = 32 * ts;
    const cw = 10 * ts;
    const ch = 11 * ts;

    // Earth ground
    ctx.fillStyle = '#875a34';
    ctx.fillRect(cx, cy, cw, ch);

    // Hazard fence
    ctx.strokeStyle = isSelected ? '#38bdf8' : '#eab308';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(cx, cy, cw, ch);

    // Construction banner
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx + 6, cy + 6, 170, 38);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('CANTEIRO DE OBRAS (7 DIAS)', cx + 12, cy + 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px system-ui';
    ctx.fillText(`Dia ${project.currentDayOfProject}/7 · ${project.progressPercent}% Concluído`, cx + 12, cy + 28);
    ctx.fillText(`Fase: ${project.currentMilestone}`, cx + 12, cy + 38);

    // Materials
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(cx + 16, cy + 50, 22, 14);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx + 46, cy + 52, 24, 12);

    // Scaffold
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx + 90, cy + 50, 50, 50);

    // Cones
    const cones = [{ x: cx + 12, y: cy + cw - 18 }, { x: cx + 45, y: cy + cw - 18 }, { x: cx + 80, y: cy + cw - 18 }];
    for (const c of cones) {
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + 10);
      ctx.lineTo(c.x + 5, c.y);
      ctx.lineTo(c.x + 10, c.y + 10);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawRoom(room: RoomEntity, isSelected: boolean) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    const rx = room.gridX * ts;
    const ry = room.gridY * ts;
    const rw = room.width * ts;
    const rh = room.height * ts;

    // Floor Color (matching Habblaud bright clean pixel tiles)
    let floorColor = '#f5f6fa';
    if (room.lotId === 'education') floorColor = '#fdfbf7'; // subtle academic cream
    else if (room.lotId === 'logistics') floorColor = '#dcdde1'; // logistics concrete
    else if (room.lotId === 'retail') floorColor = '#f8f9fa'; // retail bright tiles
    else if (room.lotId === 'offices') floorColor = '#f1f2f6'; // modern office light gray

    ctx.fillStyle = floorColor;
    ctx.fillRect(rx, ry, rw, rh);

    // Tile grid lines (subtle crisp lines)
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let x = rx; x < rx + rw; x += ts) {
      ctx.beginPath();
      ctx.moveTo(x, ry);
      ctx.lineTo(x, ry + rh);
      ctx.stroke();
    }
    for (let y = ry; y < ry + rh; y += ts) {
      ctx.beginPath();
      ctx.moveTo(rx, y);
      ctx.lineTo(rx + rw, y);
      ctx.stroke();
    }

    // Walls (Dark outer borders with 3D bevel matching Habblaud)
    ctx.strokeStyle = isSelected ? '#38bdf8' : '#2f3542';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(rx, ry, rw, rh);

    // Doorway opening at bottom
    ctx.fillStyle = floorColor;
    const doorX = rx + rw / 2 - 14;
    const doorY = ry + rh - 2;
    ctx.fillRect(doorX, doorY, 28, 5);

    // Habblaud-style Room Header Pill above doorway or top
    ctx.fillStyle = '#2f3542';
    const pillW = Math.min(rw - 16, room.name.length * 6 + 28);
    const pillX = rx + rw / 2 - pillW / 2;
    const pillY = ry + 4;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, 16, 4);
    ctx.fill();

    // Badge dot
    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.arc(pillX + 8, pillY + 8, 3, 0, Math.PI * 2);
    ctx.fill();

    // Room Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px system-ui';
    ctx.fillText(room.name, pillX + 16, pillY + 11);

    // Room Furniture & Objects
    this.drawRoomFurniture(room, rx, ry, rw, rh);
  }

  private drawRoomFurniture(room: RoomEntity, rx: number, ry: number, rw: number, rh: number) {
    const ctx = this.ctx;

    switch (room.category) {
      case 'classroom_small':
      case 'classroom_large': {
        // Teacher blackboard at front
        ctx.fillStyle = '#10ac84';
        ctx.fillRect(rx + rw / 2 - 35, ry + 24, 70, 7);
        ctx.fillStyle = '#ffffff';
        ctx.font = '6px monospace';
        ctx.fillText('Gestão Empresarial · v0.2', rx + rw / 2 - 32, ry + 29);

        // Desks with chairs
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            const dx = rx + 24 + col * 55;
            const dy = ry + 48 + row * 45;
            if (dx + 35 < rx + rw && dy + 20 < ry + rh) {
              ctx.fillStyle = '#ff9f43';
              ctx.fillRect(dx, dy, 32, 16);
              // Notebook
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(dx + 6, dy + 3, 8, 8);
              // Blue chair
              ctx.fillStyle = '#2e86de';
              ctx.fillRect(dx + 8, dy + 20, 16, 6);
            }
          }
        }
        break;
      }

      case 'computer_lab':
      case 'coworking_open': {
        // Dual monitor workstations (Habblaud style)
        for (let i = 0; i < 3; i++) {
          const dx = rx + 20 + i * 65;
          const dy = ry + 40;
          if (dx + 48 < rx + rw) {
            // White desk pod
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(dx, dy, 48, 24);
            ctx.strokeStyle = '#dcdde1';
            ctx.strokeRect(dx, dy, 48, 24);

            // Dual Monitors
            ctx.fillStyle = '#2f3542';
            ctx.fillRect(dx + 6, dy + 3, 14, 10);
            ctx.fillRect(dx + 26, dy + 3, 14, 10);

            // Glowing IDE screens
            ctx.fillStyle = '#10ac84'; // green terminal
            ctx.fillRect(dx + 7, dy + 4, 12, 8);
            ctx.fillStyle = '#2e86de'; // blue code
            ctx.fillRect(dx + 27, dy + 4, 12, 8);

            // Keyboards
            ctx.fillStyle = '#718093';
            ctx.fillRect(dx + 6, dy + 15, 14, 4);
            ctx.fillRect(dx + 26, dy + 15, 14, 4);

            // Office Swivel Chair
            ctx.fillStyle = '#341f97';
            ctx.fillRect(dx + 16, dy + 28, 16, 8);

            // Coffee mug
            ctx.fillStyle = '#ee5253';
            ctx.fillRect(dx + 42, dy + 6, 4, 4);

            // Wastebasket
            ctx.fillStyle = '#718093';
            ctx.strokeRect(dx - 6, dy + 8, 5, 8);
          }
        }

        // Potted plants in corner
        ctx.fillStyle = '#10ac84';
        ctx.beginPath();
        ctx.arc(rx + 16, ry + rh - 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c8d6e5';
        ctx.fillRect(rx + 12, ry + rh - 14, 8, 6);
        break;
      }

      case 'pallet_racks': {
        // Industrial warehouse racks with stacked crates
        for (let r = 0; r < 2; r++) {
          const py = ry + 36 + r * 60;
          if (py + 30 < ry + rh) {
            ctx.fillStyle = '#ff793f';
            ctx.fillRect(rx + 16, py, rw - 32, 5);
            ctx.fillRect(rx + 16, py + 24, rw - 32, 5);

            // Cardboard boxes
            for (let b = 0; b < 6; b++) {
              const bx = rx + 24 + b * 38;
              if (bx + 24 < rx + rw - 20) {
                ctx.fillStyle = '#cd6133';
                ctx.fillRect(bx, py - 12, 22, 12);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(bx + 4, py - 8, 6, 4); // shipping label
              }
            }
          }
        }
        break;
      }

      case 'shop_floor': {
        // Retail aisles and display gondolas
        for (let g = 0; g < 2; g++) {
          const gy = ry + 40 + g * 55;
          if (gy + 20 < ry + rh) {
            ctx.fillStyle = '#10ac84';
            ctx.fillRect(rx + 20, gy, rw - 40, 18);
            // Colorful items on shelf
            const colors = ['#ee5253', '#0abde3', '#feca57', '#5f27cd'];
            for (let it = 0; it < 6; it++) {
              ctx.fillStyle = colors[it % colors.length];
              ctx.fillRect(rx + 28 + it * 26, gy + 3, 14, 11);
            }
          }
        }
        break;
      }

      case 'checkout_area': {
        // Retail checkout desk with conveyor
        ctx.fillStyle = '#2f3542';
        ctx.fillRect(rx + 16, ry + 35, rw - 32, 20);
        ctx.fillStyle = '#10ac84'; // register screen
        ctx.fillRect(rx + 24, ry + 24, 16, 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx + 26, ry + 26, 12, 5);
        break;
      }

      case 'meeting_room': {
        // Executive boardroom table with chairs
        const tx = rx + 24;
        const ty = ry + 36;
        const tw = rw - 48;
        const th = rh - 56;
        ctx.fillStyle = '#84817a'; // modern oak table
        ctx.fillRect(tx, ty, tw, th);

        // Projector screen
        ctx.fillStyle = '#2f3542';
        ctx.fillRect(rx + rw / 2 - 30, ry + 16, 60, 6);
        ctx.fillStyle = '#0abde3';
        ctx.fillRect(rx + rw / 2 - 28, ry + 17, 56, 4);

        // Navy executive chairs
        ctx.fillStyle = '#227093';
        for (let c = 0; c < 3; c++) {
          ctx.fillRect(tx + 12 + c * 32, ty - 8, 14, 8);
          ctx.fillRect(tx + 12 + c * 32, ty + th, 14, 8);
        }
        break;
      }

      default:
        ctx.fillStyle = '#dcdde1';
        ctx.fillRect(rx + 20, ry + 30, 32, 16);
        break;
    }
  }

  private drawVehicle(veh: VehicleEntity, isSelected: boolean) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    const vx = veh.x * ts;
    const vy = veh.y * ts;

    ctx.save();
    ctx.translate(vx + 16, vy + 16);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(2, 6, 24, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isSelected) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(-28, -20, 56, 40);
    }

    if (veh.model === 'van_delivery') {
      ctx.fillStyle = '#2e86de';
      ctx.fillRect(-22, -14, 44, 28);
      ctx.fillStyle = '#54a0ff';
      ctx.fillRect(10, -11, 8, 22);
      ctx.fillStyle = '#222f3e';
      ctx.fillRect(-16, -16, 8, 4);
      ctx.fillRect(8, -16, 8, 4);
      ctx.fillRect(-16, 12, 8, 4);
      ctx.fillRect(8, 12, 8, 4);
    } else {
      ctx.fillStyle = '#ff9f43';
      ctx.fillRect(-26, -14, 52, 28);
      ctx.fillStyle = '#c8d6e5';
      ctx.fillRect(-16, -10, 32, 6);
    }

    ctx.restore();
  }

  private drawNPC(npc: NPCEntity, isSelected: boolean) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    const nx = npc.x * ts + 16;
    const ny = npc.y * ts + 16;

    ctx.save();
    ctx.translate(nx, ny);

    const isWalking = npc.state === 'walking';
    const walkBob = isWalking ? Math.sin(this.animFrame * 0.25) * 2 : 0;
    const legOffset = isWalking ? Math.sin(this.animFrame * 0.3) * 3 : 0;

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isSelected) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -6, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    // SPECIAL: Elisa in Wheelchair (matching reference image_99933e89.png)
    if (npc.hasWheelchair) {
      // Purple wheelchair frame
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 2;
      ctx.strokeRect(-8, -4, 16, 12);

      // Large Wheels with spokes
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.arc(-8, 3, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, 3, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath();
      ctx.arc(-8, 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, 3, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Legs / Pants
      ctx.fillStyle = npc.pantsColor || '#1e293b';
      ctx.fillRect(-5 + legOffset, 2, 4, 8);
      ctx.fillRect(1 - legOffset, 2, 4, 8);

      // Shoes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-5 + legOffset, 9, 5, 3);
      ctx.fillRect(1 - legOffset, 9, 5, 3);
    }

    // Torso / Shirt
    ctx.fillStyle = npc.shirtColor;
    ctx.fillRect(-6, -10 + walkBob, 12, 13);

    // Hardhat reflective vest
    if (npc.hasHardhat) {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-6, -8 + walkBob, 12, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -5 + walkBob, 12, 2);
    }

    // Head
    ctx.fillStyle = npc.avatarColor;
    ctx.fillRect(-5, -20 + walkBob, 10, 10);

    // Hair / Hat
    if (npc.hasHardhat) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-6, -23 + walkBob, 12, 5);
    } else {
      ctx.fillStyle = npc.hairColor;
      ctx.fillRect(-6, -22 + walkBob, 12, 5);
      ctx.fillRect(-6, -22 + walkBob, 3, 8);
    }

    // Glasses
    if (npc.hasGlasses) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(-4, -18 + walkBob, 3, 3);
      ctx.strokeRect(1, -18 + walkBob, 3, 3);
    }

    // Headphones (Felipe)
    if (npc.hasHeadphones) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-7, -22 + walkBob, 2, 8);
      ctx.fillRect(5, -22 + walkBob, 2, 8);
    }

    // Action Props matching reference sheets:
    if (npc.id === 'npc_rosa') {
      // Mop with blue water puddle
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4, -6 + walkBob);
      ctx.lineTo(8, 8);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, 6, 7, 4);
    } else if (npc.id === 'npc_miguel') {
      // Wire cart
      ctx.strokeStyle = '#718093';
      ctx.strokeRect(6, -2 + walkBob, 12, 10);
      ctx.fillStyle = '#cd6133';
      ctx.fillRect(8, -6 + walkBob, 8, 6);
    } else if (npc.id === 'npc_thiago') {
      // Toolbox
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(4, -4 + walkBob, 8, 8);
      ctx.fillStyle = '#ff9f43';
      ctx.fillRect(4, -2 + walkBob, 8, 2);
    } else if (npc.id === 'npc_aline') {
      // Box
      ctx.fillStyle = '#cd6133';
      ctx.fillRect(3, -6 + walkBob, 8, 8);
    }

    // Player indicator
    if (npc.id === 'npc_player') {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -28 + walkBob);
      ctx.lineTo(-4, -34 + walkBob);
      ctx.lineTo(4, -34 + walkBob);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draws modern floating pixel-art activity speech bubbles (matching Habblaud reference)
   */
  private drawSpeechBubble(npc: NPCEntity) {
    if (!npc.speechBubble) return;

    const ctx = this.ctx;
    const ts = this.tileSize;
    const nx = npc.x * ts + 16;
    const ny = npc.y * ts - 18;

    const text = npc.speechBubble.text;
    const icon = npc.speechBubble.icon;
    const isSuccess = npc.speechBubble.type === 'success';

    ctx.save();
    ctx.font = 'bold 8px system-ui, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const bw = textWidth + 24;
    const bh = 15;
    const bx = nx - bw / 2;
    const by = ny - bh - 6;

    // Little drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.roundRect(bx + 1, by + 1, bw, bh, 4);
    ctx.fill();

    // Bubble Background
    ctx.fillStyle = isSuccess ? '#fef3c7' : '#ffffff';
    ctx.strokeStyle = isSuccess ? '#f59e0b' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 4);
    ctx.fill();
    ctx.stroke();

    // Tail pointing down to character's head
    ctx.fillStyle = isSuccess ? '#fef3c7' : '#ffffff';
    ctx.beginPath();
    ctx.moveTo(nx - 3, by + bh);
    ctx.lineTo(nx, by + bh + 4);
    ctx.lineTo(nx + 3, by + bh);
    ctx.closePath();
    ctx.fill();

    // Text & Icon
    ctx.fillStyle = '#1e293b';
    ctx.fillText(`${icon} ${text}`, bx + 4, by + 10.5);

    ctx.restore();
  }

  private drawTimeOfDayLighting(timeOfDay: TimeOfDay) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (timeOfDay === 'morning') {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.04)';
      ctx.fillRect(0, 0, w, h);
    } else if (timeOfDay === 'dusk') {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.12)';
      ctx.fillRect(0, 0, w, h);
    } else if (timeOfDay === 'night') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fillRect(0, 0, w, h);
    }
  }
}
