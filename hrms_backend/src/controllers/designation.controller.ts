import {Request,Response}from "express";
import {createDesignationService,getDesignationsService}from "../services/designation.service";

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