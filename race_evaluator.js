import { raceService } from "./services/race_service";
import { fileService } from "./services/file_service";

async function main() {
  const raceServiceInstance = raceService();
  const filename = process.argv.slice(2)[0];

  try {
    await raceServiceInstance.readAndParseLapsDataFromFile(filename);
    console.log(raceServiceInstance.getRaceResultsbyPilot());
  } catch (error) {
    console.log(error.message)
  }

}

main();