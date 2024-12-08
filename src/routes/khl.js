import express from 'express';
import KHLController from '../controllers/khl.js';

const KHLRoute = express.Router()
  .get('/schedule', KHLController.parseSchedule);

export default KHLRoute;