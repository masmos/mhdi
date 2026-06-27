// resources/js/Pages/Pharmacy/Dispense/Create.tsx
import { useState, useMemo, useEffect } from 'react';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { ArrowLeft, Plus, Trash2, Package, Save, Loader2, AlertCircle, User, Calendar, Pill } from 'lucide-react';
import { format } from 'date-fns';

import type { Batch, Drug, User as UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';

interface DispenseItemInput {
    batch_id: number | '';
    drug_id: number | '';
    quantity: number | '';
    patient_id?: string;
}

interface DispenseFormValues {
    patient_name: string;
    patient_id: string;
    department: string;
    prescribed_by: number | '';
    dispense_date: string;
    notes: string;
    items: DispenseItemInput[];
}

interface BatchWithDrug extends Batch {
    drug: Drug;
}

const createEmptyItem = (): DispenseItemInput => ({
    batch_id: '',
    drug_id: '',
    quantity: '',
    patient_id: '',
});

const DispenseCreate: React.FC = () => {
    const { availableBatches, doctors } = usePage<PageProps & {
        availableBatches: BatchWithDrug[];
        doctors: UserType[];
    }>().props;

    const { data, setData, post, processing, errors } = useForm<DispenseFormValues>({
        patient_name: '',
        patient_id: '',
        department: '',
        prescribed_by: '',
        dispense_date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        items: [createEmptyItem()],
    });

    const [items, setItems] = useState<DispenseItemInput[]>(data.items);

    // Sync items with form data
    useEffect(() => {
        setData('items', items);
    }, [items, setData]);

    // Get selected batch details
    const getBatchDetails = (batchId: number | string): BatchWithDrug | undefined => {
        if (!batchId) return undefined;
        return availableBatches.find(b => b.id === Number(batchId));
    };

    // Get drug name by ID
    const getDrugName = (drugId: number | string): string => {
        if (!drugId) return '';
        // Find drug from the selected batch
        const batch = availableBatches.find(b => b.drug_id === Number(drugId));
        return batch?.drug?.name || String(drugId);
    };

    // Calculate total items being dispensed
    const totalItems = items.filter(item => item.batch_id && item.quantity).length;

    const addItemLine = () => {
        setItems([...items, createEmptyItem()]);
    };

    const removeItemLine = (index: number) => {
        if (items.length <= 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItemField = (index: number, field: keyof DispenseItemInput, value: any) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        
        // If batch_id changes, auto-populate drug_id
        if (field === 'batch_id' && value) {
            const batch = getBatchDetails(value);
            if (batch) {
                updatedItems[index].drug_id = batch.drug_id;
            }
        }
        
        setItems(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dispense', {
            onSuccess: () => {
                // Optional: redirect or show success message
            },
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    // FIXED: Helper to get error for specific item field with proper type handling
    const getItemError = (index: number, field: string): string | null => {
        const errorKey = `items.${index}.${field}`;
        // Check if the error key exists in the errors object
        if (errorKey in errors) {
            return errors[errorKey as keyof typeof errors] || null;
        }
        return null;
    };

    return (
        <>
            <Head title="Dispense Medication" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Dispense Medication"
                        description="Dispense medication to patients from available stock."
                    />
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="mr-4">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                            {totalItems} item(s) to dispense
                        </Badge>
                    </div>
                </div>

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Validation Errors</AlertTitle>
                        <AlertDescription>
                            Please fix the following errors before submitting.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT COLUMN: Patient Details */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Patient Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="patient_name">Patient Name *</Label>
                                        <Input
                                            id="patient_name"
                                            value={data.patient_name}
                                            onChange={(e) => setData('patient_name', e.target.value)}
                                            placeholder="Enter patient name"
                                            className={errors.patient_name ? 'border-red-500' : ''}
                                        />
                                        {errors.patient_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.patient_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="patient_id">Patient ID</Label>
                                        <Input
                                            id="patient_id"
                                            value={data.patient_id}
                                            onChange={(e) => setData('patient_id', e.target.value)}
                                            placeholder="e.g. P-12345"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="department">Department *</Label>
                                        <Input
                                            id="department"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            placeholder="e.g. Outpatient, Emergency, Maternity"
                                            className={errors.department ? 'border-red-500' : ''}
                                        />
                                        {errors.department && (
                                            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="prescribed_by">Prescribed By</Label>
                                        <Select
                                            value={String(data.prescribed_by)}
                                            onValueChange={(value) => setData('prescribed_by', Number(value))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.map((doctor) => (
                                                    <SelectItem key={doctor.id} value={String(doctor.id)}>
                                                        {doctor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="dispense_date">Dispense Date *</Label>
                                        <Input
                                            id="dispense_date"
                                            type="date"
                                            value={data.dispense_date}
                                            onChange={(e) => setData('dispense_date', e.target.value)}
                                            className={errors.dispense_date ? 'border-red-500' : ''}
                                        />
                                        {errors.dispense_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.dispense_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Enter dispensing notes..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Total Summary */}
                                    <div className="border rounded-lg p-3 bg-blue-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-600">Total Items</span>
                                            <span className="text-xl font-bold text-blue-700">
                                                {totalItems}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Medications to dispense
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Items to Dispense */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Pill className="h-5 w-5" />
                                        Medications to Dispense
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItemLine}
                                        className="gap-1"
                                    >
                                        <Plus className="h-4 w-4" /> Add Medication
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {items.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No medications added yet</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-2"
                                                onClick={addItemLine}
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add First Medication
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item, index) => {
                                                const batch = getBatchDetails(item.batch_id);
                                                const requestedQty = Number(item.quantity) || 0;
                                                const exceedsStock = batch ? requestedQty > batch.quantity : false;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`border rounded-xl p-4 space-y-4 relative group ${
                                                            exceedsStock ? 'border-red-300 bg-red-50' : 'bg-white'
                                                        }`}
                                                    >
                                                        {/* Remove Button */}
                                                        {items.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                onClick={() => removeItemLine(index)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        <div>
                                                            <Label htmlFor={`items.${index}.batch_id`}>
                                                                Select Batch *
                                                                {getItemError(index, 'batch_id') && (
                                                                    <span className="text-red-500 text-sm ml-2">
                                                                        {getItemError(index, 'batch_id')}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <Select
                                                                value={String(item.batch_id)}
                                                                onValueChange={(value) =>
                                                                    updateItemField(index, 'batch_id', Number(value))
                                                                }
                                                            >
                                                                <SelectTrigger className={`w-full ${getItemError(index, 'batch_id') ? 'border-red-500' : ''}`}>
                                                                    <SelectValue placeholder="Select batch" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {availableBatches.map((batch) => (
                                                                        <SelectItem key={batch.id} value={String(batch.id)}>
                                                                            {batch.drug.name} - {batch.batch_number} ({batch.quantity} remaining)
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {batch && (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label>Drug</Label>
                                                                        <div className="p-2 bg-gray-50 rounded border">
                                                                            <div className="font-medium">{batch.drug.name}</div>
                                                                            <div className="text-sm text-gray-500">
                                                                                Batch: {batch.batch_number}
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                Expires: {format(new Date(batch.expiry_date), 'MMM dd, yyyy')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label>Available Stock</Label>
                                                                        <div className={`p-2 rounded border ${
                                                                            batch.quantity <= 10 ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-300'
                                                                        }`}>
                                                                            <div className="text-lg font-bold">
                                                                                {batch.quantity} units
                                                                            </div>
                                                                            {batch.quantity <= 10 && (
                                                                                <span className="text-xs text-yellow-600">Low stock</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label htmlFor={`items.${index}.quantity`}>
                                                                        Quantity to Dispense *
                                                                        {getItemError(index, 'quantity') && (
                                                                            <span className="text-red-500 text-sm ml-2">
                                                                                {getItemError(index, 'quantity')}
                                                                            </span>
                                                                        )}
                                                                    </Label>
                                                                    <Input
                                                                        id={`items.${index}.quantity`}
                                                                        type="number"
                                                                        min={1}
                                                                        max={batch.quantity}
                                                                        value={item.quantity}
                                                                        onChange={(e) =>
                                                                            updateItemField(index, 'quantity', e.target.value ? Number(e.target.value) : '')
                                                                        }
                                                                        className={`${
                                                                            exceedsStock ? 'border-red-500' : 
                                                                            getItemError(index, 'quantity') ? 'border-red-500' : ''
                                                                        }`}
                                                                    />
                                                                    {exceedsStock && (
                                                                        <p className="text-red-500 text-sm mt-1">
                                                                            Quantity exceeds available stock ({batch.quantity} remaining)
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Max: {batch.quantity} units available
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <Label htmlFor={`items.${index}.patient_id`}>
                                                                        Patient ID (Optional)
                                                                    </Label>
                                                                    <Input
                                                                        id={`items.${index}.patient_id`}
                                                                        value={item.patient_id || ''}
                                                                        onChange={(e) =>
                                                                            updateItemField(index, 'patient_id', e.target.value)
                                                                        }
                                                                        placeholder="Specific patient ID for this item"
                                                                    />
                                                                </div>

                                                                {/* Item Summary */}
                                                                {Number(item.quantity) > 0 && (
                                                                    <div className="flex items-center justify-end pt-2 border-t text-sm">
                                                                        <span className="text-gray-600">
                                                                            Dispensing: <strong>{Number(item.quantity)}</strong> units of <strong>{batch.drug.name}</strong>
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <Link href="/dashboard">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Dispense Medication
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DispenseCreate;