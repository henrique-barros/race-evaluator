export const raceRepository = () => {
  let laps = [];

  let lapsByPilot = {};

  return {
    saveLap: (timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed) => {
      let lap = {
        timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed
      }
      laps.push(lap);

      return lap;
    },
    saveLapToPilot: (lap, racerId, racerName) => {
      let currentRacerIds = Object.keys(lapsByPilot);

      delete lap.racerName;
      delete lap.racerId;

      if (currentRacerIds.includes(racerId)) {
        lapsByPilot[racerId].laps.push(lap);
      } else {
        lapsByPilot[racerId] = {
          name: racerName,
          laps: [
            lap
          ]
        };
      }

    },
    getLaps: () => {
      return laps;
    },
    getLapsByPilot: () => {
      return lapsByPilot;
    }
  }
}