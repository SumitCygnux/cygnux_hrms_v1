import { useContext } from "react";
import { PermissionContext } from "../context/PermissionContext";

export default function usePermission() {
  const { permissions } = useContext(PermissionContext);

  const hasViewPermission = (moduleKey) => {

    console.log("Checking Module =>", moduleKey);

    console.log("Permissions =>", permissions);

    const permission = permissions.find(
      (p) => p.module === moduleKey
    );

    console.log("Matched Permission =>", permission);

    return permission?.operations?.view === true;
  };

  return {
    hasViewPermission,
  };
}