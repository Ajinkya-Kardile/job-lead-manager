import React from 'react';
import { MapPin, Clock, Inbox, Building, User } from 'lucide-react';
import { JobLead } from '../types';

interface JobDetailsProps {
    selectedLead: JobLead | null;
}

export default function JobDetails({ selectedLead }: JobDetailsProps) {
    const glassPane = "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-y-auto flex flex-col custom-scrollbar shadow-2xl";

    return (
        <section className={`lg:col-span-4 ${glassPane} hidden lg:flex`}>
            <div className="flex items-center gap-2 mb-4 shrink-0 px-1 border-b border-white/10 pb-4">
                <Building size={18} className="text-gray-400" />
                <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Post Details</h2>
            </div>

            {selectedLead ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedLead.role}</h2>
                        <p className="text-lg text-indigo-400">{selectedLead.company !== 'Unknown' ? selectedLead.company : 'Confidential Company'}</p>
                        <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-400">
              <span className="bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5 flex items-center gap-1.5">
                <User size={14} className="text-gray-500" />
                  {selectedLead.name && selectedLead.name !== 'Unknown' ? selectedLead.name : 'Hiring Team'}
              </span>
                            <span className="bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5 flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-500" />
                                {selectedLead.location}
              </span>
                            <span className="bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5 flex items-center gap-1.5">
                <Clock size={14} className="text-gray-500" />
                Posted: {selectedLead.postedAt}
              </span>
                        </div>
                    </div>

                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedLead.content}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                    <Inbox size={48} className="mb-4" />
                    <p>Select a pending lead to view details.</p>
                </div>
            )}
        </section>
    );
}
