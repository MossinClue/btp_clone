import React from 'react';
import { GeneratedMessage } from '../types';
import { formatTimeDuration } from '../utils';

interface PreviewListProps {
  messages: GeneratedMessage[];
  interval: number;
}

const PreviewList: React.FC<PreviewListProps> = ({ messages, interval }) => {
  if (messages.length === 0) return null;

  const totalTime = messages.length * interval;
  const intervalMinutes = Math.round(interval / 60 * 10) / 10;
  const intervalText = intervalMinutes === 1 ? '1 minute' : `${intervalMinutes} minutes`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-medium text-white">Preview of texts that will be sent</h3>
        <p className="text-slate-300 text-sm">
          You chose a delay of <span className="font-bold text-white">{intervalText}</span> from when one text finishes to when the next one begins sending.
        </p>
        <p className="text-slate-300 text-sm">
           These texts will take about <span className="font-bold text-white">~{formatTimeDuration(totalTime)}</span> to send in full.
        </p>
      </div>

      <div className="border border-slate-700 rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm shadow-2xl">
        {/* Table Header */}
        <div className="flex items-center border-b border-slate-700 bg-[#0f1115] px-0 py-3">
          <div className="w-[180px] md:w-[220px] px-6 text-slate-400 text-sm font-medium border-r border-slate-700/50">
            Phone Number
          </div>
          <div className="flex-1 px-6 text-slate-400 text-sm font-medium">
            Text
          </div>
        </div>

        {/* Table Body */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar bg-black/20">
          {messages.map((msg, i) => (
            <div key={i} className="flex border-b border-slate-800 last:border-0 hover:bg-white/5 transition-colors group">
              <div className="w-[180px] md:w-[220px] flex-shrink-0 p-6 text-slate-200 font-mono text-sm border-r border-slate-800 group-hover:border-slate-700/50 transition-colors flex items-start">
                {msg.phoneNumbers.join(', ')}
              </div>
              <div className="flex-1 p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f1115; 
          border-left: 1px solid #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155; 
          border-radius: 5px;
          border: 2px solid #0f1115;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569; 
        }
      `}</style>
    </div>
  );
};

export default PreviewList;