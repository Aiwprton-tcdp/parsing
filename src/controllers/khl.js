// import { Request, Response } from 'express';
import KHLService from '../services/khl.js';

const KHLController = {
  // parseSchedule: async (req: Request, res: Response) => {
  parseSchedule: async (req, res) => {
    const schedule = await KHLService.parseSchedule();
    res.json({ "data": schedule });
  },
}

export default KHLController;