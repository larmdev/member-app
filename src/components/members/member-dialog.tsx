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
        defaultValues: { name: "", email: "", role: "member", status: "active", birthday: "" },
    })

    // ดึงค่ามาเฝ้าดู (Watch)
    const birthdayValue = form.watch("birthday") || "";
    // คำนวณอายุ: ถ้าพิมพ์ครบ 10 หลัก (DD/MM/YYYY) ค่อยคำนวณ ถ้าไม่ครบให้เป็น null
    const displayAge = birthdayValue.length === 10 ? calculateAge(birthdayValue) : null;

    // เมื่อเลือก Member เพื่อแก้ไข ให้โหลดข้อมูลลงฟอร์ม
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                role: initialData.role,
                birthday: initialData.birthday,
                status: initialData.status,
            })
        } else {
            form.reset({ name: "", email: "", role: "member", status: "active", birthday: "" })
        }
    }, [initialData, form, open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มสมาชิกใหม่"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
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
                                    <FormControl><Input placeholder="john@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>วันเกิด (วว/ดด/ปปปป)</FormLabel>
                                        {displayAge !== null && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                                อายุ {displayAge} ปี
                                            </Badge>
                                        )}
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="20/05/1999"
                                            {...field}
                                            maxLength={10}
                                            onChange={(e) => {
                                                // Logic เล็กๆ เพื่อช่วยใส่ "/" ให้อัตโนมัติ
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
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ตำแหน่ง</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="member">Member</SelectItem>
                                                <SelectItem value="guest">Guest</SelectItem>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit">{initialData ? "บันทึกการแก้ไข" : "สร้างสมาชิก"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}