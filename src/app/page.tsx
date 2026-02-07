import MemberTable from '@/components/members/member-table';

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
        <p className="text-muted-foreground">จัดการข้อมูลสมาชิกในระบบของคุณ</p>
      </div>
      <MemberTable />
    </main>
  );
}