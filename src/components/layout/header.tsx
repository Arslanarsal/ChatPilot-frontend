'use client'

import { useAuth } from '@/context/auth-context'
import { useSidebar } from './sidebar'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, logout } = useAuth()
  const { setOpen } = useSidebar()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/60 backdrop-blur-xl px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <span className="text-lg font-bold text-gradient">ChatPilot</span>
        </div>
        <div className="hidden md:block" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {user?.company_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">{user?.company_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.phone}</p>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </Button>
      </div>
    </header>
  )
}
