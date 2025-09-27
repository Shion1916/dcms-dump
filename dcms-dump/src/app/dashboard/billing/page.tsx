'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '../../../components/ui/separator';
import { Receipt, AlertCircle, Eye, Edit, RefreshCw, Filter, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Bill, BillingStats, BillItem } from '../../../types';
import { useBilling, useBillingStats } from '../../../utils/swrCache';
import SearchAndPagination from '../../../components/SearchAndPagination';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Fetch billing data using custom SWR hooks
  const { data: billsData, error: billsError, isValidating: billsLoading, mutate: mutateBills } = useBilling();
  const { data: statsData, error: statsError, isValidating: statsLoading, mutate: mutateStats } = useBillingStats();

  const allBills: Bill[] = billsData?.bills || [];
  
  // Filter and search bills
  const filteredBills = useMemo(() => {
    let filtered = statusFilter === 'all' 
      ? allBills 
      : allBills.filter(bill => bill.status === statusFilter);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(bill => 
        bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allBills, statusFilter, searchQuery]);

  // Pagination logic
  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredBills.slice(startIndex, endIndex);
  }, [filteredBills, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredBills.length / entriesPerPage);
  const startEntry = ((currentPage - 1) * entriesPerPage) + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, filteredBills.length);
  const stats: BillingStats = statsData?.stats || {
    totalBilledToday: 0,
    paymentsReceivedToday: 0,
    outstandingBalances: 0
  };

  const [editForm, setEditForm] = useState({
    paymentAmount: 0,
    paymentMethod: '',
    notes: ''
  });

  const canManageBilling = user?.role === 'admin' || user?.role === 'staff';

  const handleRefresh = () => {
    mutateBills();
    mutateStats();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Partial</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const openViewDialog = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (bill: Bill) => {
    setSelectedBill(bill);
    setEditForm({
      paymentAmount: bill.outstandingBalance, // Auto-fill with remaining balance
      paymentMethod: '',
      notes: bill.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleMarkAsPaid = async () => {
    if (!canManageBilling || isSubmitting || !selectedBill) return;

    setIsSubmitting(true);
    try {
      const newPaidAmount = selectedBill.paidAmount + editForm.paymentAmount;
      const response = await fetch(`/api/billing/${selectedBill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidAmount: newPaidAmount,
          paymentMethod: editForm.paymentMethod,
          notes: editForm.notes,
          updatedBy: user?.email,
        }),
      });

      if (response.ok) {
        await mutateBills();
        await mutateStats();
        setIsEditDialogOpen(false);
        setSelectedBill(null);
        toast.success('Bill marked as paid successfully');
      } else {
        const error = await response.json();
        toast.error(`Failed to update bill: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to update bill - please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBill = async () => {
    if (!canManageBilling || isSubmitting || !selectedBill) return;

    setIsSubmitting(true);
    try {
      const newPaidAmount = selectedBill.paidAmount + editForm.paymentAmount;
      const response = await fetch(`/api/billing/${selectedBill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidAmount: newPaidAmount,
          paymentMethod: editForm.paymentMethod,
          notes: editForm.notes,
          updatedBy: user?.email,
        }),
      });

      if (response.ok) {
        await mutateBills();
        await mutateStats();
        setIsEditDialogOpen(false);
        setSelectedBill(null);
        toast.success('Bill updated successfully');
      } else {
        const error = await response.json();
        toast.error(`Failed to update bill: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to update bill - please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, entriesPerPage]);

  if (billsError || statsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load billing data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Billing Management</h1>
          <p className="text-gray-600">Manage patient bills and payment tracking</p>
        </div>
        <div className="flex gap-2">
          {canManageBilling && (
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/billing/reports')} 
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={billsLoading || statsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${(billsLoading || statsLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">₱</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Billed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalBilledToday)}
              </p>
            </div>
            {statsLoading && (
              <div className="ml-auto">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">₱</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payments Received</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.paymentsReceivedToday)}
              </p>
            </div>
            {statsLoading && (
              <div className="ml-auto">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">₱</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Balances</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.outstandingBalances)}
              </p>
            </div>
            {statsLoading && (
              <div className="ml-auto">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          {statusFilter !== 'all' && (
            <Badge variant="outline" className="ml-2">
              {statusFilter} ({filteredBills.length})
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Pagination */}
      <SearchAndPagination
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by patient name, email, or bill ID..."
        currentPage={currentPage}
        totalPages={totalPages}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
        totalEntries={filteredBills.length}
        startEntry={startEntry}
        endEntry={endEntry}
      />

      {/* Billing List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedBills.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery ? 
                  `No bills found matching "${searchQuery}"` :
                  (statusFilter === 'all' 
                    ? 'No billing records found' 
                    : `No ${statusFilter} bills found`
                  )
                }
              </p>
              {(statusFilter !== 'all' || searchQuery) && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBills.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.patientName}</div>
                          {bill.patientEmail && (
                            <div className="text-sm text-gray-500">{bill.patientEmail}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {bill.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.serviceName}
                            </div>
                          ))}
                          {bill.items.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{bill.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(bill.totalAmount)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(bill.paidAmount)}
                      </TableCell>
                      <TableCell>
                        {bill.paymentMethod ? (
                          <Badge variant="outline" className="capitalize">
                            {bill.paymentMethod}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(bill.status)}
                      </TableCell>
                      <TableCell>
                        {formatDate(bill.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openViewDialog(bill)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          {canManageBilling && (bill.status === 'pending' || bill.status === 'partial') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(bill)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Bill Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>
              Complete breakdown of the bill and payment information.
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Patient</p>
                    <p className="font-medium">{selectedBill.patientName}</p>
                    {selectedBill.patientEmail && (
                      <p className="text-sm text-gray-500">{selectedBill.patientEmail}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    {getStatusBadge(selectedBill.status)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Services</h4>
                <div className="space-y-2">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.serviceName}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500">{item.description}</p>
                        )}
                      </div>
                      <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold">{formatCurrency(selectedBill.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(selectedBill.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Outstanding Balance:</span>
                  <span className="font-bold text-orange-600">{formatCurrency(selectedBill.outstandingBalance)}</span>
                </div>
              </div>

              {selectedBill.paymentMethod && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Method</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedBill.paymentMethod}
                  </Badge>
                </div>
              )}

              {selectedBill.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Notes</p>
                  <p className="text-sm">{selectedBill.notes}</p>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Created: {formatDate(selectedBill.createdAt)}
                {selectedBill.updatedAt !== selectedBill.createdAt && (
                  <span> • Updated: {formatDate(selectedBill.updatedAt)}</span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Bill Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Edit Bill
            </DialogTitle>
            <DialogDescription>
              Update payment information for this bill.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="space-y-6">
              {/* Bill Header - Copied from View Dialog */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">Bill #{selectedBill.id}</h4>
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(selectedBill.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedBill.status)}
                    <p className="text-sm text-gray-600 mt-1">
                      By: {selectedBill.createdBy}
                    </p>
                  </div>
                </div>
                
                {/* Patient Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Patient:</span>
                    <span className="ml-2 font-medium">{selectedBill.patientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{selectedBill.patientEmail}</span>
                  </div>
                  {selectedBill.patientPhone && (
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2">{selectedBill.patientPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Items - Copied from View Dialog */}
              <div>
                <h4 className="font-medium mb-4">Services & Items</h4>
                <div className="space-y-3">
                  {selectedBill.items.map((item, index) => (
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

              {/* Payment Summary - Copied from View Dialog */}
              <div className="space-y-4">
                <h4 className="font-medium">Payment Summary</h4>
                
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(selectedBill.totalAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>Amount Paid:</span>
                    <span className="font-medium text-green-600">{formatCurrency(selectedBill.paidAmount)}</span>
                  </div>
                  
                  {selectedBill.outstandingBalance > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Outstanding Balance:</span>
                      <span className="font-medium text-orange-600">{formatCurrency(selectedBill.outstandingBalance)}</span>
                    </div>
                  )}
                  
                  {selectedBill.paymentMethod && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Previous Payment Method:</span>
                      <span className="font-medium capitalize">{selectedBill.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Payment Form */}
              <div className="space-y-4">
                <h4 className="font-medium">New Payment</h4>
                
                <div>
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedBill.outstandingBalance}
                    value={editForm.paymentAmount}
                    onChange={(e) => setEditForm({ ...editForm, paymentAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter payment amount"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Remaining balance: {formatCurrency(selectedBill.outstandingBalance)}
                  </p>
                  {editForm.paymentAmount > selectedBill.outstandingBalance && (
                    <p className="text-sm text-red-600 mt-1">Amount cannot exceed outstanding balance</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={editForm.paymentMethod} 
                    onValueChange={(value) => setEditForm({ ...editForm, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Add any notes about the payment"
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {/* Mark as Paid - only enabled if outstanding balance = 0 after payment and payment method is filled */}
                <Button 
                  onClick={handleMarkAsPaid}
                  disabled={
                    isSubmitting || 
                    !editForm.paymentMethod ||
                    editForm.paymentAmount <= 0 ||
                    editForm.paymentAmount > selectedBill.outstandingBalance ||
                    (selectedBill.outstandingBalance - editForm.paymentAmount) !== 0
                  }
                  className="flex-1"
                >
                  {isSubmitting ? 'Processing...' : 'Mark as Paid'}
                </Button>
                
                {/* Update Bill - enabled if outstanding balance > 0 after payment and payment method is filled */}
                <Button 
                  onClick={handleUpdateBill}
                  variant="outline"
                  disabled={
                    isSubmitting || 
                    !editForm.paymentMethod ||
                    editForm.paymentAmount <= 0 ||
                    editForm.paymentAmount > selectedBill.outstandingBalance ||
                    (selectedBill.outstandingBalance - editForm.paymentAmount) === 0
                  }
                  className="flex-1"
                >
                  {isSubmitting ? 'Processing...' : 'Update Bill'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}