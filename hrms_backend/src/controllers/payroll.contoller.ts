import { Request, Response } from "express";

import {
  createPayrollService,
  getAllPayrollService,
  getPayrollByIdService,
  updatePayrollService,
  processPayrollService,
} from "../services/payroll.service";


export const createPayroll = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const payroll = await createPayrollService(
      dbName,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Payroll created successfully",
      data: payroll,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getAllPayroll = async (
  req: Request,
  res: Response
) => {

  try {

    const dbName = (req as any).user.dbName;

    const payroll = await getAllPayrollService(dbName);

    return res.status(200).json({
      success: true,
      message: "Payroll fetched successfully",
      data: payroll,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const getPayrollById = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const payroll = await getPayrollByIdService(
      dbName,
      Number(req.params.id)
    );
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: payroll,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const updatePayroll = async (
  req: Request,
  res: Response
) => {

  try {

    const dbName = (req as any).user.dbName;

    const payroll = await updatePayrollService(
      dbName,
      Number(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Payroll updated successfully",
      data: payroll,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



export const processPayroll = async (
  req: Request,
  res: Response
) => {

  try {

    const dbName = (req as any).user.dbName;

    const payroll = await processPayrollService(
      dbName,
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      message: "Payroll processed successfully",
      data: payroll,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};