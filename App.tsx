import React, { useState, useMemo } from 'react';
import { Platform, MultiNumberStrategy, ContactRow, GeneratedMessage } from './types';
import { generateJSON } from './utils';
import SettingsPanel from './components/SettingsPanel';
import TemplateEditor from './components/TemplateEditor';
import FileUploader from './components/FileUploader';
import PreviewList from './components/PreviewList';
import { Download, Code, Sparkles, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>(Platform.IMESSAGE);
  const [strategy, setStrategy] = useState<MultiNumberStrategy>(MultiNumberStrategy.INDIVIDUAL);
  const [interval, setInterval] = useState<number>(60);
  const [template, setTemplate] = useState<string>("Hi {Name}, sorry to take your time! I'm checking in regarding...");
  
  const [contactRows, setContactRows] = useState<ContactRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // State to control the workflow
  const [showPreview, setShowPreview] = useState(false);

  const handleDataLoaded = (data: ContactRow[], name: string) => {
    setContactRows(data);
    setFileName(name);
    setShowPreview(false); // Reset preview when new file is loaded
  };

  const handleClear = () => {
    setContactRows([]);
    setFileName(null);
    setShowPreview(false);
  };

  const handleGenerateClick = () => {
    if (contactRows.length > 0) {
      setShowPreview(true);
    }
  };

  // Generate previews in real-time or when generated
  const generatedData = useMemo(() => {
    if (!showPreview) return [];

    // If rows have a special _rawText key (from JSON import), use that instead of template
    const previewRows = contactRows.map(row => {
        if (row._rawText) {
             return {
                id: 0, 
                text: row._rawText,
                phoneNumbers: [row.phone],
                status: 'pending',
                statusDetails: '',
                statusUpdatedTimestamp: Date.now()
             } as GeneratedMessage;
        }
        return null;
    }).filter(Boolean) as GeneratedMessage[];

    if (previewRows.length > 0) {
        return previewRows;
    }

    // Normal generation from CSV/Excel + Template
    const result = generateJSON(contactRows, template, interval);
    return Object.values(result.messages).sort((a, b) => a.id - b.id);
  }, [contactRows, template, interval, showPreview]);

  const handleDownload = () => {
    if (generatedData.length === 0) return;
    
    // Final generation before download
    const fullJson = generateJSON(contactRows, template, interval);
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(fullJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? fileName.replace(/\.(csv|txt|json|xlsx|xls)/i, '_config.json') : 'autotexter_config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const availableVars = useMemo(() => {
    if (contactRows.length === 0) return [];
    return Object.keys(contactRows[0]).filter(k => k !== '_rawText');
  }, [contactRows]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <Code className="text-white" size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AutoTexter Studio</h1>
            <p className="text-slate-400 text-sm">Reverse-engineered automation configurator</p>
        </div>
      </header>

      <SettingsPanel
        platform={platform}
        setPlatform={setPlatform}
        strategy={strategy}
        setStrategy={setStrategy}
        interval={interval}
        setInterval={setInterval}
      />

      <TemplateEditor 
        template={template}
        setTemplate={setTemplate}
        availableVariables={availableVars}
      />

      <FileUploader 
        onDataLoaded={handleDataLoaded}
        fileName={fileName}
        onClear={handleClear}
      />

      {/* Generation Trigger Button */}
      {contactRows.length > 0 && !showPreview && (
        <div className="flex justify-center my-12 animate-in zoom-in duration-300">
           <button 
             onClick={handleGenerateClick}
             className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
           >
             <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
             <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
             GENERATE IMESSAGE TEXTS
           </button>
        </div>
      )}

      {/* Results View */}
      {showPreview && (
        <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-500 mt-12">
           <PreviewList messages={generatedData} interval={interval} />

          <div className="flex justify-center pb-8">
            <button
                onClick={handleDownload}
                className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold transition-all hover:scale-105 active:scale-95 border border-violet-400/20"
            >
                <Download size={24} />
                <span>Download Payload JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;