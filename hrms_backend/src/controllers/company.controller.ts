import { Request, Response } from "express";
import { registerCompanyService, getCompanyProfileService } from "../services/company.service";

export const registerCompany = async (req: Request, res: Response) => {
  try {
    const result = await registerCompanyService(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
      data: result,
    });
  } catch (error: any) {

    console.log(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const getCompanyProfile = async (req: Request,res: Response) => {
  try {
    const companyId =
(req as any).user.companyId;

    const result = await getCompanyProfileService(
        companyId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message:error.message,
    });

  }
};