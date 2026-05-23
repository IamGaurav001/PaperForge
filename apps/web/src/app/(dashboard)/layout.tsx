import { Sidebar } from '@/components/ui/Sidebar';
import { AuthGuard } from '@/components/ui/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="bg-[#ebebeb] print:bg-white text-gray-900 h-[100dvh] print:h-auto w-screen print:w-full overflow-hidden print:overflow-visible antialiased flex print:block flex-col md:flex-row p-4 md:p-4 print:p-0 gap-4 print:gap-0">
        <Sidebar />
        <main className="flex-1 h-full print:h-auto flex print:block flex-col overflow-hidden print:overflow-visible relative">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
