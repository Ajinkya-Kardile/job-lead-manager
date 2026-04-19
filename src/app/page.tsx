'use client';

import React, {useState, useEffect} from 'react';
import {Send, Loader2, ServerCrash} from 'lucide-react';
import {JobLead} from '@/types';
import LeadQueue from '../components/LeadQueue';
import JobDetails from '../components/JobDetails';
import DraftEditor from '../components/DraftEditor';

export default function JobApplicationManager() {
    const [leads, setLeads] = useState<JobLead[]>([]);
    const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetching Leads API
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/leads/pending');
                if (response.ok) {
                    const data = await response.json();
                    setLeads(data);
                    setError(null);
                } else {
                    setError(`Failed to fetch leads: HTTP ${response.status}`);
                    console.error('Server returned an error.');
                }
            } catch (err) {
                console.error('Error fetching leads:', err);
                setError('Could not connect to the backend server.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const pendingLeads = leads.filter(l => l.status === 1);
    const activeLeadId = selectedLeadId ?? (pendingLeads.length > 0 ? pendingLeads[0].id : null);
    const selectedLead = leads.find(l => l.id === activeLeadId) || null;

    // Utility to determine the next lead to select after action
    const selectNextLead = (currentLeadId: number) => {
        const currentIndex = pendingLeads.findIndex(l => l.id === currentLeadId);
        let nextLeadId = null;

        if (currentIndex !== -1 && currentIndex + 1 < pendingLeads.length) {
            nextLeadId = pendingLeads[currentIndex + 1].id;
        } else {
            const fallback = pendingLeads.find(l => l.id !== currentLeadId);
            if (fallback) nextLeadId = fallback.id;
        }

        setSelectedLeadId(nextLeadId);
    }

    // 2. Dispatching Application API
    const handleSendApplication = async (leadId: number, payload: { to: string, subject: string, body: string }) => {
        try {
            const response = await fetch('http://localhost:8080/api/leads/send', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: leadId, ...payload})
            });

            if (response.ok) {
                selectNextLead(leadId);
                // Mark as sent (0)
                setLeads(prev => prev.map(lead =>
                    lead.id === leadId ? {...lead, status: 0} : lead
                ));
            } else {
                alert('Failed to send the application. Check backend logs.');
            }
        } catch (err) {
            console.error('Error sending the application:', err);
            alert('Network error while sending application.');
        }
    };

    // 3. Rejecting Lead API
    const handleRejectApplication = async (leadId: number) => {
        try {
            const response = await fetch('http://localhost:8080/api/leads/reject', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: leadId}) // Sending the ID to a reject endpoint
            });

            if (response.ok) {
                selectNextLead(leadId);
                // Mark as rejected (2)
                setLeads(prev => prev.map(lead =>
                    lead.id === leadId ? {...lead, status: 2} : lead
                ));
            } else {
                alert('Failed to reject the lead. Check backend logs.');
            }
        } catch (err) {
            console.error('Error rejecting the lead:', err);
            alert('Network error while rejecting lead.');
        }
    };

    const glassPane = "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-y-auto flex flex-col custom-scrollbar shadow-2xl";

    // Error State UI
    if (error) {
        return (
            <div
                className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-red-400 gap-4 p-6 text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-2">
                    <ServerCrash size={48}/>
                </div>
                <h2 className="text-xl font-bold text-white">Connection Error</h2>
                <p className="text-sm max-w-md leading-relaxed">{error}</p>

            </div>
        );
    }

    // Loading State UI
    if (isLoading) {
        return (
            <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-indigo-500 gap-4">
                <Loader2 className="animate-spin" size={40}/>
                <p className="text-gray-400 text-sm font-medium tracking-wide">Loading Lead Queue...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#0a0a0a] text-gray-100 p-4 lg:p-6 flex flex-col gap-6 font-sans overflow-hidden">
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
      `}</style>

            <header
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 px-6 flex justify-between items-center shadow-lg shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                        <Send size={24}/>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-white">Application Manager</h1>
                        <p className="text-xs text-gray-400">Outbound Job Pipeline</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <span className="text-sm text-gray-400 font-medium">Pending Leads:</span>
                    <span className="bg-indigo-500 text-white text-sm font-bold px-3 py-0.5 rounded-full">
            {pendingLeads.length}
          </span>
                </div>
            </header>

            <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Queue */}
                <LeadQueue leads={leads} activeLeadId={activeLeadId} onSelectLead={setSelectedLeadId}/>

                {/* Middle Detail View */}
                <JobDetails selectedLead={selectedLead}/>

                {/* Right Editor View */}
                <section className={`lg:col-span-5 ${glassPane}`}>
                    <div className="flex items-center gap-2 mb-4 shrink-0 px-1 border-b border-white/10 pb-4">
                        <Send size={18} className="text-gray-400"/>
                        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Draft
                            Application</h2>
                    </div>

                    {selectedLead ? (
                        <DraftEditor
                            key={selectedLead.id}
                            lead={selectedLead}
                            onSend={handleSendApplication}
                            onReject={handleRejectApplication}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <p>Awaiting selection...</p>
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}
