import { raceRepository } from '../repositories/race_repository';
import { fileService } from './file_service';

export const raceService = () => {
  const raceRepositoryInstance = raceRepository();
  const fileServiceInstance = fileService();

  const saveLapBasedOnString = (lapString) => {

    let lapStringArray = lapString.split(/\s+/);
    let timeCompleted = lapStringArray[0];
    let racerId = lapStringArray[1];
    let racerName = lapStringArray[3];
    let lapNumber = lapStringArray[4];
    let lapEllapsedTime = lapStringArray[5];
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

  const getAllRaceInfoFromPilots = () => {};

  return {
    getAllLaps,
    readAndParseLapsDataFromFile,
    getAllRaceInfoFromPilots,
    getAllLapsByPilots: raceRepositoryInstance.getLapsByPilot
  }
}