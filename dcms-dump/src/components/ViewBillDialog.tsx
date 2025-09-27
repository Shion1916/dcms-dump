'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Receipt, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Appointment } from '../types';

interface Bill {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  items: BillItem[];
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  paymentMethod?: string;
  status: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface BillItem {
  id: string;
  serviceId?: string;
  serviceName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface ViewBillDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewBillDialog({ 
  appointment, 
  isOpen, 
  onOpenChange 
}: ViewBillDialogProps) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && appointment?.billId) {
      fetchBill(appointment.billId);
    }
  }, [isOpen, appointment?.billId]);

  const fetchBill = async (billId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/billing/${billId}`);
      if (response.ok) {
        const data = await response.json();
        setBill(data.bill);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load bill');
      }
    } catch (error) {
      setError('Failed to load bill - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'partial':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-yellow-200">Partial</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            View Bill
          </DialogTitle>
          <DialogDescription>
            Bill details for appointment on {appointment.date} at {appointment.time}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading bill...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {bill && !isLoading && !error && (
          <div className="space-y-6">
            {/* Bill Header */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-lg">Bill #{bill.id}</h4>
                  <p className="text-sm text-gray-600">
                    Created: {formatDate(bill.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(bill.status)}
                  <p className="text-sm text-gray-600 mt-1">
                    By: {bill.createdBy}
                  </p>
                </div>
              </div>
              
              {/* Patient Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Patient:</span>
                  <span className="ml-2 font-medium">{bill.patientName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{bill.patientEmail}</span>
                </div>
                {bill.patientPhone && (
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2">{bill.patientPhone}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Appointment:</span>
                  <span className="ml-2">{appointment.date} at {appointment.time}</span>
                </div>
              </div>
            </div>

            {/* Bill Items */}
            <div>
              <h4 className="font-medium mb-4">Services & Items</h4>
              <div className="space-y-3">
                {bill.items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{item.serviceName}</h5>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="ml-2 font-medium">{item.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="ml-2 font-medium">{formatCurrency(item.unitPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="ml-2 font-medium">{formatCurrency(item.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div className="space-y-4">
              <h4 className="font-medium">Payment Summary</h4>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(bill.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>Amount Paid:</span>
                  <span className="font-medium text-green-600">{formatCurrency(bill.paidAmount)}</span>
                </div>
                
                {bill.outstandingBalance > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span>Outstanding Balance:</span>
                    <span className="font-medium text-orange-600">{formatCurrency(bill.outstandingBalance)}</span>
                  </div>
                )}
                
                {bill.paymentMethod && (
                  <div className="flex justify-between items-center text-sm">
                    <span>Payment Method:</span>
                    <span className="font-medium capitalize">{bill.paymentMethod}</span>
                  </div>
                )}
              </div>

              {bill.notes && (
                <div>
                  <h5 className="font-medium mb-2">Notes</h5>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{bill.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}