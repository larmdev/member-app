"use client"
import { useEffect, useState, useCallback } from 'react';
import { memberService } from '@/services/member-service';
import { Member, MemberFormValues } from '@/types/member';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberDialog } from "./member-dialog";
import { Pagination, 
        PaginationContent, 
        PaginationItem, 
        PaginationNext, 
        PaginationPrevious,
        PaginationLink,
        PaginationEllipsis
    } from "@/components/ui/pagination";
import { calculateAge } from "@/lib/utils"
import { alertService } from '@/lib/alerts';
import { Search, Edit3, Trash2, UserPlus, MoreHorizontal } from "lucide-react";


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
        try {
            if (selectedMember) {
                await memberService.updateMember(selectedMember.id, values);
                alertService.notify("อัปเดตข้อมูลสำเร็จ"); // แจ้งเตือนมุมจอ
            } else {
                await memberService.createMember(values);
                alertService.success("สร้างสมาชิกสำเร็จ", "ข้อมูลถูกเพิ่มลงในระบบเรียบร้อยแล้ว"); // Pop-up กลางจอ
            }
            setIsDialogOpen(false);
            fetchMembers();
        } catch (error) {
            alertService.error("เกิดข้อผิดพลาด", `${error}`);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        const result = await alertService.confirmDelete(
            "คุณแน่ใจหรือไม่?",
            "หากลบแล้วจะไม่สามารถกู้คืนข้อมูลสมาชิกคนนี้ได้!"
        );

        if (result.isConfirmed) {
            try {
                await memberService.deleteMember(id);
                alertService.notify("ลบสมาชิกเรียบร้อยแล้ว");
                fetchMembers();
            } catch (error) {
                alertService.error("เกิดข้อผิดพลาด", `${error}`);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                {/* <div className="relative w-full sm:max-w-sm">
                    <Input
                        placeholder="ค้นหาสมาชิก..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full"
                    />
                </div> */}
                <div className="relative group w-full sm:max-w-md">
                    {/* 1. Icon Container - ต้องมั่นใจว่าอยู่ชั้นบนสุด (z-10) */}
                    <div className="absolute inset-y-0 left-3 z-10 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>

                    {/* 2. Input Field */}
                    <Input
                        type="text"
                        placeholder="ค้นหาชื่อ หรืออีเมลสมาชิก..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="pl-11 pr-4 py-6 w-full bg-white/90 backdrop-blur-md border-slate-200 
                            rounded-2xl shadow-sm focus-visible:ring-4 focus-visible:ring-blue-500/10 
                            focus-visible:border-blue-500 transition-all text-base"
                    />

                    {/* 3. ประกายแสงด้านหลัง (Glow effect) */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 to-indigo-100 
                    opacity-0 group-focus-within:opacity-50 blur-xl transition-opacity rounded-2xl" />
                </div>
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => { setSelectedMember(null); setIsDialogOpen(true); }}
                >
                    + เพิ่มสมาชิก
                </Button>
            </div>

            <div className="hidden md:block rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ชื่อ-นามสกุล</TableHead>
                            <TableHead>อีเมล</TableHead>
                            <TableHead>ตำแหน่ง</TableHead>
                            <TableHead>อายุ</TableHead>
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
                                <TableCell className="capitalize">
                                    <Badge variant="outline">
                                        {member.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {member.birthday ? `${calculateAge(member.birthday)} ปี` : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                        {member.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {/* <Button variant="outline" size="sm" onClick={() => { setSelectedMember(member); setIsDialogOpen(true); }}>
                                        แก้ไข
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(member.id)}>
                                        ลบ
                                    </Button> */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                                        onClick={() => { setSelectedMember(member); setIsDialogOpen(true); }}
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                        onClick={() => handleDelete(member.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {/* --- Mobile View (รายการ Card) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {loading ? (
                    <p className="text-center py-10">กำลังโหลด...</p>
                ) : members.map((member) => (
                    <div key={member.id} className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                {member.status}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center text-sm border-t pt-3">
                            <div>
                                <span className="text-muted-foreground">ตำแหน่ง:</span>
                                <Badge variant="outline">
                                    {member.role}
                                </Badge>
                            </div>
                            <div>
                                <span className="text-muted-foreground">อายุ:</span> {member.birthday ? `${calculateAge(member.birthday)} ปี` : "-"}
                            </div>
                        </div>

                        <div className="flex justify-end gap-1 pt-2">
                            {/* <Button variant="outline" size="sm" onClick={() => { setSelectedMember(member); setIsDialogOpen(true); }}>
                                แก้ไข
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(member.id)}>
                                ลบ
                            </Button> */}

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                                onClick={() => { setSelectedMember(member); setIsDialogOpen(true); }}
                            >
                                <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-400 text-red-600 bg-red-50 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                onClick={() => handleDelete(member.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                    แสดง {members.length} รายการ จากทั้งหมด (หน้า {page} / {totalPages})
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ย้อนกลับ
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        ถัดไป
                    </Button>
                </div>
            </div> */}

            {/* Pagination Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground order-1 sm:order-1">
                    แสดง {members.length} รายการ จากทั้งหมด (หน้า {page} / {totalPages})
                </p>

                <Pagination className="order-1 sm:order-2 sm:justify-end">
                    <PaginationContent className="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-1 shadow-sm">
                        {/* ปุ่มย้อนกลับ */}
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"}
                            />
                        </PaginationItem>

                        {/* เลขหน้า (แบบพื้นฐาน) */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                            // แสดงเฉพาะหน้าใกล้เคียงเพื่อไม่ให้ยาวเกินไปบน Mobile
                            if (num === 1 || num === totalPages || (num >= page - 1 && num <= page + 1)) {
                                return (
                                    <PaginationItem key={num} className="hidden md:inline-block">
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); setPage(num); }}
                                            isActive={page === num}
                                            className="rounded-lg cursor-pointer"
                                        >
                                            {num}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }
                            // แสดงจุดไข่ปลา
                            if (num === page - 2 || num === page + 2) {
                                return <PaginationEllipsis key={num} className="hidden md:flex" />;
                            }
                            return null;
                        })}

                        {/* แสดงเลขหน้าปัจจุบันบน Mobile */}
                        <span className="md:hidden text-sm font-bold px-4 text-blue-600">
                            {page} / {totalPages}
                        </span>

                        {/* ปุ่มถัดไป */}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"}
                            />
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