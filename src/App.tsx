/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { OriginKey } from './types';
import Header from './components/Header';
import CyberMap from './components/CyberMap';
import OriginSelector from './components/OriginSelector';
import PathAnalysis from './components/PathAnalysis';
import MicroGuides from './components/MicroGuides';

export default function App() {
  // Shared state across modular dashboard blocks
  const [selectedOrigin, setSelectedOrigin] = useState<OriginKey>('east');
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Quick reset when toggling access gateways to clean current active highlights
  const handleSelectOrigin = (key: OriginKey) => {
    setSelectedOrigin(key);
    setActiveStepIndex(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#090a0d] text-gray-100 flex flex-col font-sans relative overflow-x-hidden antialiased select-none selection:bg-[#00ff66]/20 selection:text-white pb-8">
      {/* Noise overlay container */}
      <div className="noise-overlay" />

      {/* Immersive Scanlines and Grid animations overlays across board */}
      <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20 z-10" />
      
      {/* 1. TOP BAR WRAPPER / 科技感贯穿页眉 */}
      <Header />

      {/* 2. MAIN LAYOUT AND COMPENDIUM */}
      {/* Large PC: 65% Left / 35% Right split. Phone: Stacked with sticky view map */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* LEFT COMPONENT: CORE VISUALIZATION MAP CONTAINER (65% width on PC) */}
        <div className="w-full lg:w-[65%] shrink-0 flex flex-col sticky top-0 lg:static z-20 shadow-[0_15px_30px_rgba(0,0,0,0.6)] lg:shadow-none">
          <div className="relative">
            <CyberMap
              selectedOrigin={selectedOrigin}
              activeStepIndex={activeStepIndex}
              onSelectStepIndex={setActiveStepIndex}
            />
          </div>
        </div>

        {/* RIGHT COMPONENTS: SCROLLABLE BEHAVIORAL CONTROL DRAWER (35% width on PC) */}
        <div className="flex-1 flex flex-col gap-6 z-10 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-[#00ff66]/10 scrollbar-track-transparent">
          
          {/* PANEL A: Origin Checkpoint Selection (起点选择) */}
          <OriginSelector
            selectedOrigin={selectedOrigin}
            onSelectOrigin={handleSelectOrigin}
          />

          {/* PANEL B: Path Dynamic Statistics Chart (路径动态分析) */}
          <PathAnalysis
            selectedOrigin={selectedOrigin}
          />

          {/* PANEL C: Microscopic Behavior Guidelines list (028微观行为线索) */}
          <MicroGuides
            selectedOrigin={selectedOrigin}
            activeStepIndex={activeStepIndex}
            onSelectStepIndex={setActiveStepIndex}
          />
        </div>
      </main>

      {/* Cyber footer info bar */}
      <footer className="w-full text-center py-4 border-t border-gray-900 mt-8 font-mono text-[9px] text-gray-600 relative z-10 uppercase tracking-widest">
        <span>© 2026 CAMPUS COGNITIVE DIGITAL TWIN PROJECT • ALL SYSTEM CODES OPERATIONAL [50HZ SECURE]</span>
      </footer>
    </div>
  );
}
