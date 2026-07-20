import { getTenantConnection } from "../connection/tenant.connection";
import { Team } from "../entity/tenant/team.entity";
import { Department } from "../entity/tenant/department.entity";

export const createTeamService = async (
  dbName: string,
  payload: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const teamRepo = dataSource.getRepository(Team);
  const departmentRepo = dataSource.getRepository(Department);

  // Check Department
  const department = await departmentRepo.findOne({
    where: {
      id: payload.departmentId,
      is_deleted: false,
    },
  });

  if (!department) {
    throw new Error("Department not found");
  }

  // Check Duplicate Team
  const exists = await teamRepo.findOne({
    where: {
      teamName: payload.teamName,
      is_deleted: false,
    },
  });

  if (exists) {
    throw new Error("Team already exists");
  }

  const team = await teamRepo.save({
    teamName: payload.teamName,
    departmentId: payload.departmentId,
    status: payload.status || "Active",
  });

  return team;
};

export const getTeamsService = async (dbName: string) => {
  const dataSource = await getTenantConnection(dbName);

  const teamRepo = dataSource.getRepository(Team);

  return await teamRepo.find({
    where: {
      is_deleted: false,
    },
    relations: {
      department: true,
    },
  });
};

export const getTeamByIdService = async (
  dbName: string,
  id: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const teamRepo = dataSource.getRepository(Team);

  const team = await teamRepo.findOne({
    where: {
      id,
      is_deleted: false,
    },
    relations: {
      department: true,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }
  return team;
};

export const updateTeamService = async (
  dbName: string,
  id: string,
  payload: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const teamRepo = dataSource.getRepository(Team);

  const departmentRepo = dataSource.getRepository(Department);

  const team = await teamRepo.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (payload.departmentId) {
    const department = await departmentRepo.findOne({
      where: {
        id: payload.departmentId,
        is_deleted: false,
      },
    });

    if (!department) {
      throw new Error("Department not found");
    }

    team.departmentId = payload.departmentId;
  }

  if (payload.teamName) {
    team.teamName = payload.teamName;
  }

  if (payload.status) {
    team.status = payload.status;
  }

  return await teamRepo.save(team);
};

export const deleteTeamService = async (
  dbName: string,
  id: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const teamRepo = dataSource.getRepository(Team);

  const team = await teamRepo.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  team.is_deleted = true;

  await teamRepo.save(team);

  return true;
};