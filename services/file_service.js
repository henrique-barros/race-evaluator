const fs = require('fs').promises;

export const fileService = () => {

  const errors = {
    ReadingFileException: () => ({
      type: "ReadingFileException",
      message: "Error reading file. Make sure the file exists."
    }),
    WrongFileFormatException: () => ({
      type: "WrongFileFormatException",
      message: "Wrong file format. The first line is ignored because it's header, make sure the file contains at least one line of race data."
    })
  };

  const getData = async (filename) => {
    const data = await fs.readFile(filename, 'utf8');
    return data;
  }

  // Validação de erro aqui: problema ao ler arquivo, arquivo inexistente
  const getFileLines = async (fileName) => {
    let data;
    try {
      data = await getData(fileName);
    } catch (error) {
      throw (new errors.ReadingFileException());
    }
    try {
      let lines = getContentSplittedByNewLine(data);
      return lines;
    } catch (error ) {
      throw (new errors.WrongFileFormatException());
    }
    
  }
  
  const getContentSplittedByNewLine = (raceData) => {
    try {
      const lapsStrings = raceData.split('\n');
      if (lapsStrings.length <= 1) {
        throw(new errors.WrongFileFormatException());
      }
      return lapsStrings;
    }
    catch (exception) {
      throw(new errors.WrongFileFormatException());
    }
  }

  return {
    getFileLines
  }
}

