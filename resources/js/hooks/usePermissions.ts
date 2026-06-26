import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types/inertia';

export function usePermissions() {
  const { auth } = usePage<PageProps>().props;
  const permissions = auth.user?.permissions || [];
  const roles = auth.user?.roles || [];

  const can = (permission: string): boolean => {
    return permissions.includes(permission) || roles.includes('super_admin');
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role) || roles.includes('super_admin');
  };

  return { can, hasRole, permissions, roles };
}