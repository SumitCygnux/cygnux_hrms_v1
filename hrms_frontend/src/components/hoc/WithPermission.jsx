import { hasPermission } from "../../utils/hasPermission";

const WithPermission = ({ permission, children }) => {
  if (hasPermission(permission)) {
    return children;
  }

  return null;
};

export default WithPermission;
