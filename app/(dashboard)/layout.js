import Sidebar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'

export const metadata = {
  title: 'Notes Dashboard',
}

export default function DashboardLayout({ children }) {
  return (
    <div className="layout-shell min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 xl:px-8">
        <div className="flex min-h-[calc(100vh-3rem)] gap-6">
          <Sidebar />
          <main className="flex-1 space-y-6">
            <DashboardHeader />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
