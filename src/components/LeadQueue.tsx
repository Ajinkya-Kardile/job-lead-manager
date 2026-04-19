import React from 'react';
import { Briefcase, MapPin, Clock, Inbox, Building, CheckCircle2 } from 'lucide-react';
import { JobLead } from '../types';

interface LeadQueueProps {
    leads: JobLead[];
    activeLeadId: number | null;
    onSelectLead: (id: number) => void;
}

export default function LeadQueue({ leads, activeLeadId, onSelectLead }: LeadQueueProps) {
    const glassPane = "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-y-auto flex flex-col custom-scrollbar shadow-2xl";

    return (
        <aside className={`lg:col-span-3 ${glassPane}`}>
            <div className="flex items-center gap-2 mb-4 shrink-0 px-1">
                <Inbox size={18} className="text-gray-400" />
                <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Lead Queue</h2>
            </div>

            <div className="flex flex-col gap-3">
                {leads.map(lead => (
                    <div
                        key={lead.id}
                        onClick={() => lead.status === 1 && onSelectLead(lead.id)}
                        className={`
              p-4 rounded-xl border transition-all duration-200 cursor-pointer
              ${lead.status === 0 ? 'opacity-50 border-white/5 bg-transparent cursor-default' :
                            activeLeadId === lead.id ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
            `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-semibold ${lead.status === 0 ? 'text-gray-500' : 'text-gray-100'} line-clamp-1`}>
                                {lead.role}
                            </h3>
                            {lead.status === 0 && (
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            )}
                        </div>

                        <p className="text-sm text-indigo-300 font-medium mb-3 line-clamp-1 flex items-center gap-1.5">
                            <Building size={14} /> {lead.company !== 'Unknown' ? lead.company : 'Confidential'}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {lead.location}
              </span>
                            <span className="flex items-center gap-1">
                <Clock size={12} /> {lead.postedAt.split(' ')[1]}
              </span>
                        </div>
                    </div>
                ))}

                {leads.length === 0 && (
                    <div className="text-center p-8 text-gray-500 text-sm">
                        No leads in the database.
                    </div>
                )}
            </div>
        </aside>
    );
}
