import { AutoTexterJson, GeneratedMessage, ContactRow } from './types';

// Helper to normalize data from any source (CSV or Excel)
const normalizeRow = (row: any, headers: string[], values: string[]): ContactRow => {
  const normalized: ContactRow = { name: '', phone: '' };
  
  // If we have headers (CSV style or Excel JSON with keys)
  if (headers.length > 0) {
    headers.forEach((header, index) => {
       const key = header;
       const val = values[index] || '';
       normalized[key] = val;
       
       const lowerHeader = header.toLowerCase();
       if (lowerHeader.includes('name') && !normalized.name) normalized.name = val;
       else if ((lowerHeader.includes('phone') || lowerHeader.includes('cell') || lowerHeader.includes('mobile')) && !normalized.phone) normalized.phone = val;
    });
  }

  // Fallback: positional
  if (!normalized.name && values[0]) normalized.name = values[0];
  if (!normalized.phone && values[1]) normalized.phone = values[1];

  return normalized;
};

export const parseExcel = (data: ArrayBuffer): ContactRow[] => {
  // Access global XLSX from CDN
  const XLSX = (window as any).XLSX;
  if (!XLSX) {
    console.error("SheetJS not found");
    return [];
  }

  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert to JSON array of objects
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  
  return jsonData.map((row: any) => {
     const keys = Object.keys(row);
     const values = Object.values(row).map(v => String(v));
     return normalizeRow(row, keys, values);
  });
};

export const parseCSV = (content: string): ContactRow[] => {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    return normalizeRow({}, headers, values);
  });
};

export const generateJSON = (
  rows: ContactRow[], 
  template: string, 
  interval: number
): AutoTexterJson => {
  const messages: Record<string, GeneratedMessage> = {};
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp

  rows.forEach((row, index) => {
    // Interpolate variables
    let text = template;
    Object.keys(row).forEach(key => {
      // Escape special regex characters in the key just in case
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
      const regex = new RegExp(`{${safeKey}}`, 'gi');
      text = text.replace(regex, row[key]);
    });
    
    // Handle standard tokens if not caught by dynamic keys
    if (!text.includes(row.name)) text = text.replace(/{Name}/gi, row.name || 'there');
    if (!text.includes(row.phone)) text = text.replace(/{Phone Number}/gi, row.phone || '');
    
    // Cleanup unused tokens
    text = text.replace(/{.*?}/g, ''); 

    messages[index.toString()] = {
      id: index,
      status: 'pending',
      statusDetails: '',
      statusUpdatedTimestamp: timestamp + 31536000, 
      text: text,
      phoneNumbers: [row.phone.replace(/\D/g, '')]
    };
  });

  const now = new Date();
  const creationDate = now.toISOString().replace('T', ' ').split('.')[0];

  return {
    formatVersion: 1,
    creationDate,
    sendInterval: interval,
    messages
  };
};

export const formatTimeDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (h > 0) parts.push(`${h} hours`);
  if (m > 0) parts.push(`${m} minutes`);
  if (parts.length === 0) return 'less than 1 minute';
  return parts.join(', ');
};