import moment from 'moment';

import { raceRepository } from '../repositories/race_repository';
import { fileService } from './file_service';

export const raceService = () => {
  const raceRepositoryInstance = raceRepository();
  const fileServiceInstance = fileService();

  const parseTimeCompleted = (timeCompletedString) => {
    return moment(timeCompletedString, 'HH:mm:ss.SSS');
  }

  const parseLapEllapsedTime = (lapEllapsedTimeString) => {
    return lapEllapsedTimeString.length === 10 ? 
      moment.duration(`00:${lapEllapsedTimeString}`) :
      moment.duration(`00:0${lapEllapsedTimeString}`);
  }

  const saveLapBasedOnString = (lapString) => {

    let lapStringArray = lapString.split(/\s+/);
    let timeCompleted = parseTimeCompleted(lapStringArray[0]);
    let racerId = lapStringArray[1];
    let racerName = lapStringArray[3];
    let lapNumber = lapStringArray[4];
    let lapEllapsedTime = parseLapEllapsedTime(lapStringArray[5]);
    let avgSpeed = lapStringArray[6];

    let lap = raceRepositoryInstance.saveLap(timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed);
    raceRepositoryInstance.saveLapToPilot(lap, lap.racerId, lap.racerName);
  }

  const getAllLaps = () => {
    return raceRepositoryInstance.getLaps();
  }

  const readAndParseLapsDataFromFile = async (filename) => {
    let lapStrings = await fileServiceInstance.getFileLines(filename);
    lapStrings.slice(1).map((lapString) => saveLapBasedOnString(lapString));
  }

  const getStartOfTheRace = (timeCompleted, lapEllapsedTime) => {
    return (timeCompleted).subtract(lapEllapsedTime);
  }
  const getEndOfTheRace = (timeCompleted, startOfTheRace) => {
    let endOfTheRace = timeCompleted;
    if (endOfTheRace.isBefore(startOfTheRace)) endOfTheRace.add(1, 'day');
    return endOfTheRace;
  }
  
  const getTotalTimeOfTheRace = (startOfTheRace, endOfTheRace) => {
    return moment.utc(endOfTheRace.diff(startOfTheRace));
  }
  
  const getRacerResultsSorted = (racerResults) => {
    const sortedRaceResults = racerResults.sort((a, b) => a.totalTimeOfRace.diff(b.totalTimeOfRace));
    return sortedRaceResults.map((result, i) => {
      result.arrivalPosition = i + 1;
      return result;
    })
  }

  const getRaceResultsbyPilot = () => {
    const racersData = raceRepositoryInstance.getLapsByPilot();
    const racerIds = Object.keys(racersData);
    const racerResults = racerIds.reduce((acc, racerId) => {
      let racer = racersData[racerId];
      let startOfTheRace = getStartOfTheRace(racer.laps[0].timeCompleted, racer.laps[0].lapEllapsedTime);
      let endOfTheRace = getEndOfTheRace(racer.laps[racer.laps.length -1].timeCompleted, startOfTheRace);
      let totalTimeOfRace = getTotalTimeOfTheRace(startOfTheRace, endOfTheRace);
      let data = {
        racerId: racerId,
        racerName: racer.name,
        numberOfLapsCompleted: racer.laps.length,
        totalTimeOfRaceFormatted: totalTimeOfRace.format('HH:mm:ss.SSS'),
        totalTimeOfRace: totalTimeOfRace
      }
      acc.push(data);
      return acc;
    }, []);

    const sortedRaceResults = getRacerResultsSorted(racerResults);
    return sortedRaceResults;
  };

  return {
    getAllLaps,
    readAndParseLapsDataFromFile,
    getRaceResultsbyPilot,
    getAllLapsByPilots: raceRepositoryInstance.getLapsByPilot
  }
}