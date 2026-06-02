/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lightbulb, CheckSquare, Square, Locate, ChevronRight } from 'lucide-react';
import { OriginKey } from '../types';
import { ORIGIN_DATA } from '../data';

interface MicroGuidesProps {
  selectedOrigin: OriginKey;
  activeStepIndex: number | null;
  onSelectStepIndex: (index: number | null) => void;
}

export default function MicroGuides({
  selectedOrigin,
  activeStepIndex,
  onSelectStepIndex,
}: MicroGuidesProps) {
  const data = ORIGIN_DATA[selectedOrigin];

  return (
    <section className="glass-panel rounded-md p-5 group transition-all duration-300 hover:border-[#00ff66]/25">
      {/* Visual cybernetic corner tech borders */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff66]/60" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff66]/60" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff66]/60" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff66]/60" />

      {/* Title Header with interactive stats */}
      <div className="flex items-center justify-between border-b border-[#00ff66]/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#00ff66]" />
          <h2 className="text-[13px] font-sans font-bold text-white tracking-widest uppercase">
            [03] 028微观行为线索 / MICRO GUIDE
          </h2>
        </div>
        <span className="text-[9px] font-mono text-gray-500 tracking-wider">
          STEPS: {data.steps.length}
        </span>
      </div>

      <p className="text-[11px] text-gray-400 mb-4 font-sans leading-relaxed">
        点击下方任意行为线索，即可在左侧【核心空间地图】中准确定位并放大对应的标志性地标或决策路口。
      </p>

      {/* Timeline design */}
      <div className="flex flex-col gap-3">
        {data.steps.map((step, index) => {
          const isSelected = activeStepIndex === index;
          return (
            <div
              key={index}
              id={`micro-step-${index}`}
              onClick={() => onSelectStepIndex(isSelected ? null : index)}
              className={`group/step cursor-pointer relative p-3 rounded transition-all duration-300 border ${
                isSelected
                  ? 'border-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_12px_rgba(0,255,102,0.1)]'
                  : 'border-[#00ff66]/10 bg-[#0d0f12]/30 hover:bg-[#00ff66]/5 hover:border-[#00ff66]/20'
              }`}
            >
              <div className="flex gap-3">
                {/* Checkbox step indicator */}
                <div className="flex items-start mt-0.5">
                  {isSelected ? (
                    <div className="flex items-center justify-center w-4.5 h-4.5 border border-[#00ff66] rounded-sm bg-[#00ff66]/10 text-[#00ff66]">
                      <Locate className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-4.5 h-4.5 border border-gray-600 rounded-sm bg-[#0d0f12]/40 text-gray-500 group-hover/step:border-[#00ff66]/40 group-hover/step:text-[#00ff66]/60 transition-colors">
                      <span className="text-[9px] font-mono">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Instruction details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${
                      isSelected ? 'text-[#00ff66]' : 'text-gray-500'
                    }`}>
                      MILESTONE {String(index + 1).padStart(2, '0')}
                    </span>
                    {isSelected && (
                      <span className="text-[8px] font-mono text-[#00ff66] px-1 bg-[#00ff66]/20 border border-[#00ff66]/30 animate-pulse uppercase rounded-sm">
                        TRACKING INDICES
                      </span>
                    )}
                  </div>
                  <p className={`text-[11.5px] mt-1.5 leading-relaxed font-sans ${
                    isSelected ? 'text-white font-medium' : 'text-gray-300 transition-colors group-hover/step:text-white'
                  }`}>
                    {step}
                  </p>
                </div>

                {/* Subtle right-pointing arrow */}
                <div className="flex items-center self-stretch">
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isSelected ? 'text-[#00ff66] translate-x-0.5' : 'text-gray-600 group-hover/step:text-gray-400'
                  }`} />
                </div>
              </div>

              {/* Connecting vertical bar */}
              {index < data.steps.length - 1 && (
                <div className="absolute left-[21px] top-[32px] bottom-[-15px] w-[1px] bg-gradient-to-b from-[#00ff66]/20 to-[#00ff66]/5 z-0 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
