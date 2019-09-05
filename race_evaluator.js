import { raceService } from "./services/race_service";

async function main() {
  const raceServiceInstance = raceService();

  const filename = process.argv.slice(2)[0];

  await raceServiceInstance.readAndParseLapsDataFromFile(filename);

  console.log(raceServiceInstance.getAllLapsByPilots());
}

main();