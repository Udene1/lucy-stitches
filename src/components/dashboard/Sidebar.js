"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Users,
    ShoppingBag,
    Package,
    LayoutDashboard,
    Sparkles,
    Settings,
    Scissors
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: Scissors },
    { name: 'AI Suggestions', href: '/dashboard/designs', icon: Sparkles },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-64 h-screen bg-brand-emerald text-white border-r border-white/10 shadow-xl overflow-y-auto">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden shadow-lg shadow-emerald-950/20">
                    <img src="/logo.png" alt="Lucy Stitches" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight uppercase leading-none">Lucy</span>
                    <span className="text-[10px] font-black tracking-[0.2em] text-emerald-300 uppercase leading-none">Stitches</span>
                </div>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-brand-gold text-white shadow-md shadow-brand-gold/20"
                                    : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-white/10">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-emerald-100/70 hover:bg-white/10 hover:text-white transition-all"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </div>
        </div>
    )
}
