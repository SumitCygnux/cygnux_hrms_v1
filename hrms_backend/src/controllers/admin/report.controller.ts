/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import {
  dailyReport,
  monthlyReport,
  employeeReport,
  departmentReport,
  lateReport,
  overtimeReport,
  breakReport,
  missedPunchReport,
  summaryReport,
  shiftReport,
  holidayReport,
  ReportFilters,
} from "../../services/admin/report.service";

const getUser = (req: Request) => (req as any).user as { userId: string; dbName: string };

const filtersFrom = (req: Request): ReportFilters => {
  const { startDate, endDate, date, month, departmentId, shiftId, employeeId, status } =
    req.query;
  return {
    startDate: startDate as string,
    endDate: endDate as string,
    date: date as string,
    month: month as string,
    departmentId: departmentId as string,
    shiftId: shiftId as string,
    employeeId: employeeId as string,
    status: status as string,
  };
};

const handler =
  (fn: (dbName: string, f: ReportFilters) => Promise<any>) =>
  async (req: Request, res: Response) => {
    try {
      const { dbName } = getUser(req);
      const data = await fn(dbName, filtersFrom(req));
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  };

export const getDailyReport = handler(dailyReport);
export const getMonthlyReport = handler(monthlyReport);
export const getEmployeeReport = handler(employeeReport);
export const getDepartmentReport = handler(departmentReport);
export const getLateReport = handler(lateReport);
export const getOvertimeReport = handler(overtimeReport);
export const getBreakReport = handler(breakReport);
export const getMissedPunchReport = handler(missedPunchReport);
export const getSummaryReport = handler(summaryReport);

export const getShiftReport = async (req: Request, res: Response) => {
  try {
    const { dbName } = getUser(req);
    const data = await shiftReport(dbName);
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getHolidayReport = async (req: Request, res: Response) => {
  try {
    const { dbName } = getUser(req);
    const data = await holidayReport(dbName);
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
