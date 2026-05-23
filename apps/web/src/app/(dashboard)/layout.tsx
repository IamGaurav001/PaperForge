import { Sidebar } from '@/components/ui/Sidebar';
import { AuthGuard } from '@/components/ui/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="bg-[#ebebeb] text-gray-900 h-[100dvh] w-screen overflow-hidden antialiased flex flex-col md:flex-row p-4 md:p-4 gap-4">
        <Sidebar />
        <main className="flex-1 h-full flex flex-col overflow-hidden relative">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
