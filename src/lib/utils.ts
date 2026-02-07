import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ฟังก์ชันคำนวณอายุจากวันเกิด (รูปแบบ DD/MM/YYYY)
export function calculateAge(birthdayStr: string): number {
  if (!birthdayStr) return 0;

  // แยก วัน/เดือน/ปี
  const [day, month, year] = birthdayStr.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  // ตรวจสอบว่าถึงวันเกิดในปีนี้หรือยัง
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}