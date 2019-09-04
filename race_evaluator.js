import { getRaceInfo, getLaps } from "./services/file_service";

async function main() {
  const filename = process.argv.slice(2)[0];

  const laps = await getLaps(filename);

  console.log(laps);
}

main();