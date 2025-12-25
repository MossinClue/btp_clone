import React from 'react';
import { Platform, MultiNumberStrategy } from '../types';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface SettingsPanelProps {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  strategy: MultiNumberStrategy;
  setStrategy: (s: MultiNumberStrategy) => void;
  interval: number;
  setInterval: (i: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  platform,
  setPlatform,
  strategy,
  setStrategy,
  interval,
  setInterval
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 transition-colors"
      >
        <h2 className="text-lg font-medium text-slate-100">Settings for Sending</h2>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-700 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Dropdowns */}
            <div className="space-y-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-slate-800 px-1 text-xs text-slate-400">
                  Texting Platform
                </label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full bg-transparent border border-slate-600 rounded-md py-3 px-4 text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 appearance-none cursor-pointer"
                  >
                    {Object.values(Platform).map((p) => (
                      <option key={p} value={p} className="bg-slate-800">{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-slate-800 px-1 text-xs text-cyan-400 font-medium">
                  Handling multiple phone numbers per row
                </label>
                <div className="relative">
                  <select
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value as MultiNumberStrategy)}
                    className="w-full bg-transparent border-2 border-cyan-500/30 rounded-md py-3 px-4 text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                  >
                    {Object.values(MultiNumberStrategy).map((s) => (
                      <option key={s} value={s} className="bg-slate-800">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Right Column: Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400">Delay Interval</span>
                <span className="text-sm font-bold text-violet-400">{interval} seconds</span>
              </div>
              <div className="relative w-full h-8 flex items-center">
                {/* Custom Track Background */}
                <div className="absolute w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500" 
                    style={{ width: `${(interval / 300) * 100}%` }}
                  />
                </div>
                {/* Ticks */}
                <div className="absolute w-full flex justify-between px-1 pointer-events-none">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className={`w-0.5 h-1 ${i % 5 === 0 ? 'bg-slate-500 h-2' : 'bg-slate-600'}`}></div>
                  ))}
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="relative w-full z-10 opacity-100" // Opacity needs to be handled by custom css in index.html for thumb
                />
              </div>
              <div className="text-center mt-3 text-sm text-slate-300 italic flex items-center justify-center gap-2">
                 <Clock size={14} />
                 Delay <span className="font-bold text-white">{Math.round(interval / 60 * 10) / 10} minutes</span> between texts
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default SettingsPanel;