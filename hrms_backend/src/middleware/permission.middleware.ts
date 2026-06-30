import { Request, Response, NextFunction } from "express";
import { getTenantConnection } from "../connection/tenant.connection";
import { Permission } from "../entity/tenant/permissions.entity";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

export const checkPermission =
  (permissionName: string) =>
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { dbName, roleId } = req.user;

      const dataSource = await getTenantConnection(dbName);

      const permissionRepo =
        dataSource.getRepository(Permission);

      const rolePermissionRepo =
        dataSource.getRepository(RolePermission);

      const permission = await permissionRepo.findOne({
        where: {
          name: permissionName,
        },
      });

      if (!permission) {
        return res.status(404).json({
          success: false,
          message: "Permission not found",
        });
      }

      const rolePermission =
        await rolePermissionRepo.findOne({
          where: {
            roleId,
            permissionId: permission.id,
          },
        });

      if (!rolePermission) {
        return res.status(403).json({
          success: false,
          message: "Access Denied",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Permission Check Failed",
      });
    }
  };