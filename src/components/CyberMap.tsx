/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Compass, Eye, Shield, Activity, RefreshCw } from 'lucide-react';
import { OriginKey } from '../types';
import { ORIGIN_DATA } from '../data';

interface CyberMapProps {
  selectedOrigin: OriginKey;
  activeStepIndex: number | null;
  onSelectStepIndex: (index: number | null) => void;
}

export default function CyberMap({
  selectedOrigin,
  activeStepIndex,
  onSelectStepIndex,
}: CyberMapProps) {
  const currentPath = ORIGIN_DATA[selectedOrigin];
  
  // Interactive zoom & pan configuration
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Holographic toggle views
  const [showRulers, setShowRulers] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  // Highlight specific nodes based on active index
  const highlightedNode = activeStepIndex !== null && currentPath.nodes[activeStepIndex] 
    ? currentPath.nodes[activeStepIndex] 
    : null;

  // Mouse drag handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Only allow drag on left click
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const nextX = e.clientX - dragStart.current.x;
    const nextY = e.clientY - dragStart.current.y;
    
    // Bounds checking based on current zoom so the map doesn't float away indefinitely
    const limitX = 200 * zoom;
    const limitY = 200 * zoom;
    setPan({
      x: Math.max(-limitX, Math.min(limitX, nextX)),
      y: Math.max(-limitY, Math.min(limitY, nextY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile devices
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = { 
      x: e.touches[0].clientX - pan.x, 
      y: e.touches[0].clientY - pan.y 
    };
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const nextX = e.touches[0].clientX - dragStart.current.x;
    const nextY = e.touches[0].clientY - dragStart.current.y;
    const limitX = 200 * zoom;
    const limitY = 200 * zoom;
    setPan({
      x: Math.max(-limitX, Math.min(limitX, nextX)),
      y: Math.max(-limitY, Math.min(limitY, nextY)),
    });
  };

  // Zoom helpers
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const resetMap = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    onSelectStepIndex(null);
  };

  // Compile coordinates string for animated polyline path
  const getPathPolylinePoints = () => {
    return currentPath.nodes.map(node => `${node.x},${node.y}`).join(' ');
  };

  return (
    <section className="relative flex-1 min-h-[500px] lg:h-[calc(100vh-100px)] rounded-md glass-panel overflow-hidden flex flex-col group/map">
      {/* Holographic dynamic scanning line overlay */}
      <div className="scanning-line" />

      {/* Dynamic Digital Mesh Grid & Scanline Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,102,0.02)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      
      {/* SVG Film-Grain/Noise overlay (to get that gritty, analog look from the uploaded image) */}
      <svg className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay w-full h-full z-0">
        <filter id="cyberGrainNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cyberGrainNoise)" />
      </svg>

      {/* Cybernetic Tech Border Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff66]/70 z-10" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff66]/70 z-10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff66]/70 z-10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff66]/70 z-10" />

      {/* Horizontal & Vertical Crosshair Coordinates rulers */}
      {showRulers && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Top ruler ticks */}
          <div className="absolute top-0 left-[10%] right-[10%] h-3 border-b border-[#00ff66]/10 flex justify-between text-[7px] font-mono text-gray-500">
            <span>0100</span><span>0200</span><span>0300</span><span>0400</span><span>0500</span><span>0600</span><span>0700</span>
          </div>
          {/* Left ruler ticks */}
          <div className="absolute left-0 top-[10%] bottom-[10%] w-3 border-r border-[#00ff66]/10 flex flex-col justify-between text-[7px] font-mono text-gray-500 items-center">
            <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span>
          </div>
          {/* Center visual targeting crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-25">
            <div className="w-16 h-[1px] bg-[#00ff66]" />
            <div className="h-16 w-[1px] bg-[#00ff66] absolute" />
            <div className="w-6 h-6 border border-[#00ff66] rounded-full absolute" />
          </div>
        </div>
      )}

      {/* Floating Header details */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 z-10 pointer-events-none bg-[#0d0f12]/80 backdrop-blur border border-[#00ff66]/10 p-2 rounded-sm max-w-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00ff66] font-bold">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>核心空间导视孪生地图 / MAP CONTAINER</span>
        </div>
        <span className="text-[9px] font-mono text-gray-500 uppercase">
          ORIGIN ACTIVE: <span className="text-white">{(currentPath.label).toUpperCase()}</span>
        </span>
        <span className="text-[8px] font-mono text-gray-600">
          GPS REF: 39.923412°N / 116.353392°E
        </span>
      </div>

      {/* Visual Toggles inside the Map */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowRulers(!showRulers)}
          className={`px-2.5 py-1 text-[10px] font-mono border rounded-sm transition-all duration-200 flex items-center gap-1.5 ${
            showRulers
              ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]'
              : 'border-gray-700 bg-black/40 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>网面辅助尺</span>
        </button>
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`px-2.5 py-1 text-[10px] font-mono border rounded-sm transition-all duration-200 flex items-center gap-1.5 ${
            showHotspots
              ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]'
              : 'border-gray-700 bg-black/40 text-gray-500 hover:text-gray-300'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>地标热力</span>
        </button>
      </div>

      {/* Visual coordinates status box in bottom left */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 border border-[#00ff66]/15 px-3 py-1.5 rounded-sm font-mono text-[9px] text-[#00ff66] pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <div>SCALE: {zoom.toFixed(2)}X</div>
          <div>PAN: X={pan.x}px Y={pan.y}px</div>
          <div>FOCUS NODE: {highlightedNode ? (highlightedNode.label || 'LOCAL POINT') : 'NONE'}</div>
        </div>
      </div>

      {/* Primary draggable interactive Map Canvas wrapper */}
      <div
        ref={containerRef}
        id="map-canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`flex-1 relative w-full h-full flex items-center justify-center cursor-move text-white overflow-hidden transition-all duration-100 ${
          isDragging ? 'cursor-grabbing select-none' : ''
        }`}
      >
        {/* Dynamic Zoom & Pan Container */}
        <div
          className="relative transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: '800px',
            height: '600px',
            transformOrigin: 'center center',
          }}
        >
          {/* THE SVG ISOMETRIC ARCHITECTURAL LAYOUT */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ambient Background Glow Spot behind Room 028 */}
            <circle cx="550" cy="320" r="160" fill="radial-gradient" className="opacity-15 pointer-events-none">
              <animate attributeName="r" values="130;170;130" dur="5s" repeatCount="indefinite" />
            </circle>

            <defs>
              {/* Halftone patterned circular dot fill */}
              <pattern id="gridDot" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="8" cy="8" r="1" fill="#00ff66" fillOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#gridDot)" pointer-events-none="true" />

            {/* CAMPUS PATH LINES & CONNECTORS */}
            {/* Visual secondary pathways (background grid lanes representing campus walkways) */}
            <g stroke="#00ff66" strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="3 4">
              <line x1="80" y1="360" x2="200" y2="80" />
              <line x1="200" y1="80" x2="480" y2="70" />
              <line x1="480" y1="70" x2="740" y2="480" />
              <line x1="740" y1="480" x2="420" y2="540" />
              <line x1="420" y1="540" x2="80" y2="360" />
              <line x1="210" y1="340" x2="420" y2="420" />
              <line x1="510" y1="240" x2="600" y2="360" />
              <line x1="250" y1="180" x2="480" y2="160" />
            </g>

            {/* CENTRAL DIGITAL MIRROR WATERWAYS (镜湖水系 - North-to-South wavy digital canal) */}
            <g opacity="0.3" pointerEvents="none">
              <path
                d="M 330,120 Q 280,220 340,320 T 290,480 L 330,480 Q 380,320 310,220 T 360,120 Z"
                fill="url(#lakeGlow)"
                stroke="#00ffff"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                filter="drop-shadow(0px 0px 4px rgba(0,255,255,0.3))"
              />
              <defs>
                <linearGradient id="lakeGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00ffff" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#00ff66" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0088cc" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <text x="320" y="300" className="font-mono text-[8px] fill-[#00ffff]/60 font-medium tracking-widest uppercase [writing-mode:vertical-lr]" textAnchor="middle">
                MIRROR LAKE 镜湖
              </text>
            </g>

            {/* THREE-DIMENSIONAL ISOMETRIC CYBER BUILDINGS */}
            {/* Each building rendered in vector isometric wireframe carefully matching the layout in image 1 */}

            {/* 1. ATHLETIC FIELD & TRACK (体育中心和运动跑道) - Located in North / North-East as per layout */}
            <g transform="translate(580, 40)" className="transition-all duration-300 hover:opacity-90">
              {/* Outer oval track */}
              <rect x="0" y="0" width="130" height="70" rx="35" fill="none" stroke="#ff3b30" strokeWidth="1.2" strokeOpacity="0.4" />
              <rect x="10" y="5" width="110" height="60" rx="30" fill="none" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.3" />
              {/* Inner grass soccer field */}
              <rect x="25" y="15" width="80" height="40" rx="8" fill="#0c1d12" fillOpacity="0.3" stroke="#00ff66" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="65" y1="15" x2="65" y2="55" stroke="#00ff66" strokeWidth="0.5" strokeOpacity="0.3" />
              <circle cx="65" cy="35" r="10" fill="none" stroke="#00ff66" strokeWidth="0.5" strokeOpacity="0.3" />

              {/* Accompanying Stadium Pavilion Wireframe (体育中心主馆) */}
              <g transform="translate(140, 10)">
                <polygon points="30,15 50,5 30,-5 10,5" fill="#0d1f14" stroke="#ff3b30" strokeWidth="0.8" strokeOpacity="0.5" />
                <polygon points="10,5 30,15 30,35 10,25" fill="#07110c" stroke="#ff3b30" strokeWidth="0.8" strokeOpacity="0.5" />
                <polygon points="30,15 50,5 50,25 30,35" fill="#040a07" stroke="#ffff30" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="30" y="4" className="font-mono text-[7px] fill-gray-400 text-center" textAnchor="middle">PAVILION</text>
              </g>

              <text x="65" y="-5" className="font-mono text-[8px] fill-gray-400 text-center" textAnchor="middle">
                SPORTS CENTER 体育场
              </text>
            </g>
            
            {/* 2. THE CAFETERIA BLOCK (学生食堂 / Cafeteria) - Located in East Sector */}
            <g transform="translate(620, 220)" className="transition-all duration-300 hover:opacity-90 cursor-help">
              <polygon points="100,30 150,5 100,-20 50,5" fill="#0c1a12" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.3" />
              <polygon points="50,5 100,30 100,90 50,65" fill="#080f0a" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.3" />
              <polygon points="100,30 150,5 150,65 100,90" fill="#050a07" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.3" />
              
              {/* Isometric neon accent lines */}
              <line x1="50" y1="5" x2="100" y2="30" stroke="#00ff66" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="100" y1="30" x2="150" y2="5" stroke="#00ff66" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="100" y1="30" x2="100" y2="90" stroke="#00ff66" strokeWidth="1.5" strokeOpacity="0.7" />
              
              {/* Text label */}
              <text x="100" y="45" className="font-mono text-[9px] fill-[#00ff66]/80 font-bold tracking-widest text-center" textAnchor="middle">
                CAFETERIA 学生食堂
              </text>
              <text x="100" y="58" className="font-mono text-[7px] fill-gray-500 text-center" textAnchor="middle">
                Enter 24 / Exit 3
              </text>

              {/* Side Entrance Marker (Enter 4, Exit 6) */}
              <circle cx="90" cy="90" r="3.5" fill="#0088cc" />
              <line x1="90" y1="90" x2="90" y2="115" stroke="#0088cc" strokeWidth="0.5" strokeDasharray="1 1" />
              <text x="90" y="125" className="font-mono text-[7px] fill-[#0088cc]" textAnchor="middle">
                侧门 Enter 4/Exit 6
              </text>
            </g>

            {/* 3. DORMITORIES BLOCK (西北宿舍区 / Dormitories 1st Cluster) - Northwest position as per layout */}
            <g transform="translate(80, 160)" className="transition-all duration-300 hover:opacity-95">
              {/* Stacked isometric small rectangular housing lattices */}
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${i * 45}, ${i * -20})`}>
                  <polygon points="25,12 45,2 25,-8 5,2" fill="#0d1b11" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.4" />
                  <polygon points="5,2 25,12 25,35 5,25" fill="#070f0a" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.4" />
                  <polygon points="25,12 45,2 45,25 25,35" fill="#040906" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.4" />
                  <text x="25" y="18" className="font-mono text-[6px] fill-gray-500" textAnchor="middle">DORM-A{i+1}</text>
                </g>
              ))}
              <text x="60" y="55" className="font-mono text-[8px] fill-gray-400 font-bold" textAnchor="middle">西北宿舍集群</text>
            </g>

            {/* 4. DORMITORIES BLOCK 2 (西南宿舍区 / Dormitories 2nd Cluster) - Southwest position as per layout */}
            <g transform="translate(100, 440)" className="transition-all duration-300 hover:opacity-90 cursor-help">
              <polygon points="40,20 80,0 40,-20 0,0" fill="#0c1a12" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.3" />
              <polygon points="0,0 40,20 40,70 0,50" fill="#080f0a" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.3" />
              <polygon points="40,20 80,0 80,70 40,70" fill="#050a07" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.3" />
              <line x1="40" y1="20" x2="40" y2="70" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.5" />
              <text x="40" y="32" className="font-mono text-[9px] fill-[#00ff66]/70 text-center" textAnchor="middle">
                DORMITORIES 宿舍B
              </text>
              <text x="40" y="44" className="font-mono text-[7px] fill-gray-500 text-center" textAnchor="middle">
                Side Door Enter 1/Exit 5
              </text>
            </g>

            {/* 5. ACADEMIC LIBRARY (学生活动中心与图书馆 / Library Hub) - West side of lake, Southwest center */}
            <g transform="translate(250, 430)" className="transition-all duration-300 hover:opacity-95">
              {/* Circular layered database architecture tower */}
              <ellipse cx="40" cy="20" rx="35" ry="18" fill="#0d1a12" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.4" />
              <ellipse cx="40" cy="10" rx="35" ry="18" fill="none" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.3" />
              <ellipse cx="40" cy="0" rx="35" ry="18" fill="#112d1c" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.5" />
              
              {/* Vertical wire lines */}
              <line x1="5" y1="20" x2="5" y2="0" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="75" y1="20" x2="75" y2="0" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="40" y1="38" x2="40" y2="18" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.4" />

              {/* Holographic scanner ring rotating over Library */}
              <ellipse cx="40" cy="-6" rx="42" ry="22" fill="none" stroke="#00ffff" strokeWidth="1" strokeDasharray="3 4" className="opacity-60" />

              <text x="40" y="10" className="font-mono text-[9px] fill-[#00ff66] font-bold text-center" textAnchor="middle">
                LIBRARY 图书馆
              </text>
              <text x="40" y="22" className="font-mono text-[7px] fill-gray-400 text-center" textAnchor="middle">
                COGNITIVE ARCHIVE
              </text>
            </g>

            {/* 6. COGNITIVE SCIENCE PLAZA & CLASSROOMS WING (第一教学大楼 / Lecture Center) - Holding Room 028 */}
            <g transform="translate(420, 310)" className="transition-all duration-300">
              {/* Complex isometric structure layout */}
              <polygon points="80,40 220,-10 140,-50 0,0" fill="#112519" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.4" />
              <polygon points="0,0 80,40 80,110 0,70" fill="#0a150f" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.4" />
              <polygon points="80,40 220,-10 220,60 80,110" fill="#060c09" stroke="#00ff66" strokeWidth="1.2" strokeOpacity="0.4" />
              
              <line x1="80" y1="40" x2="80" y2="110" stroke="#00ff66" strokeWidth="2" strokeOpacity="0.6" />
              
              <text x="140" y="10" className="font-mono text-[10px] fill-[#00ff66] font-bold tracking-widest text-center" textAnchor="middle">
                LECTURE HALL 教学大楼
              </text>
              <text x="140" y="24" className="font-mono text-[7px] fill-gray-400 text-center" textAnchor="middle">
                COMPLEX STRUCTURE A/B/C/D
              </text>
            </g>

            {/* 7. SECONDARY LECTURE HALL (第二教学大楼 / Lect Wing 2) - Positioned symmetrically in Center-East */}
            <g transform="translate(540, 420)" className="transition-all duration-300 opacity-80 hover:opacity-100">
              <polygon points="50,25 130,-5 80,-30 0,0" fill="#091810" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.3" />
              <polygon points="0,0 50,25 50,70 0,45" fill="#050e09" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.3" />
              <polygon points="50,25 130,-5 130,40 50,70" fill="#030805" stroke="#00ff66" strokeWidth="0.8" strokeOpacity="0.3" />
              <text x="65" y="15" className="font-mono text-[8px] fill-gray-400 text-center" textAnchor="middle">2ND LECTURE WING</text>
              <text x="65" y="26" className="font-mono text-[7px] fill-gray-500 text-center" textAnchor="middle">二号教学楼</text>
            </g>

            {/* 8. SCIENTIFIC RESEARCH COMPLEX (科研实验大楼 / Bioscience Lab B/C) - Located in North-East / North */}
            <g transform="translate(380, 110)" className="transition-all duration-300 opacity-85 hover:opacity-100">
              <polygon points="60,20 110,0 70,-20 20,0" fill="#0f1f15" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.35" />
              <polygon points="20,0 60,20 60,65 20,45" fill="#09140e" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.35" />
              <polygon points="60,20 110,0 110,45 60,65" fill="#050c08" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.35" />
              <text x="65" y="16" className="font-mono text-[8px] fill-[#00ff66]/70 text-center" textAnchor="middle">LAB COMPLEX 实验楼</text>
              <text x="65" y="26" className="font-mono text-[7px] fill-gray-500 text-center" textAnchor="middle">智能集成微环境</text>
            </g>

            {/* ACTIVE NEON COMPLETED ROUTE LINE (Glows & Pulses) */}
            {/* The primary fluorescent laser wireline tracking the path forward */}
            <polyline
              points={getPathPolylinePoints()}
              fill="none"
              stroke="#00ff66"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
              filter="drop-shadow(0px 0px 8px rgba(0,255,102,0.9))"
            />
            {/* Running dash layer (looks like moving lasers) */}
            <polyline
              points={getPathPolylinePoints()}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12 20"
              className="opacity-90"
              style={{
                strokeDashoffset: 100,
                animation: 'cyberLaserTravel 4s linear infinite',
              }}
            />

            {/* ROUTE INTERMEDIARY NODES */}
            {currentPath.nodes.map((node, idx) => {
              const isHighlighted = highlightedNode && highlightedNode.x === node.x && highlightedNode.y === node.y;
              return (
                <g key={idx} className="cursor-pointer" onClick={() => onSelectStepIndex(idx)}>
                  {/* Glowing background ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHighlighted ? '14' : '9'}
                    fill={isHighlighted ? 'rgba(0, 255, 102, 0.25)' : 'rgba(0, 0, 0, 0.6)'}
                    stroke={isHighlighted ? '#00ff66' : '#00ff66'}
                    strokeWidth={isHighlighted ? '2.5' : '1.2'}
                    className="transition-all duration-300"
                  />
                  
                  {/* Concentric pulse circles for active guides */}
                  {isHighlighted && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="none"
                      stroke="#00ff66"
                      strokeWidth="1.5"
                      className="animate-ping"
                      style={{ animationDuration: '1.5s' }}
                    />
                  )}

                  {/* Node central dot */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4"
                    fill={isHighlighted ? '#ffffff' : '#00ff66'}
                    className="transition-colors duration-300"
                  />

                  {/* Text identifier labels next to node */}
                  <text
                    x={node.x}
                    y={node.y - 14}
                    className="font-mono text-[9px] font-bold fill-white tracking-wide text-center"
                    textAnchor="middle"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                  >
                    {node.label || `NODE 0${idx + 1}`}
                  </text>
                </g>
              );
            })}

            {/* 028 ROOM TARGET BEACON (028教室 - Absolute Destination) */}
            <g transform="translate(550, 320)" className="cursor-help">
              {/* Concentric deep diagnostic scanner circles */}
              <circle r="34" fill="none" stroke="#00ff66" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-40 animate-spin" style={{ animationDuration: '14s' }} />
              <circle r="26" fill="none" stroke="#00ff66" strokeWidth="0.5" strokeDasharray="4 2" className="opacity-50 animate-reverse-spin" style={{ animationDuration: '8s' }} />
              
              {/* Pulse waves */}
              <circle r="18" fill="rgba(0,255,102,0.15)" stroke="#00ff66" strokeWidth="1.5" />
              <circle r="6" fill="#00ff66" className="animate-pulse" />
              
              {/* Visual locator pin */}
              <g transform="translate(0, -18)">
                {/* Target badge flag style card */}
                <rect x="-35" y="-18" width="70" height="15" fill="#0d0f12" stroke="#00ff66" strokeWidth="1" className="shadow-[0_0_10px_rgba(0,255,102,0.4)]" />
                <text x="0" y="-7" className="font-mono text-[9px] font-extrabold fill-[#00ff66] text-center" textAnchor="middle">
                  028教室 (DEST)
                </text>
                <polygon points="0,0 -4,-5 4,-5" fill="#00ff66" />
              </g>

              {/* Little sound visualizer bars around Room 028 for true dynamic representation */}
              {showHotspots && (
                <g className="opacity-65" transform="translate(0, 32)">
                  <rect x="-12" y="0" width="3" height="12" fill="#00ff66" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <rect x="-6" y="0" width="3" height="24" fill="#00ff66" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <rect x="0" y="0" width="3" height="18" fill="#00ff66" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <rect x="6" y="0" width="3" height="15" fill="#00ff66" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <rect x="12" y="0" width="3" height="8" fill="#00ff66" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <text x="0" y="28" className="font-mono text-[7px] fill-gray-400" textAnchor="middle">COGNITIVE HUB</text>
                </g>
              )}
            </g>

            {/* EXTRAS: Compass Overlayed Graphics in Map */}
            <g transform="translate(90, 110)" className="opacity-35 pointer-events-none">
              <circle r="40" fill="none" stroke="#00ff66" strokeWidth="0.7" strokeDasharray="3 2" />
              <line x1="-48" y1="0" x2="48" y2="0" stroke="#00ff66" strokeWidth="0.5" />
              <line x1="0" y1="-48" x2="0" y2="48" stroke="#00ff66" strokeWidth="0.5" />
              <polygon points="0,-44 -4,-25 4,-25" fill="#00ff66" />
              <polygon points="0,44 -3,25 3,25" fill="#00ff66" fillOpacity="0.5" />
              <text x="0" y="-48" className="font-mono text-[8px] fill-[#00ff66]" textAnchor="middle">N</text>
              <text x="0" y="54" className="font-mono text-[8px] fill-[#00ff66]" textAnchor="middle">S</text>
              <text x="52" y="3" className="font-mono text-[8px] fill-[#00ff66]" textAnchor="start">E</text>
              <text x="-58" y="3" className="font-mono text-[8px] fill-[#00ff66]" textAnchor="end">W</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating map controller bottom bar */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-sm bg-[#0d0f12]/90 border border-[#00ff66]/20 flex items-center justify-center hover:bg-[#00ff66]/10 text-[#00ff66] transition-colors shadow-lg cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-sm bg-[#0d0f12]/90 border border-[#00ff66]/20 flex items-center justify-center hover:bg-[#00ff66]/10 text-[#00ff66] transition-colors shadow-lg cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={resetMap}
          title="Recenter Map"
          className="px-3 h-8 rounded-sm bg-[#0d0f12]/90 border border-[#00ff66]/20 flex items-center gap-1.5 hover:bg-[#00ff66]/10 text-[#00ff66] font-mono text-[10px] transition-colors shadow-lg cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>复位</span>
        </button>
      </div>

      {/* Hover tutorial hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[9px] font-mono bg-black/60 border border-[#00ff66]/10 px-3 py-1 rounded-full text-gray-500 pointer-events-none tracking-widest hidden sm:block">
        DRAG MOUSE TO PAN • SCROLL TO EXTEND • TOGGLE ACCESS POINTS FOR REAL-TIME SIMULATION
      </div>
    </section>
  );
}
