import { GlobalRole, ProjectRole } from "@/types";

export const isGlobalAdmin = (role?: GlobalRole) => role === "super_admin" || role === "internal_admin";
export const canManageProject = (g?: GlobalRole, p?: ProjectRole) => isGlobalAdmin(g) || p === "client_admin";
export const canEditContent = (g?: GlobalRole, p?: ProjectRole) => isGlobalAdmin(g) || p === "client_admin" || p === "editor";
export const canManageFeatures = (g?: GlobalRole, p?: ProjectRole) => isGlobalAdmin(g) || p === "client_admin";
export const canManageTemplates = (g?: GlobalRole, p?: ProjectRole) => g === "super_admin" || g === "internal_admin" || p === "internal_admin";
export const canManageUsers = (g?: GlobalRole, p?: ProjectRole) => g === "super_admin" || g === "internal_admin" || p === "client_admin";
