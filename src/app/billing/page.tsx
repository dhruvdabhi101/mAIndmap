"use client"

import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, CreditCard, Wallet2, Building2 } from "lucide-react";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

const PaymentMethodIcon = ({ method }: { method: string }) => {
    switch (method) {
        case "Credit Card":
            return <CreditCard className="w-4 h-4 text-gray-600" />;
        case "PayPal":
            return <Wallet2 className="w-4 h-4 text-gray-600" />;
        case "Bank Transfer":
            return <Building2 className="w-4 h-4 text-gray-600" />;
        default:
            return null;
    }
};

const StatusBadge = ({ status }: { status: string }) => {
    const className = {
        Paid: "status-badge status-paid",
        Pending: "status-badge status-pending",
        Unpaid: "status-badge status-unpaid",
    }[status] || "";

    return <span className={className}>{status}</span>;
};

function BillingPage() {
    const [loading, setLoading] = React.useState(false);

    if (loading) {
        return <LoadingSpinner />
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="cursor-pointer">
                    <motion.div
                        whileHover={{ x: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="back-button" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </motion.div>
                </Link>
                <div>
                    <Label className="text-2xl font-semibold text-gray-900">Billing History</Label>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="table-container bg-white overflow-hidden"
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-100">
                            <TableHead className="w-[100px] py-4 font-semibold text-gray-900">Invoice</TableHead>
                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900">Payment Method</TableHead>
                            <TableHead className="text-right font-semibold text-gray-900">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice, index) => (
                            <motion.tr
                                key={invoice.invoice}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="invoice-row"
                            >
                                <TableCell className="font-medium text-gray-900">{invoice.invoice}</TableCell>
                                <TableCell>
                                    <StatusBadge status={invoice.paymentStatus} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <PaymentMethodIcon method={invoice.paymentMethod} />
                                        <span className="text-gray-600">{invoice.paymentMethod}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium text-gray-900">
                                    {invoice.totalAmount}
                                </TableCell>
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </motion.div>
        </motion.div>
    );
}

export default BillingPage;