export interface JobLead {
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