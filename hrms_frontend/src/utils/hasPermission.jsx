export const hasPermission = (permission) => {

  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
    console.log("permission=>utils",permissions)
  return permissions.includes(permission);
};