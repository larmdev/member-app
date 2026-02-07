"use client"
import { useEffect, useState, useCallback } from 'react';
import { memberService } from '@/services/member-service';
import { Member, MemberFormValues } from '@/types/member';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberDialog } from "./member-dialog";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

export default function MemberTable() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // States สำหรับ Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // ใช้ useCallback เพื่อป้องกันไม่ให้ฟังก์ชันถูกสร้างใหม่โดยไม่จำเป็น
    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await memberService.getMembers(page, 10, search);
            setMembers(res.data);
            setTotalPages(Math.ceil(res.total / res.pageSize));
        } catch (error) {
            console.error("Failed to fetch members:", error);
            // เพิ่มการแจ้งเตือน Error ตรงนี้ได้
        } finally {
            setLoading(false);
        }
    }, [page, search]); // ฟังก์ชันจะเปลี่ยนก็ต่อเมื่อ page หรือ search เปลี่ยน

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]); // ใส่ fetchMembers เป็น dependency ได้อย่างปลอดภัย

    // Handle Create & Update
    const handleSubmit = async (values: MemberFormValues) => {
        if (selectedMember) {
            // PUT /members
            await memberService.updateMember(selectedMember.id, values);
        } else {
            // POST /members
            await memberService.createMember(values);
        }
        setIsDialogOpen(false);
        fetchMembers();
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกคนนี้?")) {
            await memberService.deleteMember(id);
            fetchMembers();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="ค้นหาสมาชิก..."
                    className="max-w-sm"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                <Button onClick={() => { setSelectedMember(null); setIsDialogOpen(true); }}>
                    + เพิ่มสมาชิก
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ชื่อ-นามสกุล</TableHead>
                            <TableHead>อีเมล</TableHead>
                            <TableHead>ตำแหน่ง</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10">กำลังโหลด...</TableCell></TableRow>
                        ) : members.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">ไม่พบข้อมูลสมาชิก</TableCell></TableRow>
                        ) : members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell className="capitalize">{member.role}</TableCell>
                                <TableCell>
                                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                        {member.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => { setSelectedMember(member); setIsDialogOpen(true); }}>
                                        แก้ไข
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(member.id)}>
                                        ลบ
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>ย้อนกลับ</Button>
                        </PaginationItem>
                        <span className="flex items-center px-4 text-sm font-medium">หน้า {page} จาก {totalPages}</span>
                        <PaginationItem>
                            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>ถัดไป</Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Reusable Dialog */}
            <MemberDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                initialData={selectedMember}
            />
        </div>
    );
}