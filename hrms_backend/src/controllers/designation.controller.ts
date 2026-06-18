import {Request,Response}from "express";
import {createDesignationService,getDesignationsService,updateDesignationService,deleteDesignationService, getDesignationByDepartmentService}from "../services/designation.service";

export const createDesignation =async (req:Request,res:Response) => {

  const dbName =(req as any).user.dbName;
  const result =await createDesignationService(
    dbName,
    req.body
  );
  return res.status(201).json({
    success:true,
    data:result
  });
};

export const getDesignations =async (req:Request,res:Response) => {

  const dbName =(req as any).user.dbName;
  const result = await getDesignationsService(dbName);
  return res.status(200).json({
    success:true,
    data:result
  });
};

export const updateDesignation =async (req:any,res:any) => {

  const result = await updateDesignationService(
    req.user.dbName,
    req.params.id,
    req.body
  );
  res.json({
    success:true,
    data:result
  });
};

export const deleteDesignation =async (req:any,res:any) => {

  await deleteDesignationService(
    req.user.dbName,
    req.params.id
  );

  res.json({
    success:true,
    message: "Designation deleted successfully"
  });
};

export const getDesignationByDepartment = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
   const departmentId = req.params.departmentId as string;
    const result = await getDesignationByDepartmentService(
        dbName,
        departmentId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};