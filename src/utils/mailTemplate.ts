import { JobLead } from '@/types';

export const generateSubject = (lead: JobLead, includeRole: boolean) => {
    return (includeRole && lead.role) ? `Application for ${lead.role} position | 2.5 Years Experience` : `Application for Java Developer position | 2.5 Years Experience`;
};

export const generateTemplate = (lead: JobLead, includeName: boolean, includeCompany: boolean, includeRole: boolean) => {
    // Use fallbacks based on your new template
    const hrName = (includeName && lead.name && lead.name !== 'Unknown') ? lead.name : 'Hiring Team';
    const companyName = (includeCompany && lead.company && lead.company !== 'Unknown') ? lead.company : 'your organization';
    const roleName = (includeRole && lead.role) ? lead.role : 'Java Developer';

    return `Dear ${hrName},

I hope you are doing well.

I am writing to express my interest in ${roleName} opportunities at ${companyName}. I have 2.5 years of experience developing scalable systems using Java, Spring Boot and React in high-traffic environments.

My core technical expertise includes:
• Backend: Java 17, Spring Boot, REST API design, Microservices architecture
• Frontend: ReactJS, JavaScript, HTML, CSS
• Databases: MySQL, BigQuery, Aerospike, Redis (caching strategies)
• Systems: Event-driven architecture, kafka, Pub/Sub messaging
• DevOps & Tools: Docker, Git, CI/CD pipelines, GCP

I am passionate about building reliable software and would welcome the opportunity to bring my problem-solving skills to your engineering team.

Please find my resume attached for your review. I would be happy to discuss how my experience aligns with your requirements.

Thank you for your time and consideration.

Best regards,
Ajinkya Kardile
+91 8308679079
https://www.linkedin.com/in/ajinkya-kardile/`;
};