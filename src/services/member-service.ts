import { MemberResponse, MemberFormValues } from "@/types/member";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const memberService = {
    // GET /members (with Search, Pagination)
    getMembers: async (page = 1, limit = 10, search = ""): Promise<MemberResponse> => {
        // สร้าง Query Parameters
        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
            offset: offset.toString(),
            limit: limit.toString(),
            search: search
        });

        const response = await fetch(`${BASE_URL}/api/members?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch members');
        const res = await response.json();

        // Mapping ให้เข้ากับ Interface ของเรา
        return {
            data: res.data.items, // ดึงจาก items
            total: res.data.total, // จำนวนทั้งหมด
            totalPages: res.data.totalPage, // จำนวนหน้าทั้งหมดจาก API
            pageSize: res.data.limit
        };
    },

    // POST: รับข้อมูลจากฟอร์ม (ไม่มี ID)
    createMember: async (data: MemberFormValues) => {
        data.memberId = null;
        const response = await fetch(`${BASE_URL}/api/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // PUT: รับ ID แยกกับข้อมูลที่ต้องการอัปเดต
    updateMember: async (data: MemberFormValues) => {
        const response = await fetch(`${BASE_URL}/api/members`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // DELETE /members/:id
    deleteMember: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/members/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete member');
        return true;
    }
};