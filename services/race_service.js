import moment from 'moment';

import { raceRepository } from '../repositories/race_repository';
import { fileService } from './file_service';

export const raceService = () => {
  const raceRepositoryInstance = raceRepository();
  const fileServiceInstance = fileService();

  const errors = {
    WrongFormatOfLapException: (lineNumber) => ({
      type: "WrongFormatOfLap",
      message: `The lap (line number ${lineNumber} of the file) should follow the example: "23:49:08.277 038 – F.MASSA 1	1:02.852 44,275", to match "Time, ID_Pilot - Name_Pilot, Lap number, Lap Ellapsed Time, Average speed of the lap", so don't forget to respect the spaces`
    }),
    WrongFormatOfLapEllapsedTime: (lineNumber) => ({
      type: "WrongFormatOfLapEllapsedTime",
      message: `The time ellapsed input of the lap (line number ${lineNumber} of the file) should conform the pattern: 00:00:00.000 and it must contain at least one second`
    }),
    WrongFormatOfTimeCompleted: (lineNumber) => ({
      type: "WrongFormatOfTimeCompleted",
      message: `The time completed of the lap (line number ${lineNumber} of the file) should conform the pattern: 00:00:00.000 with a 24 hour pattern`
    }),
    WrongFormatOfLapNumber: (lineNumber) => ({
      type: "WrongFormatOfLapNumber",
      message: `The lap number of the lap (line number ${lineNumber}) should be a positive non-zero number`
    }),
    WrongFormatOfAverageSpeed: (lineNumber) => ({
      type: "WrongFormatOfAverageSpeed",
      message: `The average speed of the lap (line number ${lineNumber}) should be a valid number`
    }),
    ThereIsAlreadyDataForThisLap: (lineNumber) => ({
      type: "ThereIsAlreadyDataForThisLap",
      message: `(Line number ${lineNumber}) there is already data for this lap number for this pilot`
    }),
    NotFoundRacerForAPreviousLap: (lineNumber) => ({
      type: "NotFoundRacerForAPreviousLap",
      message: `(Line number ${lineNumber}) The racer with this racerId did not complete a previous lap. The previous laps should appear first in the file`
    }),
    NextLapBeforePreviousLap: (lineNumber) => ({
      type: "NextLapBeforePreviousLap",
      message: `(Line number ${lineNumber}) The previous lap is after the lap being inserted, this can't happen.`
    })
  }

  const parseTimeCompleted = (timeCompletedString, lineNumber) => {
    let pattern = /^([01]\d|2[0-3]):[0-5][0-9]:[0-5][0-9]\.[0-9][0-9][0-9]$/;
    if (pattern.test(timeCompletedString)) {
      return moment(timeCompletedString, 'HH:mm:ss.SSS');
    } else {
      throw (new errors.WrongFormatOfTimeCompleted(lineNumber))
    }
  }

  const parseLapEllapsedTime = (lapEllapsedTimeString, lineNumber) => {
    let pattern = /^[0-9][0-9]:[0-5][0-9]:[0-5][0-9]\.[0-9][0-9][0-9]$/;
    switch (lapEllapsedTimeString.length) {
      case 5:
        lapEllapsedTimeString = `00:00:0${lapEllapsedTimeString}`;
        break;
      case 6:
        lapEllapsedTimeString = `00:00:${lapEllapsedTimeString}`;
        break;
      case 8:
        lapEllapsedTimeString = `00:0${lapEllapsedTimeString}`;
        break;
      case 9:
        lapEllapsedTimeString = `00:${lapEllapsedTimeString}`;
        break;
      case 11:
        lapEllapsedTimeString = `0${lapEllapsedTimeString}`;
        break;
    }
    if (pattern.test(lapEllapsedTimeString)) {
      return moment.duration(lapEllapsedTimeString);
    } else {
      throw (new errors.WrongFormatOfLapEllapsedTime(lineNumber));
    }
  }

  const parseLapNumber = (lapNumber, lineNumber) => {
    lapNumber = parseInt(lapNumber);
    if (!isNaN(lapNumber) && isFinite(lapNumber) && lapNumber > 0)
      return lapNumber;
    else 
      throw (new errors.WrongFormatOfLapNumber(lineNumber));
  }

  const parseAverageSpeed = (avgSpeed, lineNumber) => {
    avgSpeed = parseFloat(avgSpeed.replace(',', '.'));
    if (!isNaN(avgSpeed) && isFinite(avgSpeed) && avgSpeed > 0)
      return avgSpeed;
    else 
      throw (new errors.WrongFormatOfAverageSpeed(lineNumber));
  }

  const saveLapToPilot = (lap, racerId, racerName, lineNumber) => {
    let previousLap = raceRepositoryInstance.getLap(racerId, lap.lapNumber - 1);

    if (raceRepositoryInstance.getLap(racerId, lap.lapNumber) !== null) {
      throw (new errors.ThereIsAlreadyDataForThisLap(lineNumber));
    } else if (lap.lapNumber !== 1 && previousLap === null) {
      throw (new errors.NotFoundRacerForAPreviousLap(lineNumber));
    } else if (previousLap && previousLap.timeCompleted.isSameOrAfter(lap.timeCompleted)) {
      throw (new errors.NextLapBeforePreviousLap(lineNumber));
    } else {
      raceRepositoryInstance.saveLapToPilot(lap, racerId, racerName);
    }
  };
  
  const saveLapBasedOnString = (lapString, lineNumber) => {
    let lapStringArray = lapString.split(/\s+/);
    if (lapStringArray.length !== 7) {
      throw(new errors.WrongFormatOfLapException(lineNumber));
    }
    let timeCompleted = parseTimeCompleted(lapStringArray[0], lineNumber);
    let racerId = lapStringArray[1];
    let racerName = lapStringArray[3];
    let lapNumber = parseLapNumber(lapStringArray[4], lineNumber);
    let lapEllapsedTime = parseLapEllapsedTime(lapStringArray[5], lineNumber);
    let avgSpeed = parseAverageSpeed(lapStringArray[6], lineNumber);

    let lap = raceRepositoryInstance.buildLap(timeCompleted, racerId, racerName, lapNumber, lapEllapsedTime, avgSpeed);
    saveLapToPilot(lap, lap.racerId, lap.racerName, lineNumber);
  }

  const readAndParseLapsDataFromFile = async (filename) => {
    try {
      let lapStrings = await fileServiceInstance.getFileLines(filename);
      // Here we are passing i + 2 because the line number is 0 plus 1 (lines start with 1) plus the first line (header)
      lapStrings.slice(1).map((lapString, i) => saveLapBasedOnString(lapString, i + 2));
    } catch (exception) {
      throw(exception);
    }
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
    readAndParseLapsDataFromFile,
    getRaceResultsbyPilot,
    getAllLapsByPilots: raceRepositoryInstance.getLapsByPilot,
    errors,
    
    // private methods exposed for testing purposes
    private: {
      validation: {
        parseTimeCompleted,
        parseLapEllapsedTime,
        parseAverageSpeed,
        parseLapNumber
      },
      saveLapToPilot
    }
  }
}