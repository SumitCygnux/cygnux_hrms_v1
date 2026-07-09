export function usePermission(moduleIdentifier) {
 
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const modulePerm = permissions.find(p => p.identifier === moduleIdentifier);

  return {
    canView: modulePerm?.operations?.view || false,
    canCreate: modulePerm?.operations?.create || false,
    canUpdate: modulePerm?.operations?.update || false,
    canDelete: modulePerm?.operations?.delete || false,
    canApprove: modulePerm?.operations?.approve || false,
    canExport: modulePerm?.operations?.export || false,
  };
}
