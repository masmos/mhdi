import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User, Supplier, Drug, Batch, UsageRecord, PaginatedResponse, DashboardStats, UsageTrend, ExpiryDistribution, TopDrug, DepartmentUsage } from './index';

export interface PageProps extends InertiaPageProps {
   auth: { user: User };
   flash: { success: string; error?: string; warning?: string; info?: string };
   errors: Record<string, string>;
}

export interface DashboardPageProps extends PageProps {
   stats: DashboardStats;
   usageTrend: UsageTrend[];
   expiryDistribution: ExpiryDistribution[];
   topDrugs: TopDrug[];
   departmentUsage: DepartmentUsage[];
}

export interface SupplierIndexPageProps extends PageProps {
   suppliers: PaginatedResponse<Supplier>;
   filters: { search?: string; status?: string; sort?: string; direction?: 'asc' | 'desc' };
}

export interface SupplierShowPageProps extends PageProps {
   supplier: Supplier;
   stats: {
      total_batches: number;
      active_batches: number;
      expired_batches: number;
      depleted_batches: number;
      total_drugs: number;
      total_value: number;
   };
   recentDeliveries: {
      id: number;
      batch_number: string;
      drug_name: string;
      quantity: number;
      unit_cost: number | null;
      expiry_date: string;
      received_date: string;
      status: Batch['status'];
   }[];
}

export interface SupplierCreatePageProps extends PageProps { }

export interface SupplierEditPageProps extends PageProps {
   supplier: Supplier;
}

export interface DrugIndexPageProps extends PageProps {
   drugs: PaginatedResponse<Drug>;
   filters: { search?: string; category?: string; status?: string };
   categories: string[];
}

export interface BatchIndexPageProps extends PageProps {
   batches: PaginatedResponse<Batch>;
   filters: { search?: string; status?: string; expiry?: string };
}

export interface UsageIndexPageProps extends PageProps {
   records: PaginatedResponse<UsageRecord>;
   filters: { search?: string; department?: string; from?: string; to?: string };
   departments: string[];
}