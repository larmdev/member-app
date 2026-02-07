"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { memberSchema, MemberFormValues, Member } from "@/types/member"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateAge } from "@/lib/utils"
import { Badge } from "../ui/badge"

interface MemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: MemberFormValues) => void
    initialData?: Member | null
}

export function MemberDialog({ open, onOpenChange, onSubmit, initialData }: MemberDialogProps) {
    const form = useForm<MemberFormValues>({
        resolver: zodResolver(memberSchema),
        // แก้ไข: ตรวจสอบว่า Key เหล่านี้ตรงกับ memberSchema ของคุณ
        defaultValues: {
            memberId: "",
            fullName: "",
            email: "",
            phone: "",
            position: "member",
            status: "active",
            birthdayStr: ""
        },
    })

    const birthdayValue = form.watch("birthdayStr") || "";
    const displayAge = birthdayValue.length === 10 ? calculateAge(birthdayValue) : null;

    useEffect(() => {
        if (open) {
            if (initialData) {
                // สำคัญ: Key ทุกตัวในนี้ต้องมีอยู่ใน defaultValues และ schema
                form.reset({
                    memberId: initialData.memberId,
                    fullName: initialData.fullName || "",
                    email: initialData.email || "",
                    phone: initialData.phone || "",
                    position: initialData.position || "member",
                    birthdayStr: initialData.birthdayStr || "",
                    status: initialData.status || "active",
                })
            } else {
                // ล้างฟอร์มให้เป็นค่าเริ่มต้น
                form.reset({
                    memberId: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    position: "member",
                    status: "active",
                    birthdayStr: "",
                })
            }
        }
    }, [initialData, form, open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {initialData ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มสมาชิกใหม่"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                        {/* เปลี่ยนจาก name เป็น fullName */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                                    <FormControl>
                                        <Input placeholder="สมชาย ใจดี" {...field} className="rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>อีเมล</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} className="rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>หมายเลขโทรศัพท์</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+66" {...field} className="rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthdayStr"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>วันเกิด (วว/ดด/ปปปป)</FormLabel>
                                        {displayAge !== null && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 animate-in fade-in zoom-in duration-300">
                                                อายุ {displayAge} ปี
                                            </Badge>
                                        )}
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="20/05/1999"
                                            {...field}
                                            maxLength={10}
                                            className="rounded-xl"
                                            onChange={(e) => {
                                                let v = e.target.value.replace(/\D/g, "");
                                                if (v.length > 2 && v.length <= 4) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                                                else if (v.length > 4) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
                                                field.onChange(v);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ตำแหน่ง</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue placeholder="เลือกตำแหน่ง" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="member">Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>สถานะ</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="active">active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="pt-6">
                            <Button type="submit" className="w-full sm:w-auto">
                                {initialData ? "บันทึกการแก้ไข" : "สร้างสมาชิกใหม่"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}