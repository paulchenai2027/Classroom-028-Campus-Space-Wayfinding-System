/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Activity, Circle, TrendingUp, AlertTriangle } from 'lucide-react';
import { OriginKey } from '../types';
import { ORIGIN_DATA } from '../data';

interface PathAnalysisProps {
  selectedOrigin: OriginKey;
}

export default function PathAnalysis({ selectedOrigin }: PathAnalysisProps) {
  const data = ORIGIN_DATA[selectedOrigin];
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Parse points to SVG coordinate strings
  // Let the graph SVG size be width=400, height=130 for a clean proportional box
  const width = 450;
  const height = 140;
  const paddingLeft = 32;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 22;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Max value for anxiety is 100, congestion is 100
  const getAnxietyCoords = () => {
    return data.anxietyIndex.map((val, i) => {
      const x = paddingLeft + (i / (data.anxietyIndex.length - 1)) * chartW;
      const y = paddingTop + chartH - (val / 100) * chartH;
      return { x, y, val };
    });
  };

  const getCongestionCoords = () => {
    return data.congestions.map((val, i) => {
      const x = paddingLeft + (i / (data.congestions.length - 1)) * chartW;
      const y = paddingTop + chartH - (val / 100) * chartH;
      return { x, y, val };
    });
  };

  const anxietyPoints = getAnxietyCoords();
  const congestionPoints = getCongestionCoords();

  // Create SVG path string
  const createPathD = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Smooth cubic curve transition
      const prev = points[i - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, '');
  };

  const createAreaD = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const pathD = createPathD(points);
    return `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;
  };

  const anxietyPath = createPathD(anxietyPoints);
  const anxietyArea = createAreaD(anxietyPoints);
  const congestionPath = createPathD(congestionPoints);

  // Identify peaks
  const maxAnxietyIndex = data.anxietyIndex.reduce((maxI, x, i, arr) => (x > arr[maxI] ? i : maxI), 0);
  const maxCongestionIndex = data.congestions.reduce((maxI, x, i, arr) => (x > arr[maxI] ? i : maxI), 0);

  // Dynamic explanations based on selection
  const getAnxietyPeakLabel = () => {
    switch (selectedOrigin) {
      case 'east':
        return '一栋中廊导视阴暗区 / 迷失风险高';
      case 'south':
        return '连廊高低台阶区 / 步行颠簸';
      case 'west':
        return '大门施工围挡区 / 噪声视线干扰';
      case 'north':
        return '绕行人流缓冲带 / 焦虑平稳';
      case 'north_side':
        return '实验室密封隔音重地 / 探索压抑感';
      default:
        return '复杂阶梯拐点';
    }
  };

  return (
    <section className="glass-panel rounded-md p-5 group transition-all duration-300 hover:border-[#00ff66]/25">
      {/* Visual cybernetic corner tech borders */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff66]/60" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff66]/60" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff66]/60" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff66]/60" />

      {/* Header index */}
      <div className="flex items-center justify-between border-b border-[#00ff66]/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00ff66]" />
          <h2 className="text-[13px] font-sans font-bold text-white tracking-widest uppercase">
            [02] 路径行为动态分析 / PATH ANALYSIS
          </h2>
        </div>
        <span className="text-[9px] font-mono text-gray-500 tracking-wider">
          FREQ: 50Hz
        </span>
      </div>

      {/* Small statistics display */}
      <div className="grid grid-cols-3 gap-2 mb-4 font-mono">
        <div className="border border-[#00ff66]/10 bg-[#0d0f12]/50 p-2 rounded-sm text-center">
          <div className="text-[9px] text-gray-500 uppercase">Est. Distance</div>
          <div className="text-sm font-bold text-white mt-0.5">{data.distance} m</div>
        </div>
        <div className="border border-[#00ff66]/10 bg-[#0d0f12]/50 p-2 rounded-sm text-center">
          <div className="text-[9px] text-gray-500 uppercase">Est. Duration</div>
          <div className="text-sm font-bold text-[#00ff66] mt-0.5">{data.baseTime} min</div>
        </div>
        <div className="border border-[#00ff66]/10 bg-[#0d0f12]/50 p-2 rounded-sm text-center">
          <div className="text-[9px] text-gray-500 uppercase">Avg. Heart Rate</div>
          <div className="text-sm font-bold text-white mt-0.5">78 bpm</div>
        </div>
      </div>

      {/* SVG Vector Chart Container */}
      <div className="relative w-full border border-[#00ff66]/10 bg-[#07090b]/80 rounded p-1 mb-3.5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = paddingTop + chartH - (level / 100) * chartH;
            return (
              <g key={level} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#00ff66"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  className="font-mono text-[8px] fill-gray-500 text-right"
                  textAnchor="end"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* X axis milestones */}
          {data.timePoints.map((tp, idx) => {
            const x = paddingLeft + (idx / (data.timePoints.length - 1)) * chartW;
            if (idx % 2 !== 0 && idx !== data.timePoints.length - 1) return null; // skip some for neatness
            return (
              <text
                key={idx}
                x={x}
                y={height - 6}
                className="font-mono text-[8.5px] fill-gray-400"
                textAnchor="middle"
              >
                {tp.toFixed(1)}m
              </text>
            );
          })}

          {/* Congestion path (Dashed Neon Line - Darker Cyan/Green) */}
          <path
            d={congestionPath}
            fill="none"
            stroke="#0088cc"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            className="opacity-70"
          />

          {/* Mental anxiety gradient fill */}
          <defs>
            <linearGradient id="anxietyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={anxietyArea} fill="url(#anxietyGrad)" />

          {/* Mental anxiety main solid fluorescent line */}
          <path
            d={anxietyPath}
            fill="none"
            stroke="#00ff66"
            strokeWidth="2"
            filter="drop-shadow(0px 0px 3px rgba(0,255,102,0.6))"
          />

          {/* Interactive hover guides */}
          {hoverIndex !== null && (
            <line
              x1={anxietyPoints[hoverIndex].x}
              y1={paddingTop}
              x2={anxietyPoints[hoverIndex].x}
              y2={paddingTop + chartH}
              stroke="#00ff66"
              strokeWidth="0.75"
              strokeDasharray="1 1"
            />
          )}

          {/* Interactive nodes and hover listeners */}
          {anxietyPoints.map((p, idx) => {
            const isHovered = hoverIndex === idx;
            return (
              <g key={idx}>
                <rect
                  x={p.x - 10}
                  y={paddingTop}
                  width="20"
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(idx)}
                />
                {(isHovered || idx === maxAnxietyIndex) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    fill={isHovered ? '#00ff66' : 'transparent'}
                    stroke="#00ff66"
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                )}
                {isHovered && (
                  <circle
                    cx={congestionPoints[idx].x}
                    cy={congestionPoints[idx].y}
                    r="4"
                    fill="#0088cc"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* Anxiety peak visual beacon alert */}
          <g transform={`translate(${anxietyPoints[maxAnxietyIndex].x}, ${anxietyPoints[maxAnxietyIndex].y - 12})`}>
            <circle r="2" fill="#ff3b30" className="animate-ping" />
            <line x1="0" y1="2" x2="0" y2="12" stroke="#ff3b30" strokeWidth="1" strokeDasharray="1 1" />
          </g>
        </svg>

        {/* Floating live indicator table for hover state */}
        <div className="absolute top-2 right-2 flex gap-4 font-mono text-[9px] bg-[#0d0f12]/90 border border-[#00ff66]/20 px-2 py-1 rounded-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] inline-block" />
            <span className="text-gray-400">焦虑:</span>
            <span className="text-[#00ff66] font-bold">
              {hoverIndex !== null ? data.anxietyIndex[hoverIndex] : data.anxietyIndex[maxAnxietyIndex]}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded bg-[#0088cc] inline-block" />
            <span className="text-gray-400">拥挤:</span>
            <span className="text-[#0088cc] font-bold">
              {hoverIndex !== null ? data.congestions[hoverIndex] : data.congestions[maxCongestionIndex]}%
            </span>
          </div>
        </div>
      </div>

      {/* Spatial Stress factor highlights */}
      <div className="border border-[#ff3b30]/25 bg-[#ff3b30]/5 rounded p-2.5 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[#ff3b30] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            高认知负荷路段警告 / SIGNAL WARNING
          </h4>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-sans">
            路径峰值出现于行程 <span className="text-[#ff3b30] font-mono">{(data.timePoints[maxAnxietyIndex]).toFixed(1)}分</span>。触发源：
            <span className="text-white font-medium">{getAnxietyPeakLabel()}</span>。此处多条指示线交汇混淆，建议开启楼梯侧向辅助采光。
          </p>
        </div>
      </div>
    </section>
  );
}
