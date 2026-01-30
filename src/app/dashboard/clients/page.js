"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, Mail, Phone, MoreHorizontal, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ClientsPage() {
    const supabase = createClient()
    const [search, setSearch] = useState('')
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchClients() {
            setLoading(true)
            let query = supabase.from('clients').select('*, orders(count)')

            if (search) {
                query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
            }

            const { data, error } = await query.order('name')
            if (data) setClients(data)
            setLoading(false)
        }

        const timer = setTimeout(() => {
            fetchClients()
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clients</h1>
                    <p className="text-gray-500 mt-1">Manage and track your customers measurements and history.</p>
                </div>
                <Link
                    href="/dashboard/clients/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-emerald text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Add Client
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-emerald outline-none text-gray-700 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client Info</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Orders</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => (window.location.href = `/dashboard/clients/${client.id}`)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-emerald-100 group-hover:text-brand-emerald transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-none">{client.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">ID: #{client.id.substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                        <Phone className="w-3 h-3 opacity-40" />
                                                        {client.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                        <Mail className="w-3 h-3 opacity-40" />
                                                        {client.email || '—'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                                                    {client.orders?.[0]?.count || 0} Orders
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 font-medium">{new Date(client.created_at).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {clients.length === 0 && (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">No clients found</h3>
                                    <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
