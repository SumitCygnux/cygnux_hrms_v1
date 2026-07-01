import { Request, Response } from "express";
import { applyLeaveService ,getLeaveService} from "../../services/staff/staff.leave.service";

export const applyLeave = async (
  req: Request,
  res: Response
) => {
  try {

    const dbName = (req as any).user.dbName;
    const staffId = (req as any).user.userId;

    if (isNaN(Number(staffId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid session staffId. Please log out and log back in.",
      });
    }

    console.log("applyLeave DEBUG - dbName:", dbName, "staffId:", staffId, "user:", (req as any).user, "body:", req.body);
   
    const leave = await applyLeaveService(
      dbName,
      Number(staffId),
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Leave Applied Successfully",
      data: leave,
    });

  } 
 catch (error: any) {
  console.error("Leave Error:", error);

  return res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}
};

export const getLeave = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;
    const staffId = (req as any).user.userId;

    if (isNaN(Number(staffId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid session staffId. Please log out and log back in.",
      });
    }

    const leaves = await getLeaveService(
      dbName,
      Number(staffId)
    );

    return res.status(200).json({
      success: true,
      message: "Leave fetched successfully",
      data: leaves,
    });
  } catch (error: any) {
    console.error("Get Leave Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};