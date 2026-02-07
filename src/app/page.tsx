import MemberTable from '@/components/members/member-table';

export default function Home() {
  return (


    // ใส่ไว้ในส่วนที่เป็นพื้นหลังของหน้าหลัก
    <div className="relative min-h-screen bg-slate-50">
      {/* SVG Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-3 [mask-image:linear-gradient(180deg,white,rgba(255, 255, 255, 0))]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Member Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">จัดการข้อมูลสมาชิกในระบบของคุณ</p>
          </div>
          <MemberTable />
        </main>
      </div>
    </div>
  );
}