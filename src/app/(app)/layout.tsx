import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FeedbackWidget } from "@/components/layout/FeedbackWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FE] p-4">
      <div className="flex h-full w-full bg-white md:rounded-[2rem] shadow-sm overflow-hidden ring-1 ring-slate-100">
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </main>
        </div>
      </div>
      <FeedbackWidget />
    </div>
  );
}
