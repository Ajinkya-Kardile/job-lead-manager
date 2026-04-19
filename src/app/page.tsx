'use client';

import React, {useState} from 'react';
import {Send} from 'lucide-react';
import {JobLead} from '@/types';
import LeadQueue from '../components/LeadQueue';
import JobDetails from '../components/JobDetails';
import DraftEditor from '../components/DraftEditor';

const INITIAL_LEADS: JobLead[] = [
    {
        id: 1,
        name: 'Chitra Sharma',
        email: 'Chitra.Sharma@TalentOla.com',
        role: 'Senior SDET',
        location: 'Pune',
        company: 'Talentola',
        status: 1,
        postedAt: '2026-04-19 09:40',
        content: 'We are looking for an experienced Senior Software Development Engineer in Test (SDET) with strong expertise in Selenium, TestNG, Cucumber, Rest Assured & CI/CD pipelines.\n\nYou will be responsible for building automated test suites, analyzing system performance, and ensuring the delivery of high-quality software.'
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

    const pendingLeads = leads.filter(l => l.status === 1);
    const activeLeadId = selectedLeadId ?? (pendingLeads.length > 0 ? pendingLeads[0].id : null);
    const selectedLead = leads.find(l => l.id === activeLeadId) || null;

    const handleSendApplication = (leadId: number) => {
        const currentIndex = pendingLeads.findIndex(l => l.id === leadId);
        let nextLeadId = null;

        if (currentIndex !== -1 && currentIndex + 1 < pendingLeads.length) {
            nextLeadId = pendingLeads[currentIndex + 1].id;
        } else {
            const fallback = pendingLeads.find(l => l.id !== leadId);
            if (fallback) nextLeadId = fallback.id;
        }

        setLeads(prev => prev.map(lead =>
            lead.id === leadId ? {...lead, status: 0} : lead
        ));

        setSelectedLeadId(nextLeadId);
    };

    const glassPane = "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-y-auto flex flex-col custom-scrollbar shadow-2xl";

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
                        <DraftEditor key={selectedLead.id} lead={selectedLead} onSend={handleSendApplication}/>
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