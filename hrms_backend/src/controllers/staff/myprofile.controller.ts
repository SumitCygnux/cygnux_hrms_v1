import { Request, Response } from "express";
import { getMyProfileService ,updateMyProfileService} from "../../services/staff/myprofile.services";

export const getMyProfile = async (
  req: Request,
  res: Response
) => {
  try {

    const dbName = (req as any).user.dbName;
    const staffId = (req as any).user.userId;
console.log((req as any).user ,"myprofile");
console.log("User =>", (req as any).user);
console.log("StaffId =>", (req as any).user.userId);
    const profile = await getMyProfileService(
      dbName,
      Number(staffId)
    );

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });

  } catch (error: any) {

    console.error("Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMyProfile = async (
  req: Request,
  res: Response
) => {
  try {

    const dbName = (req as any).user.dbName;
    const staffId = (req as any).user.userId;

    
    
    const profile = await updateMyProfileService(
      dbName,
      Number(staffId),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });

  } catch (error: any) {

    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};