"use client"

import {
    CheckCircle2,
    Clock,
    MapPin,
    Phone,
    Scissors,
    CreditCard,
    ArrowRight
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

export default function PublicOrderPortal({ params }) {
    // Mock data for the portal
    const order = {
        id: params.id || 'ORD-8241',
        clientName: 'Jane Doe',
        description: 'Custom Silk Gown with Emerald Embroidery',
        status: 'in-progress',
        deadline: '2026-02-15',
        price: 45000,
        paid: 15000,
        timeline: [
            { date: '2026-01-20', label: 'Order Confirmed', completed: true },
            { date: '2026-01-22', label: 'Fabric Sourced', completed: true },
            { date: '2026-01-28', label: 'Cutting & Sewing', completed: true },
            { date: '2026-02-05', label: 'First Fitting', completed: false },
            { date: '2026-02-15', label: 'Final Delivery', completed: false },
        ]
    }

    const balance = order.price - order.paid

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand-emerald rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/10 mb-4">
                        <Scissors className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">TailorPro Port Harcourt</h1>
                    <p className="text-gray-500 font-medium">Order Status & Payment Portal</p>
                </div>

                {/* Order Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 overflow-hidden border border-gray-100">
                    <div className="p-8 bg-brand-emerald text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-200/80 text-xs font-black uppercase tracking-widest mb-1">Order Number</p>
                                <h2 className="text-3xl font-black tracking-tight">#{order.id}</h2>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Status</p>
                                <p className="font-bold flex items-center gap-1.5 leading-none mt-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    In Progress
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-gray-900">{order.description}</h3>
                            <p className="text-gray-500 font-medium">Expected Completion: {formatDate(order.deadline)}</p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Production Timeline</h4>
                            <div className="space-y-4">
                                {order.timeline.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 h-12 relative last:h-auto">
                                        {idx !== order.timeline.length - 1 && (
                                            <div className={cn(
                                                "absolute left-[11px] top-6 w-[2px] h-[calc(100%+8px)]",
                                                item.completed ? "bg-brand-emerald" : "bg-gray-100"
                                            )} />
                                        )}
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0",
                                            item.completed ? "bg-brand-emerald text-white" : "bg-gray-100 text-gray-300"
                                        )}>
                                            {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-bold", item.completed ? "text-gray-900" : "text-gray-400")}>{item.label}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{formatDate(item.date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Status</h4>
                                <div className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded uppercase">Partial</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(order.price)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-emerald-600">
                                    <span>Paid so far</span>
                                    <span>-{formatCurrency(order.paid)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-gray-900 font-black uppercase text-sm tracking-tight">Balance Due</span>
                                    <span className="text-2xl font-black text-gray-900">{formatCurrency(balance)}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-4 bg-brand-gold text-white font-black rounded-2xl shadow-xl shadow-brand-gold/20 hover:bg-amber-700 transition-all flex items-center justify-center gap-3">
                                <CreditCard className="w-5 h-5" />
                                Pay Balance via Paystack
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-400 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        +234 800 TAILOR PRO
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Port Harcourt, Nigeria
                    </div>
                </div>
            </div>
        </div>
    )
}
