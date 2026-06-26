export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[];
    permissions: string[];
}

export interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    tax_id: string | null;
    bank_name: string | null;
    bank_account: string | null;
    notes: string | null;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    total_batches?: number;
    active_batches?: number;
    expired_batches?: number;
    total_drugs?: number;
    total_value?: number;
}

export interface Drug {
    id: number;
    name: string;
    generic_name: string | null;
    category: string | null;
    manufacturer: string | null;
    unit: string;
    dosage_form: string | null;
    strength: string | null;
    reorder_level: number;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    total_stock?: number;
    total_value?: number;
}

export interface Batch {
    id: number;
    drug_id: number;
    batch_number: string;
    quantity: number;
    initial_quantity: number;
    unit_cost: number | null;
    selling_price: number | null;
    manufacture_date: string | null;
    expiry_date: string;
    supplier_id: number | null;
    received_date: string;
    location: string | null;
    status: 'active' | 'expired' | 'depleted' | 'quarantined';
    notes: string | null;
    created_at: string;
    updated_at: string;
    drug?: Drug;
    supplier?: Supplier;
    is_expired?: boolean;
    is_expiring_soon?: boolean;
    remaining_days?: number;
}

export interface UsageRecord {
    id: number;
    batch_id: number;
    drug_id: number;
    quantity_used: number;
    department: string | null;
    patient_id: string | null;
    prescribed_by: number | null;
    administered_by: number | null;
    usage_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    drug?: Drug;
    batch?: Batch;
    administrator?: User;
    prescriber?: User;
}

export interface InventoryAdjustment {
    id: number;
    batch_id: number;
    adjustment_type: 'add' | 'subtract' | 'correct';
    quantity: number;
    reason: string | null;
    performed_by: number;
    created_at: string;
    updated_at: string;
}

export interface ExpiryNotification {
    id: number;
    batch_id: number;
    notification_type: 'warning' | 'expired';
    sent_at: string;
    sent_to: number[];
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    links: { url: string | null; label: string; active: boolean }[];
}

// Form data types
export interface SupplierFormData {
    name: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
    tax_id?: string;
    bank_name?: string;
    bank_account?: string;
    notes?: string;
    is_active: boolean;
}


export interface BatchFormData {
    drug_id: number;
    batch_number: string;
    quantity: number;
    unit_cost?: number;
    selling_price?: number;
    manufacture_date?: string;
    expiry_date: string;
    supplier_id?: number;
    received_date: string;
    location?: string;
    notes?: string;
}

export interface UsageFormData {
    quantity: number;
    department: string;
    patient_id?: string;
    prescribed_by?: number;
    notes?: string;
}

export interface DrugFormData {
    name: string;
    generic_name?: string;
    category?: string;
    manufacturer?: string;
    unit: string;
    dosage_form?: string;
    strength?: string;
    reorder_level: number;
    is_active: boolean;
}

// Dashboard Types
export interface DashboardStats {
    totalDrugs: number;
    totalStock: number;
    expiringSoon: number;
    expiredBatches: number;
    lowStockDrugs: number;
    totalSuppliers: number;
}

export interface UsageTrend {
    date: string;
    usage: number;
}

export interface ExpiryDistribution {
    name: string;
    value: number;
}

export interface TopDrug {
    name: string;
    used: number;
}

export interface DepartmentUsage {
    department: string;
    used: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
}
