import { Tournaments } from '../utils/tournaments.js';

const KHLService = {
  parseSchedule: async function () {
		const tClass = new Tournaments();
		const results = await tClass.parseResults();
    if (typeof results == 'string') {
      console.log(results.length);
    }
    return results;
  },
}

export default KHLService;