export const raceRepository = () => {
  let laps = [];

  return {
    saveLap: (timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed) => {
      const lap = {
        timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed
      }
      laps.push(lap);
    },
    getLaps: () => {
      return laps;
    }
  }
}