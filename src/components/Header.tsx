/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Target, Activity, ShieldAlert, Wifi } from 'lucide-react';

export default function Header() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 100)).substring(0, 1);
      setTime(`${hrs}:${mins}:${secs}.${ms}`);
    };
    
    const interval = setInterval(updateTime, 100);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-panel w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-40">
      {/* Laser horizontal scanning effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff66] to-transparent opacity-60 animate-pulse" />

      {/* Title & Branding */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 border border-[#00ff66]/40 bg-[#00ff66]/5 rounded-sm shadow-[0_0_8px_rgba(0,255,102,0.15)]">
          <Target className="w-5 h-5 text-[#00ff66] animate-pulse" />
          <div className="absolute inset-0 border border-[#00ff66]/10 transform rotate-45 scale-75" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-wider text-white flex items-center gap-2">
            寻找028教室
            <span className="text-[#00ff66] text-xs font-mono px-2 py-0.5 border border-[#00ff66]/30 bg-[#00ff66]/10 rounded-sm uppercase tracking-widest hidden sm:inline-block">
              Twin Navigation V1.0
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 font-mono tracking-wider mt-0.5">
            CAMPUS SPATIAL NAVIGATION & COGNITIVE VISUALIZATION SYSTEM
          </p>
        </div>
      </div>

      {/* Cyber stats / clock */}
      <div className="flex items-center gap-6 font-mono text-xs">
        {/* Environment Grid Data */}
        <div className="hidden lg:flex items-center gap-4 text-gray-400 border-r border-[#00ff66]/10 pr-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase">SYS RANGE</span>
            <span className="text-white text-right">800m × 600m</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase">COGNITIVE LATENCY</span>
            <span className="text-[#00ff66] font-semibold">12.4ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase">DESTINATION</span>
            <span className="text-[#00ff66] font-semibold border-b border-[#00ff66] animate-pulse">ROOM 028</span>
          </div>
        </div>

        {/* Live system state indicators */}
        <div className="flex items-center gap-3 text-[11px] text-[#00ff66]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
          </span>
          <span className="tracking-widest uppercase">STABLE TWIN</span>
        </div>

        {/* High-fidelity holographic clock */}
        <div className="bg-[#00ff66]/5 border border-[#00ff66]/20 px-3 py-1.5 rounded-sm shadow-[inset_0_0_6px_rgba(0,255,102,0.1)] text-[#00ff66]">
          <span className="text-gray-500 font-normal mr-1">UTC:</span>
          <span className="font-bold tracking-widest text-[#00ff66] tabular-nums font-mono">
            {time || '00:00:00.0'}
          </span>
        </div>
      </div>
    </header>
  );
}
