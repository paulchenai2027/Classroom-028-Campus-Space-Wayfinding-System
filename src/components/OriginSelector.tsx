/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, ArrowUpRight, Navigation, Footprints } from 'lucide-react';
import { OriginKey } from '../types';
import { ORIGIN_DATA } from '../data';

interface OriginSelectorProps {
  selectedOrigin: OriginKey;
  onSelectOrigin: (key: OriginKey) => void;
}

export default function OriginSelector({ selectedOrigin, onSelectOrigin }: OriginSelectorProps) {
  const options = Object.values(ORIGIN_DATA);

  return (
    <section className="glass-panel rounded-md p-5 group transition-all duration-300 hover:border-[#00ff66]/25">
      {/* Visual cybernetic corner tech borders */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff66]/60" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff66]/60" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff66]/60" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff66]/60" />

      {/* Title block with coordinates index */}
      <div className="flex items-center justify-between border-b border-[#00ff66]/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <h2 className="text-[13px] font-sans font-bold text-white tracking-widest uppercase">
            [01] 起点选择 / ACCESS CHECKPOINTS
          </h2>
        </div>
        <span className="text-[9px] font-mono text-gray-500 tracking-wider">
          NODE COUNT: 05
        </span>
      </div>

      <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-sans">
        请选择您当前所在的入口节点，系统将自动基于校园三维点云拓扑结构实时渲染前行至 <span className="text-[#00ff66] font-mono font-medium">028阶梯教室</span> 的最优路径。
      </p>

      {/* Grid of beautiful checkpoints */}
      <div className="flex flex-col gap-2.5">
        {options.map((option) => {
          const isActive = selectedOrigin === option.key;
          return (
            <button
              key={option.key}
              id={`btn-origin-${option.key}`}
              onClick={() => onSelectOrigin(option.key)}
              className={`relative w-full text-left p-3 rounded transition-all duration-300 ${
                isActive
                  ? 'border border-[#00ff66] bg-[#00ff66]/10 text-white shadow-[0_0_15px_rgba(0,255,102,0.15),_inset_0_0_10px_rgba(0,255,102,0.05)]'
                  : 'border border-[#00ff66]/10 bg-[#0d0f12]/40 hover:bg-[#00ff66]/5 hover:border-[#00ff66]/30 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-mono transition-all duration-300 ${
                      isActive
                        ? 'border-[#00ff66] bg-[#00ff66] text-black font-extrabold shadow-[0_0_8px_rgba(0,255,102,0.4)]'
                        : 'border-[#00ff66]/30 bg-[#0d0f12]/80 text-[#00ff66]'
                    }`}
                  >
                    {option.key === 'east' && 'E'}
                    {option.key === 'south' && 'S'}
                    {option.key === 'west' && 'W'}
                    {option.key === 'north' && 'N'}
                    {option.key === 'north_side' && 'NS'}
                  </div>
                  <div>
                    <h3 className="text-xs font-sans font-bold flex items-center gap-1.5">
                      {option.label.split(' ')[0]}
                      <span className="text-[10px] opacity-75 font-mono font-normal">
                        {option.label.split(' ')[1]}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Info badges */}
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span className="flex items-center gap-0.5 text-gray-400">
                    <Footprints className="w-3 h-3 text-gray-500" />
                    {option.distance}m
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 ${
                    isActive ? 'border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66]' : 'bg-[#181b21] text-gray-400'
                  }`}>
                    {option.baseTime} Min
                  </span>
                  <ArrowUpRight className={`w-3 h-3 transition-transform duration-300 ${
                    isActive ? 'text-[#00ff66] translate-x-0.5 -translate-y-0.5' : 'text-gray-600'
                  }`} />
                </div>
              </div>

              {/* Holographic scanner laser line indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
