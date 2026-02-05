"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    ShoppingBag,
    Phone,
    Calendar,
    Clock,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Loader2,
    Eye,
    MessageSquare,
    User
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function BookingsPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error) setBookings(data)
            setLoading(false)
        }
        fetchBookings()
    }, [supabase])

    const updateStatus = async (id, status) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)

        if (!error) {
            setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Customer Bookings</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage incoming requests from the public booking page.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total</p>
                        <p className="text-xl font-black text-gray-900">{bookings.length}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="text-center">
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Pending</p>
                        <p className="text-xl font-black text-gray-900">{bookings.filter(b => b.status === 'pending').length}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/20 group hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 font-sans">
                        <div className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Side: Images */}
                                <div className="flex gap-4 shrink-0">
                                    {booking.material_photo_url ? (
                                        <div className="relative group/img">
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-2xl z-10">
                                                <p className="text-white text-[10px] font-black uppercase tracking-widest">Material</p>
                                            </div>
                                            <img
                                                src={booking.material_photo_url}
                                                alt="Material"
                                                className="w-32 h-40 object-cover rounded-2xl border-2 border-gray-50 shadow-sm"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-40 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-100">
                                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                                            <p className="text-[10px] font-black text-gray-300 uppercase mt-2">No Material</p>
                                        </div>
                                    )}

                                    {booking.ai_generated_url || booking.sample_design_url ? (
                                        <div className="relative group/img">
                                            <div className="absolute inset-x-0 bottom-0 bg-brand-emerald text-white text-[8px] font-black uppercase text-center py-1 rounded-b-2xl z-10">
                                                {booking.ai_generated_url ? 'AI GEN' : 'SAMPLE'}
                                            </div>
                                            <img
                                                src={booking.ai_generated_url || booking.sample_design_url}
                                                alt="Design"
                                                className="w-32 h-40 object-cover rounded-2xl border-2 border-gray-50 shadow-sm"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-40 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-100">
                                            <Clock className="w-8 h-8 text-gray-200" />
                                            <p className="text-[10px] font-black text-gray-300 uppercase mt-2">No Design</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Content */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{booking.customer_name}</h3>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    booking.status === 'pending' ? "bg-amber-100 text-amber-700" :
                                                        booking.status === 'reviewed' ? "bg-blue-100 text-blue-700" :
                                                            booking.status === 'converted' ? "bg-emerald-100 text-emerald-700" :
                                                                "bg-gray-100 text-gray-700"
                                                )}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 font-bold flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Booked on {formatDate(booking.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => window.open(`https://wa.me/${booking.whatsapp_number}`, '_blank')}
                                                className="flex items-center gap-2 px-5 py-3 bg-brand-emerald text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Contact WhatsApp
                                            </button>
                                        </div>
                                    </div>

                                    {booking.ai_prompt && (
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 relative">
                                            <span className="absolute -top-3 left-6 px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black uppercase rounded">AI Prompt</span>
                                            <p className="text-gray-600 font-medium italic">"{booking.ai_prompt}"</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <MessageSquare className="w-4 h-4" />
                                                <span className="text-sm font-bold">{booking.whatsapp_number}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'reviewed')}
                                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                                                    title="Mark as Reviewed"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            )}
                                            {booking.status !== 'converted' && (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'converted')}
                                                    className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                                                    title="Mark as Converted"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                                title="Mark as Cancelled"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase">No Bookings Yet</h2>
                        <p className="text-gray-500 font-medium mt-2">Share your booking link to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
