import React, {useState} from 'react';
import {Send, Loader2, Settings2, Trash2} from 'lucide-react';
import {JobLead} from '@/types';
import {generateSubject, generateTemplate} from '@/utils/mailTemplate';

interface DraftEditorProps {
    lead: JobLead;
    onSend: (id: number, payload: { to: string, subject: string, body: string }) => Promise<void>;
    onReject: (id: number) => Promise<void>;
}

export default function DraftEditor({lead, onSend, onReject}: DraftEditorProps) {
    const [isSending, setIsSending] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const [useRecruiterName, setUseRecruiterName] = useState(true);
    const [useCompanyName, setUseCompanyName] = useState(true);
    const [useJobRole, setUseJobRole] = useState(true);

    const [to, setTo] = useState(lead.email);
    const [subject, setSubject] = useState(generateSubject(lead, true));
    const [body, setBody] = useState(generateTemplate(lead, true, true, true));

    const handleNameToggle = (checked: boolean) => {
        setUseRecruiterName(checked);
        setBody(generateTemplate(lead, checked, useCompanyName, useJobRole));
    };

    const handleCompanyToggle = (checked: boolean) => {
        setUseCompanyName(checked);
        setBody(generateTemplate(lead, useRecruiterName, checked, useJobRole));
    };

    const handleRoleToggle = (checked: boolean) => {
        setUseJobRole(checked);
        setSubject(generateSubject(lead, checked));
        setBody(generateTemplate(lead, useRecruiterName, useCompanyName, checked));
    };

    const handleSend = async () => {
        setIsSending(true);
        try {
            await onSend(lead.id, {to, subject, body});
        } catch (error) {
            console.error("Error during submission:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try {
            await onReject(lead.id);
        } catch (error) {
            console.error("Error during rejection:", error);
        } finally {
            setIsRejecting(false);
        }
    };

    // --- Dynamic Highlighting Logic ---
    const getHighlightedBody = () => {
        // Escape HTML to prevent injection
        let html = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const terms = [];
        if (useRecruiterName && lead.name && lead.name !== 'Unknown') terms.push(lead.name);
        else terms.push('Hiring Team');

        if (useCompanyName && lead.company && lead.company !== 'Unknown') terms.push(lead.company);
        else terms.push('your company');

        if (useJobRole && lead.role) terms.push(lead.role);
        else terms.push('open');

        // Remove duplicates and sort by length descending to prevent partial replacements
        const uniqueTerms = Array.from(new Set(terms)).sort((a, b) => b.length - a.length);

        uniqueTerms.forEach(term => {
            if (term.length > 2) {
                const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedTerm})`, 'g');
                // Wrap found terms in an indigo highlight
                html = html.replace(regex, `<mark class="bg-indigo-500/40 text-indigo-100 rounded-sm px-0.5">$1</mark>`);
            }
        });

        if (html.endsWith('\n')) html += '<br/>'; // Maintain scroll height accurately
        return html;
    };

    // Sync scroll between the invisible textarea and the highlight backdrop
    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        const backdrop = e.currentTarget.previousElementSibling as HTMLDivElement;
        if (backdrop) {
            backdrop.scrollTop = e.currentTarget.scrollTop;
        }
    };

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600";
    const textAreaLayoutClass = "absolute inset-0 w-full h-full p-4 text-sm leading-relaxed whitespace-pre-wrap break-words";

    const disableActions = isSending || isRejecting;

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Form Fields */}
            <div className="space-y-2.5 shrink-0">
                <div className="flex items-center">
                    <label className="w-12 text-xs font-semibold text-gray-400 uppercase tracking-wider">To</label>
                    <input type="email" value={to} onChange={e => setTo(e.target.value)} className={inputClass}
                           placeholder="hr@company.com" disabled={disableActions}/>
                </div>
                <div className="flex items-center">
                    <label className="w-12 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sub</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className={inputClass}
                           placeholder="Application Subject" disabled={disableActions}/>
                </div>
            </div>

            {/* Template Options Bar */}
            <div
                className="flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-5 px-1 pt-1 pb-1 border-t border-white/5 mt-1 shrink-0">
                <div
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <Settings2 size={14}/> Template Settings
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <label
                        className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" disabled={disableActions} checked={useRecruiterName}
                               onChange={e => handleNameToggle(e.target.checked)}
                               className="w-3.5 h-3.5 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer disabled:opacity-50"/>
                        Include Name
                    </label>
                    <label
                        className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" disabled={disableActions} checked={useCompanyName}
                               onChange={e => handleCompanyToggle(e.target.checked)}
                               className="w-3.5 h-3.5 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer disabled:opacity-50"/>
                        Include Company
                    </label>
                    <label
                        className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" disabled={disableActions} checked={useJobRole}
                               onChange={e => handleRoleToggle(e.target.checked)}
                               className="w-3.5 h-3.5 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer disabled:opacity-50"/>
                        Include Role
                    </label>
                </div>
            </div>

            {/* Editor Body (with Highlight Overlay Trick) */}
            <div
                className="flex-1 flex flex-col min-h-0 relative bg-black/20 border border-white/10 rounded-lg overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                {/* Highlight Backdrop */}
                <div
                    className={`${textAreaLayoutClass} text-gray-200 pointer-events-none overflow-y-auto custom-scrollbar`}
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{__html: getHighlightedBody()}}
                />

                {/* Actual Editable Textarea */}
                <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    onScroll={handleScroll}
                    disabled={disableActions}
                    className={`${textAreaLayoutClass} bg-transparent text-transparent caret-white outline-none resize-none custom-scrollbar disabled:opacity-75`}
                    spellCheck="false"
                    placeholder="Write your cover letter here..."
                />
            </div>

            {/* Footer / Send Action */}
            <div className="shrink-0 pt-2 flex items-center justify-between border-t border-white/10 mt-1">
                <div className="text-xs text-gray-500">
                    * Resume.pdf will be automatically attached by the backend.
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReject}
                        disabled={disableActions}
                        className="bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRejecting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
                        Reject
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={disableActions}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                    >
                        {isSending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                        {isSending ? 'Sending...' : 'Send Application'}
                    </button>
                </div>
            </div>
        </div>
    );
}
