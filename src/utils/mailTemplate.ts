import { JobLead } from '../types';

export const generateSubject = (lead: JobLead, includeRole: boolean) => {
    return (includeRole && lead.role) ? `Application for ${lead.role} position` : `Job Application`;
};

export const generateTemplate = (lead: JobLead, includeName: boolean, includeCompany: boolean, includeRole: boolean) => {
    const hrName = (includeName && lead.name && lead.name !== 'Unknown') ? lead.name : 'Hiring Team';
    const companyName = (includeCompany && lead.company && lead.company !== 'Unknown') ? lead.company : 'your company';
    const roleName = (includeRole && lead.role) ? lead.role : 'open';

    return `Dear ${hrName},\n\nI am writing to express my interest in the ${roleName} position at ${companyName}. As a developer based in Pune specializing in Java 17+, Spring Boot, and scalable systems, I believe I would be a strong fit for your team. I recently built a real-time AI-powered application named Talentiv, and I am eager to bring similar problem-solving skills to your engineering department.\n\nPlease find my resume attached.\n\nBest regards,\nAjinkya Kardile`;
};