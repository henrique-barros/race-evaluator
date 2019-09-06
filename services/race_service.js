import moment from 'moment';

import { raceRepository } from '../repositories/race_repository';
import { fileService } from './file_service';

export const raceService = () => {
  const raceRepositoryInstance = raceRepository();
  const fileServiceInstance = fileService();

  const saveLapBasedOnString = (lapString) => {

    let lapStringArray = lapString.split(/\s+/);
    let timeCompleted = moment(lapStringArray[0], 'HH:mm:ss.SSS');
    let racerId = lapStringArray[1];
    let racerName = lapStringArray[3];
    let lapNumber = lapStringArray[4];
    let lapEllapsedTime = lapStringArray[5].length === 10 ? 
      moment.duration(`00:${lapStringArray[5]}`) :
      moment.duration(`00:0${lapStringArray[5]}`);
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

  const getRaceResultsbyPilot = () => {
    const racersData = raceRepositoryInstance.getLapsByPilot();
    let racerIds = Object.keys(racersData);
    return racerIds.reduce((acc, racerId) => {
      let racer = racersData[racerId];
      let endOfTheRace = racer.laps[racer.laps.length -1].timeCompleted;
      let startOfTheRace = (racer.laps[0].timeCompleted).subtract(racer.laps[0].lapEllapsedTime);
      if (endOfTheRace.isBefore(startOfTheRace)) endOfTheRace.add(1, 'day');
      let data = {
        racerId: racerId,
        racerName: racer.name,
        numberOfLapsCompleted: racer.laps.length,
        totalTimeOfRace: moment.utc(endOfTheRace.diff(startOfTheRace)).format('HH:mm:ss.SSS')
      }
      acc.push(data);
    }, []);
  };

  return {
    getAllLaps,
    readAndParseLapsDataFromFile,
    getRaceResultsbyPilot,
    getAllLapsByPilots: raceRepositoryInstance.getLapsByPilot
  }
}