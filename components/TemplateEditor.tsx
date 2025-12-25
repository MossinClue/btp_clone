import React from 'react';
import { RotateCcw } from 'lucide-react';

interface TemplateEditorProps {
  template: string;
  setTemplate: (t: string) => void;
  availableVariables: string[];
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  setTemplate,
  availableVariables
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertVariable = (variable: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = template;
    const newText = text.substring(0, start) + `{${variable}}` + text.substring(end);
    
    setTemplate(newText);
    
    // Restore focus and move cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
      }
    }, 0);
  };

  const defaultVars = ['Name', 'Phone Number', 'City', 'Message'];
  const displayVars = availableVariables.length > 0 ? availableVariables : defaultVars;

  return (
    <div className="space-y-2 mb-6">
      <div className="relative">
        <label className="absolute -top-2.5 left-3 bg-[#0f172a] px-1 text-xs text-slate-400 z-10">
          Message
        </label>
        <div className="flex bg-transparent">
          <textarea
            ref={textareaRef}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-l-md p-4 text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 min-h-[120px] resize-y font-mono text-sm leading-relaxed"
            placeholder="Type your message here..."
          />
          <button 
            className="w-24 bg-slate-800 border-y border-r border-slate-700 rounded-r-md flex flex-col items-center justify-center text-cyan-400 hover:text-cyan-300 hover:bg-slate-750 transition-colors"
            title="Reset to Recent"
          >
             <span className="text-[10px] font-bold tracking-wider mb-1">RECENT</span>
             <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <p className="text-sm text-slate-300">
          You can add these fields to your message to use the corresponding value from your CSV:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {displayVars.map((v) => (
            <button
              key={v}
              onClick={() => insertVariable(v)}
              className="px-3 py-1 rounded bg-slate-800 border border-slate-600 text-cyan-400 hover:bg-slate-700 hover:border-cyan-500 transition-colors text-sm font-medium font-mono"
            >
              {`{${v}}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;