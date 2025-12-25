import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, X, RotateCcw, FileType } from 'lucide-react';
import { ContactRow } from '../types';
import { parseCSV, parseExcel } from '../utils';

interface FileUploaderProps {
  onDataLoaded: (data: ContactRow[], fileName: string) => void;
  fileName: string | null;
  onClear: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded, fileName, onClear }) => {
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Handle Excel
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data instanceof ArrayBuffer) {
           try {
             const rows = parseExcel(data);
             onDataLoaded(rows, file.name);
           } catch (err) {
             console.error(err);
             alert("Error parsing Excel file");
           }
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle Text/CSV/JSON
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        if (content.trim().startsWith('{')) {
            try {
                const json = JSON.parse(content);
                if (json.messages) {
                    const rows: ContactRow[] = Object.values(json.messages).map((m: any) => ({
                        name: "Imported Contact",
                        phone: m.phoneNumbers[0],
                        _rawText: m.text
                    }));
                    onDataLoaded(rows, file.name);
                }
            } catch (err) {
                alert("Invalid JSON file");
            }
        } else {
            const rows = parseCSV(content);
            onDataLoaded(rows, file.name);
        }
      };
      reader.readAsText(file);
    }
  }, [onDataLoaded]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
        {!fileName ? (
            <div 
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 bg-slate-900/30 hover:bg-slate-800/50 hover:border-slate-500 transition-all text-center group"
            >
                <input
                    type="file"
                    id="fileInput"
                    accept=".csv,.json,.txt,.xlsx,.xls"
                    onChange={onInputChange}
                    className="hidden"
                />
                <label 
                    htmlFor="fileInput"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded hover:bg-cyan-400 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
                >
                    <Upload size={20} />
                    UPLOAD FILE
                </label>
                <div className="mt-4 text-slate-500 text-sm">
                    <span className="bg-slate-800 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs border border-slate-600 mr-2">?</span>
                    Drag and drop Excel (.xlsx) or CSV file
                </div>
            </div>
        ) : (
            <div className="relative border border-dashed border-slate-600 rounded-lg p-6 bg-slate-900/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded flex items-center justify-center">
                        {fileName.endsWith('.csv') ? <FileSpreadsheet size={24} /> : <FileType size={24} />}
                     </div>
                     <div>
                         <h3 className="text-slate-200 font-medium">{fileName}</h3>
                         <p className="text-slate-500 text-xs">Ready for processing</p>
                     </div>
                </div>
                
                <div className="flex items-center">
                    <button 
                        onClick={onClear}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove file"
                    >
                        <X size={20} />
                    </button>
                    <div className="ml-4 h-full border-l border-slate-700 pl-4 flex flex-col items-center justify-center text-cyan-400">
                         <span className="text-[10px] font-bold tracking-wider mb-1">RECENT</span>
                         <RotateCcw size={18} />
                    </div>
                </div>

                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-600 flex items-center gap-2">
                    {fileName} <button onClick={onClear}><X size={12} /></button>
                </div>
            </div>
        )}
    </div>
  );
};

export default FileUploader;