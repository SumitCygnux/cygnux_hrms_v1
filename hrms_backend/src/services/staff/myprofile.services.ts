import { getTenantConnection } from "../../connection/tenant.connection";
import { Staff } from "../../entity/tenant/staff.entity";

export const getMyProfileService = async (
  dbName: string,
  staffId: number
) => {

  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);

  const staff = await staffRepo.findOne({
    where: {
      id: staffId,
    },
    relations: {
    department: true,
  designation: true,
  accessRole: true
    },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  return staff;
};


export const updateMyProfileService = async (
  dbName: string,
  staffId: number,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);

  const staff = await staffRepo.findOne({
    where: {
      id: staffId,
    },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  staff.fullName = data.name;
  staff.email = data.email;
  staff.phone = data.phone;
  staff.address = data.address;

  return await staffRepo.save(staff);
};