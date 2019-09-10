export const raceRepository = () => {
  let laps = [];
  let lapsByPilot = [];

  return {
    buildLap: (timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed) => {
      let lap = {
        timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed
      }

      return lap;
    },



    saveLapToPilot: (lap, racerId, racerName, lineNumber) => {
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
    getLapsByPilot: () => {
      return lapsByPilot;
    },
    getLap: (racerId, lapNumber) => {
      let racerIds = Object.keys(lapsByPilot);
      if (!racerIds.includes(racerId)) {
        return null;
      } else {
        let laps = lapsByPilot[racerId].laps.filter(lap => {
          return lap.lapNumber === lapNumber
        });
        if (laps.length > 0) {
          return laps[0];
        } else {
          return null;
        }
      }
    }
  }
}