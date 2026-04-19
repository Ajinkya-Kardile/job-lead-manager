'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Send, Inbox, Building, Loader2, CheckCircle2, User } from 'lucide-react';

// --- Data Models ---
interface JobLead {
    id: number;
    name: string | null;
    email: string;
    content: string;
    postedAt: string;
    role: string;
    location: string;
    company: string;
    status: number; // 1 = Pending, 0 = Applied
}

// --- Initial Mock Data (Simulating your MySQL -> Spring Boot output) ---
const INITIAL_LEADS: JobLead[] = [
    {
        id: 1,
        name: 'Chitra Sharma',
        email: 'head@spenterprises.cloud',
        role: 'Senior SDET',
        location: 'Pune',
        company: 'Talentola',
        status: 1,
        postedAt: '2026-04-19 09:40',
        content: 'We’re #Hiring in Pune | Azure DevOps Developer & Java Developer\n' +
            ' \n' +
            ' We’re looking for experienced tech professionals ready to take on exciting opportunities and work on impactful projects. If you’re looking for your next move, we’d love to connect.\n' +
            ' \n' +
            ' 🔹 Open Positions:\n' +
            ' Azure DevOps Developer\n' +
            ' ✔ Experience: 4+ Years\n' +
            ' 💰 Salary: ₹12 LPA – ₹18 LPA\n' +
            ' Java Developer\n' +
            ' ✔ Experience: 4–6 Years\n' +
            ' 💰 Salary: ₹12 LPA – ₹15 LPA\n' +
            ' 📍 Location: Pune\n' +
            ' \n' +
            ' 📩 Send your CV to: head@spenterprises.cloud\n' +
            ' \n' +
            ' 📞 Contact: +91 8263814071\n' +
            ' \n' +
            ' Know someone who fits? Tag them or share this post.\n' +
            ' \n' +
            ' Charges Apply.\n' +
            ' #WeAreHiring #AzureDevOps #AzureDevOpsJobs #JavaDeveloper #JavaJobs #DevOpsEngineer #HiringNow'
    },
    {
        id: 2,
        name: 'Dhruv Gupta',
        email: 'dhruvgupta@albireorecruiters.in',
        role: 'Java Developer',
        location: 'INDIA',
        company: 'Albireorecruiters',
        status: 1,
        postedAt: '2026-04-19 09:41',
        content: '🚨 🔥 PAN-INDIA TECH MEGA DRIVE: Java/Microservices/Snowflake/PLSQL/Big Data/DevOps | 5–15 Yrs 🔥🚨\n\nTech Hiring Drive Across Multiple Locations: Hyderabad, Pune, Bangalore.\n\nWe are seeking senior backend engineers to help scale our distributed systems and build highly concurrent applications.'
    },
    {
        id: 3,
        name: 'Avantika Virdikar',
        email: 'swiftavantika14@gmail.com',
        role: 'Java Full-Stack Developer',
        location: 'Pune',
        company: 'Unknown',
        status: 1,
        postedAt: '2026-04-19 09:41',
        content: '🚀 Hiring: Java Full-Stack Developer | Pune (On-site)\n\nWe are looking for a Java Full-Stack Developer with 1–2 years of experience to work on a scalable SaaS platform. Offered CTC : 4 LPA - 6 LPA.\n\nMandatory: Experience in ERP / CRM / SaaS products, Java 17+, Spring Boot, and modern frontend frameworks.'
    }
];

export default function JobApplicationManager() {
    const [leads, setLeads] = useState<JobLead[]>(INITIAL_LEADS);
    const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

    // Derived state
    const pendingLeads = leads.filter(l => l.status === 1);
    const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

    // Auto-select first pending lead on initial load or if none is selected
    useEffect(() => {
        if (selectedLeadId === null && pendingLeads.length > 0) {
            setSelectedLeadId(pendingLeads[0].id);
        }
    }, [pendingLeads, selectedLeadId]);

    // Glassmorphism styling utility
    const glassPane = "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-y-auto flex flex-col custom-scrollbar shadow-2xl";

    const handleSendApplication = (leadId: number) => {
        // Find next lead in the queue to prevent UI flicker
        const currentIndex = pendingLeads.findIndex(l => l.id === leadId);
        let nextLeadId = null;

        if (currentIndex !== -1 && currentIndex + 1 < pendingLeads.length) {
            nextLeadId = pendingLeads[currentIndex + 1].id;
        } else {
            // Fallback to the first available lead that isn't the one we just sent
            const fallback = pendingLeads.find(l => l.id !== leadId);
            if (fallback) nextLeadId = fallback.id;
        }

        // In real app: POST /api/leads/send -> then update UI
        setLeads(prev => prev.map(lead =>
            lead.id === leadId ? { ...lead, status: 0 } : lead
        ));

        setSelectedLeadId(nextLeadId); // Auto-select the next lead
    };

    return (
        <div className="h-screen bg-[#0a0a0a] text-gray-100 p-4 lg:p-6 flex flex-col gap-6 font-sans overflow-hidden">
            {/* --- Global CSS for Custom Scrollbar --- */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
      `}</style>

            {/* --- Header --- */}
            <header className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 px-6 flex justify-between items-center shadow-lg shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                        <Send size={24} />
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

            {/* --- Main 3-Pane Grid --- */}
            <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* PANE 1: Lead Queue (Left) */}
                <aside className={`lg:col-span-3 ${glassPane}`}>
                    <div className="flex items-center gap-2 mb-4 shrink-0 px-1">
                        <Inbox size={18} className="text-gray-400" />
                        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Lead Queue</h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {leads.map(lead => (
                            <div
                                key={lead.id}
                                onClick={() => lead.status === 1 && setSelectedLeadId(lead.id)}
                                className={`
                  p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${lead.status === 0 ? 'opacity-50 border-white/5 bg-transparent cursor-default' :
                                    selectedLeadId === lead.id ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
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

                {/* PANE 2: Job Details (Middle) */}
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

                {/* PANE 3: Draft Application Editor (Right) */}
                <section className={`lg:col-span-5 ${glassPane}`}>
                    <div className="flex items-center gap-2 mb-4 shrink-0 px-1 border-b border-white/10 pb-4">
                        <Send size={18} className="text-gray-400" />
                        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Draft Application</h2>
                    </div>

                    {selectedLead ? (
                        <DraftEditor lead={selectedLead} onSend={handleSendApplication} />
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

// --- Sub-Component: Email Draft Editor ---
function DraftEditor({ lead, onSend }: { lead: JobLead; onSend: (id: number) => void }) {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Re-run template generation when a new lead is selected
    useEffect(() => {
        const hrName = lead.name && lead.name !== 'Unknown' ? lead.name : 'Hiring Team';
        const companyName = lead.company && lead.company !== 'Unknown' ? lead.company : 'your company';

        setTo(lead.email);
        setSubject(`Application for ${lead.role} position`);
        setBody(`Hi ${hrName},\n\nI am writing to express my interest in the ${lead.role} position at ${companyName}. As a developer based in Pune specializing in Java 17+, Spring Boot, and scalable systems, I believe I would be a strong fit for your team. I recently built a real-time AI-powered application named Talentiv, and I am eager to bring similar problem-solving skills to your engineering department.\n\nPlease find my resume attached.\n\nBest regards,\nAjinkya Kardile`);
    }, [lead]);

    const handleSend = () => {
        setIsSending(true);
        // Simulate network delay for API Call
        setTimeout(() => {
            onSend(lead.id);
            setIsSending(false);
        }, 800);
    };

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600";

    return (
        <div className="flex flex-col h-full gap-4">

            {/* Form Fields */}
            <div className="space-y-3 shrink-0">
                <div className="flex items-center">
                    <label className="w-16 text-xs font-semibold text-gray-400 uppercase tracking-wider">To</label>
                    <input type="email" value={to} onChange={e => setTo(e.target.value)} className={inputClass} placeholder="hr@company.com" />
                </div>
                <div className="flex items-center">
                    <label className="w-16 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sub</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} placeholder="Application Subject" />
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex flex-col min-h-0">
        <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className={`flex-1 resize-none p-4 custom-scrollbar leading-relaxed ${inputClass}`}
            placeholder="Write your cover letter here..."
        />
            </div>

            {/* Footer / Send Action */}
            <div className="shrink-0 pt-2 flex items-center justify-between border-t border-white/10 mt-2">
                <div className="text-xs text-gray-500">
                    * Resume.pdf will be automatically attached by the backend.
                </div>
                <button
                    onClick={handleSend}
                    disabled={isSending}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isSending ? 'Sending...' : 'Send Application'}
                </button>
            </div>
        </div>
    );
}