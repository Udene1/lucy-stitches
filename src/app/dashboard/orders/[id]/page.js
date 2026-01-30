"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    Truck,
    Briefcase,
    CreditCard,
    Camera,
    MessageSquare,
    Loader2,
    Share2,
    Trash2
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusOptions = ['pending', 'in-progress', 'ready', 'delivered']

const statusConfig = {
    'pending': { label: 'Pending', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
    'in-progress': { label: 'In Progress', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    'ready': { label: 'Ready', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    'delivered': { label: 'Delivered', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
}

export default function OrderDetailPage({ params }) {
    const router = useRouter()
    const supabase = createClient()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        async function fetchOrder() {
            const { data } = await supabase
                .from('orders')
                .select('*, clients(*)')
                .eq('id', params.id)
                .single()

            if (data) setOrder(data)
            setLoading(false)
        }
        fetchOrder()
    }, [params.id])

    const handleStatusChange = async (newStatus) => {
        setUpdating(true)
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', order.id)

            if (error) throw error

            setOrder({ ...order, status: newStatus })
            toast.success(`Order marked as ${newStatus}`)

            // Trigger Email Notification via Internal API
            await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: order.clients.email,
                    subject: `Order Update: ${order.description}`,
                    type: 'order_update',
                    data: {
                        clientName: order.clients.name,
                        orderId: order.id,
                        status: newStatus
                    }
                })
            })
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand-emerald" />
        </div>
    )

    if (!order) return <div>Order not found</div>

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders" className="p-2 hover:bg-white rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order #{order.id.substring(0, 8)}</h1>
                        <p className="text-gray-500 font-medium">Production Detail • {order.clients?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 text-gray-500 bg-white rounded-2xl hover:bg-gray-50 transition-all border border-gray-100 shadow-sm">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition-all border border-red-100 shadow-sm">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Production Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</p>
                                <h2 className="text-2xl font-black text-gray-900">{order.description}</h2>
                            </div>
                            <div className={cn(
                                "px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-widest border flex items-center gap-2",
                                statusConfig[order.status].bg,
                                statusConfig[order.status].color,
                                "border-current/10"
                            )}>
                                {statusConfig[order.status].icon({ className: "w-4 h-4" })}
                                {order.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                <p className="text-xl font-black text-gray-900">{formatCurrency(order.price)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paid</p>
                                <p className="text-xl font-black text-emerald-600">{formatCurrency(order.paid || 0)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deadline</p>
                                <p className="text-xl font-black text-gray-900">{formatDate(order.deadline)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Created</p>
                                <p className="text-xl font-black text-gray-900">{formatDate(order.created_at)}</p>
                            </div>
                        </div>

                        {/* Status Workflow Selector */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Update Production Phase</h3>
                            <div className="flex flex-wrap gap-3">
                                {statusOptions.map((status) => {
                                    const config = statusConfig[status]
                                    const isActive = order.status === status
                                    return (
                                        <button
                                            key={status}
                                            disabled={updating}
                                            onClick={() => handleStatusChange(status)}
                                            className={cn(
                                                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all border",
                                                isActive
                                                    ? `${config.bg} ${config.color} border-current/20 scale-105 shadow-md shadow-brand-emerald/5`
                                                    : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                                            )}
                                        >
                                            <config.icon className="w-4 h-4" />
                                            {config.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Progress Photos & Notes Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">Production Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <button className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-brand-emerald hover:border-brand-emerald transition-all group">
                                <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest">Add Photo</span>
                            </button>
                            {/* Mock progressive photos */}
                            {[1, 2].map(i => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Client Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-brand-emerald rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-950/10 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-tight">The Client</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center font-black text-2xl border border-white/10">
                                {order.clients?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black text-lg leading-tight">{order.clients?.name}</p>
                                <p className="text-emerald-200/60 font-medium text-sm">Active Customer</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <Link
                                href={`/dashboard/clients/${order.client_id}`}
                                className="w-full py-4 bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/5"
                            >
                                View Full Profile
                            </Link>
                            <button className="w-full py-4 bg-brand-gold text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-emerald-950/20">
                                <MessageSquare className="w-4 h-4" />
                                Contact Client
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-brand-gold" />
                            Payment Records
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-bold text-gray-500">Balance Due</span>
                                <span className="text-lg font-black text-gray-900">{formatCurrency(order.price - (order.paid || 0))}</span>
                            </div>
                            <button className="w-full py-3 bg-gray-50 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-100">
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
