export const hasPermission = (userPermissions, code) => {
    if (!userPermissions) return false;

    // Nếu userPermissions có thuộc tính permissions (như trong response)
    const permissions = userPermissions.permissions || userPermissions;

    if (!Array.isArray(permissions)) return false;

    return permissions.some((p) => p.code === code);
};