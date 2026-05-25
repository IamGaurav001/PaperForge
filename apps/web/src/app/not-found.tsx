import { Sidebar } from '@/components/ui/Sidebar';
import { AuthGuard } from '@/components/ui/AuthGuard';
import { Construction } from 'lucide-react';

export default function NotFound() {
  return (
    <AuthGuard>
      <div className="bg-[#ebebeb] print:bg-white text-gray-900 h-[100dvh] print:h-auto w-screen print:w-full overflow-hidden print:overflow-visible antialiased flex print:block flex-col md:flex-row p-4 md:p-4 print:p-0 gap-4 print:gap-0">
        <Sidebar />
        <main className="flex-1 h-full print:h-auto flex print:block flex-col overflow-hidden print:overflow-visible relative">
          <div className="flex-1 bg-white md:rounded-[32px] shadow-sm flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-orange-50 text-[#CD462F] rounded-full flex items-center justify-center mb-6">
              <Construction className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>
            <p className="text-gray-500 max-w-md mx-auto text-lg">
              We're working hard to bring you this feature. Please check back later!
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
