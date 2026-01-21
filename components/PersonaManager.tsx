
import React, { useState, useEffect } from 'react';
import { SavedPersona, Language } from '../types';

interface Props {
  currentProfile: string;
  onSelect: (handle: string) => void;
  language: Language;
}

const PersonaManager: React.FC<Props> = ({ currentProfile, onSelect, language }) => {
  const [personas, setPersonas] = useState<SavedPersona[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const labels = {
    EN: { title: 'PERSONA_DB', add: '+ SAVE CURRENT', empty: 'NO_DATA', placeholder: 'Persona Name (e.g. Angry CEO)', delete: 'DEL', load: 'LOAD' },
    TR: { title: 'KİMLİK_VERİTABANI', add: '+ KAYDET', empty: 'VERİ_YOK', placeholder: 'Kimlik Adı (örn: Agresif CEO)', delete: 'SİL', load: 'YÜKLE' }
  }[language];

  useEffect(() => {
    const saved = localStorage.getItem('X_ALGO_PERSONAS');
    if (saved) {
      setPersonas(JSON.parse(saved));
    }
  }, []);

  const savePersona = () => {
    if (!newName.trim() || !currentProfile.trim()) return;
    const newPersona: SavedPersona = {
      id: Date.now().toString(),
      name: newName,
      handle: currentProfile
    };
    const updated = [...personas, newPersona];
    setPersonas(updated);
    localStorage.setItem('X_ALGO_PERSONAS', JSON.stringify(updated));
    setNewName('');
    setIsAdding(false);
  };

  const deletePersona = (id: string) => {
    const updated = personas.filter(p => p.id !== id);
    setPersonas(updated);
    localStorage.setItem('X_ALGO_PERSONAS', JSON.stringify(updated));
  };

  return (
    <div className="mb-4 bg-zinc-950 border border-zinc-800 p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] text-matrix-dim uppercase font-bold tracking-widest">{labels.title}</span>
        {currentProfile && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="text-[9px] text-matrix-green border border-matrix-green/30 px-2 py-0.5 hover:bg-matrix-green hover:text-black uppercase"
          >
            {labels.add}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-3">
           <input 
             type="text" 
             value={newName} 
             onChange={(e) => setNewName(e.target.value)} 
             placeholder={labels.placeholder}
             className="flex-1 bg-black border border-zinc-700 text-white text-[10px] p-1 outline-none focus:border-matrix-green font-mono"
           />
           <button onClick={savePersona} className="bg-matrix-green text-black text-[10px] font-bold px-2 uppercase">OK</button>
           <button onClick={() => setIsAdding(false)} className="text-zinc-500 text-[10px] uppercase">X</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {personas.length === 0 && <span className="text-[9px] text-zinc-700 italic">{labels.empty}</span>}
        {personas.map(p => (
          <div key={p.id} className="group flex items-center bg-black border border-zinc-800 hover:border-matrix-green/50 transition-colors">
            <button 
                onClick={() => onSelect(p.handle)} 
                className="px-2 py-1 text-[9px] text-zinc-300 hover:text-white font-mono uppercase border-r border-zinc-800 group-hover:border-matrix-green/30"
            >
                {p.name}
            </button>
            <button 
                onClick={() => deletePersona(p.id)} 
                className="px-1.5 py-1 text-[9px] text-zinc-600 hover:text-red-500 font-bold"
            >
                ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaManager;
