const fs = require('fs').promises;

async function getData(filename) {
  const data = await fs.readFile(filename, 'utf8');
  return data;
}

const getRaceLaps = (raceData) => {
  const lapsStrings = raceData.split('\n');
  return lapsStrings;
}

export const getRaceInfo = (filename) => {
  return getData(filename);
}

export const getLaps = async (fileName) => {
  let data = await getData(fileName);
  let laps = getRaceLaps(data);
  return getLap(laps[1]);
}

const getLap = (lapString) => {
  let lapStringArray = lapString.split(/\s+/);
  return {
    timeCompleted: lapStringArray[0],
    racerId: lapStringArray[1],
    racerName: lapStringArray[3],
    lapNumber: lapStringArray[4],
    lapEllapsedTime: lapStringArray[5],
    avgSpeed: lapStringArray[6]
  }
}