import { useState, useMemo, useEffect } from 'react';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { ArrowLeft, Plus, Trash2, Package, Save, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import type { Batch, Supplier, Drug } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Heading from '@/components/heading';

interface BatchItemInput {
    drug_id: number | '';
    batch_number: string;
    expiry_date: string;
    quantity: number | '';
    unit_cost?: number;
}

interface BatchFormValues {
    supplier_id: number | '';
    received_date: string;
    notes: string;
    items: BatchItemInput[];
}

const createEmptyItem = (): BatchItemInput => ({
    drug_id: '',
    batch_number: '',
    expiry_date: '',
    quantity: '',
    unit_cost: undefined,
});

const BatchCreate: React.FC = () => {
    const { suppliers, drugs } = usePage<PageProps & {
        suppliers: Supplier[];
        drugs: Drug[];
    }>().props;

    const { data, setData, post, processing, errors } = useForm<BatchFormValues>({
        supplier_id: '',
        received_date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        items: [createEmptyItem(), createEmptyItem()],
    });

    const [items, setItems] = useState<BatchItemInput[]>(data.items);

    // Sync items with form data
    useEffect(() => {
        setData('items', items);
    }, [items, setData]);

    const totalCalculatedValue = useMemo(() => {
        return items.reduce((acc: number, curr: BatchItemInput) => {
            const qty = Number(curr?.quantity) || 0;
            const cost = Number(curr?.unit_cost) || 0;
            return acc + qty * cost;
        }, 0);
    }, [items]);

    const addItemLine = () => {
        setItems([...items, createEmptyItem()]);
    };

    const removeItemLine = (index: number) => {
        if (items.length <= 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItemField = (index: number, field: keyof BatchItemInput, value: any) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setItems(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/batches', {
            onSuccess: () => {
                // Optional: redirect or show success message
            },
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <>
            <Head title="Create New Batch" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Receive Stock"
                        description="Add new batch(es) to inventory."
                    />
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Link href="/batches" className="mr-4">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            Total Value: <strong className="text-lg text-blue-600">
                                USh {new Intl.NumberFormat('en-UG').format(totalCalculatedValue)}
                            </strong>
                        </span>
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
                        {/* LEFT COLUMN: Delivery Details */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Delivery Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="supplier_id">Supplier *</Label>
                                        <Select
                                            value={String(data.supplier_id)}
                                            onValueChange={(value) => setData('supplier_id', Number(value))}
                                        >
                                            <SelectTrigger className={`w-full ${errors.supplier_id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers.map((s) => (
                                                    <SelectItem key={s.id} value={String(s.id)}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.supplier_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.supplier_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="received_date">Received Date *</Label>
                                        <Input
                                            id="received_date"
                                            type="date"
                                            value={data.received_date}
                                            onChange={(e) => setData('received_date', e.target.value)}
                                            className={errors.received_date ? 'border-red-500' : ''}
                                        />
                                        {errors.received_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.received_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Enter additional intake notes..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Total Value Summary */}
                                    <div className="border rounded-lg p-3 bg-blue-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-600">Total Value</span>
                                            <span className="text-xl font-bold text-blue-700">
                                                USh {new Intl.NumberFormat('en-UG').format(totalCalculatedValue)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {items.length} item(s) in this delivery
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Items */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Items</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItemLine}
                                        className="gap-1"
                                    >
                                        <Plus className="h-4 w-4" /> Add Item
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {items.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm">No items added yet</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-2"
                                                onClick={addItemLine}
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add First Item
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded-xl p-4 bg-slate-50/50 space-y-4 relative group"
                                                >
                                                    {/* Remove Button (Top Right) */}
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
                                                        <Label htmlFor={`items.${index}.drug_id`}>
                                                            Drug *
                                                            {errors[`items.${index}.drug_id`] && (
                                                                <span className="text-red-500 text-sm ml-2">
                                                                    {errors[`items.${index}.drug_id`]}
                                                                </span>
                                                            )}
                                                        </Label>
                                                        <Select
                                                            value={String(item.drug_id)}
                                                            onValueChange={(value) =>
                                                                updateItemField(index, 'drug_id', Number(value))
                                                            }
                                                        >
                                                            <SelectTrigger className={`w-full ${errors[`items.${index}.drug_id`] ? 'border-red-500' : ''}`}>
                                                                <SelectValue placeholder="Select drug" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {drugs.map((d) => (
                                                                    <SelectItem key={d.id} value={String(d.id)}>
                                                                        {d.name} {d.strength ? `(${d.strength})` : ''}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor={`items.${index}.batch_number`}>
                                                                Batch Number *
                                                                {errors[`items.${index}.batch_number`] && (
                                                                    <span className="text-red-500 text-sm ml-2">
                                                                        {errors[`items.${index}.batch_number`]}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id={`items.${index}.batch_number`}
                                                                value={item.batch_number}
                                                                onChange={(e) =>
                                                                    updateItemField(index, 'batch_number', e.target.value)
                                                                }
                                                                placeholder="e.g. 8022588"
                                                                className={errors[`items.${index}.batch_number`] ? 'border-red-500' : ''}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`items.${index}.expiry_date`}>
                                                                Expiry Date *
                                                                {errors[`items.${index}.expiry_date`] && (
                                                                    <span className="text-red-500 text-sm ml-2">
                                                                        {errors[`items.${index}.expiry_date`]}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id={`items.${index}.expiry_date`}
                                                                type="date"
                                                                value={item.expiry_date}
                                                                onChange={(e) =>
                                                                    updateItemField(index, 'expiry_date', e.target.value)
                                                                }
                                                                className={errors[`items.${index}.expiry_date`] ? 'border-red-500' : ''}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor={`items.${index}.quantity`}>
                                                                Quantity *
                                                                {errors[`items.${index}.quantity`] && (
                                                                    <span className="text-red-500 text-sm ml-2">
                                                                        {errors[`items.${index}.quantity`]}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id={`items.${index}.quantity`}
                                                                type="number"
                                                                min={1}
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    updateItemField(index, 'quantity', e.target.value ? Number(e.target.value) : '')
                                                                }
                                                                className={errors[`items.${index}.quantity`] ? 'border-red-500' : ''}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`items.${index}.unit_cost`}>
                                                                Unit Cost
                                                                {errors[`items.${index}.unit_cost`] && (
                                                                    <span className="text-red-500 text-sm ml-2">
                                                                        {errors[`items.${index}.unit_cost`]}
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id={`items.${index}.unit_cost`}
                                                                type="number"
                                                                min={0}
                                                                step="0.01"
                                                                value={item.unit_cost || ''}
                                                                onChange={(e) =>
                                                                    updateItemField(index, 'unit_cost', e.target.value ? Number(e.target.value) : undefined)
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Item Summary */}
                                                    <div className="flex items-center justify-end pt-2 border-t text-sm text-gray-500">
                                                        <span>
                                                            Subtotal: USh {new Intl.NumberFormat('en-UG').format(
                                                                (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0)
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <Link href="/batches">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Receive Stock
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BatchCreate;