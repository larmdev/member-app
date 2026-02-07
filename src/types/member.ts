import * as z from "zod"

export interface Member {
  id: string;
  name: string;
  email: string;
  birthday: string;
  role: 'admin' | 'member' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface MemberResponse {
  data: Member[];
  total: number;
  page: number;
  pageSize: number;
}

export const memberSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  birthday: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "รูปแบบต้องเป็น DD/MM/YYYY"),
  role: z.enum(["admin", "member", "guest"]),
  status: z.enum(["active", "inactive"]),
})

export type MemberFormValues = z.infer<typeof memberSchema>