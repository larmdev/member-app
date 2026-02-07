import { Member, MemberResponse } from "@/types/member";

// Mock Data
let mockMembers: Member[] = Array.from({ length: 50 }, (_, i) => ({
    id: `mem-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'admin' : 'member',
    status: i % 5 === 0 ? 'inactive' : 'active',
    createdAt: new Date().toISOString(),
}));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const memberService = {
    // GET /members (with Search, Filter, Pagination)
    getMembers: async (page = 1, limit = 10, search = ""): Promise<MemberResponse> => {
        await delay(400);
        const filtered = mockMembers.filter(m =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase())
        );

        const start = (page - 1) * limit;
        const data = filtered.slice(start, start + limit);
        return { data, total: filtered.length, page, pageSize: limit };
    },

    // POST /members
    createMember: async (data: Omit<Member, 'id' | 'createdAt'>) => {
        await delay(500);
        const newMember = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
        mockMembers = [newMember, ...mockMembers];
        return newMember;
    },

    // PUT /members
    updateMember: async (id: string, data: Partial<Member>) => {
        await delay(500);
        mockMembers = mockMembers.map(m => m.id === id ? { ...m, ...data } : m);
        return true;
    },

    // DELETE /members
    deleteMember: async (id: string) => {
        await delay(500);
        mockMembers = mockMembers.filter(m => m.id !== id);
        return true;
    }
};