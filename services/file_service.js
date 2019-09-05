const fs = require('fs').promises;

export const fileService = () => {

  const getData = async (filename) => {
    const data = await fs.readFile(filename, 'utf8');
    return data;
  }

  const getFileLines = async (fileName) => {
    let data = await getData(fileName);
    let lines = getContentSplittedByNewLine(data);
    return lines;
  }
  
  const getContentSplittedByNewLine = (raceData) => {
    const lapsStrings = raceData.split('\n');
    return lapsStrings;
  }

  return {
    getFileLines
  }
}

