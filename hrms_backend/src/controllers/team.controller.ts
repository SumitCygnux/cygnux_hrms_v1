import { Request, Response } from "express";

import {
  createTeamService,
  getTeamsService,
  getTeamByIdService,
  updateTeamService,
  deleteTeamService,
} from "../services/team.service";


export const createTeam = async (
  req: Request,
  res: Response
) => {
  try {

    const dbName = (req as any).user.dbName;

    const result = await createTeamService(
      dbName,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


export const getTeams = async (
  req: Request,
  res: Response
) => {
  try {

    const dbName = (req as any).user.dbName;

    const result = await getTeamsService(dbName);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


export const getTeamById = async (
  req: Request,
  res: Response
) => {
  try {

    const dbName = (req as any).user.dbName;
    const id =req.params.id as string;
    const result = await getTeamByIdService(
      dbName,
      id
    );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};


export const updateTeam = async (
  req: any,
  res: any
) => {

  try {

    const result = await updateTeamService(
      req.user.dbName,
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};


export const deleteTeam = async (
  req: any,
  res: any
) => {

  try {

    await deleteTeamService(
      req.user.dbName,
      req.params.id
    );

    return res.json({
      success: true,
      message: "Team deleted successfully",
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};