import React, { useEffect, useState, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalOutputProps {
  logs: LogEntry[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-full bg-black/80 border border-matrix-darkGreen p-4 h-64 overflow-y-auto font-mono text-sm shadow-[0_0_10px_rgba(0,255,65,0.2)]">
      {logs.map((log) => (
        <div key={log.id} className="mb-1 text-matrix-green break-words">
          <span className="text-matrix-dim mr-2">[{log.timestamp}]</span>
          <span>{`> ${log.message}`}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalOutput;