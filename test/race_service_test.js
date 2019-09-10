
var raceService = require('../services/race_service');
var raceRepository = require('../repositories/race_repository');
var assert = require('assert');
var moment = require('moment');

const raceServiceInstance = raceService.raceService();
const raceRepositoryInstance = raceRepository.raceRepository();

describe('Race service time completed', function() {
  it('Time completed must not have more than 24 hours', function() {
    try {
      raceServiceInstance.private.validation.parseTimeCompleted("25:00:00.000", 1);
      assert.fail('expected exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfTimeCompleted")
    }
  });

  it('Time completed correct format', function() {
    let timeCompleted = raceServiceInstance.private.validation.parseTimeCompleted("23:00:00.000", 1);
    assert.equal(timeCompleted.format('HH:mm'), '23:00');
  });

  it('Time completed random format must throw exception', function() {
    try {
      raceServiceInstance.private.validation.parseTimeCompleted("123123", 1);
      assert.fail('expected exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfTimeCompleted")
    }
  });
});

describe('Race service ellapsed time', function() {
  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("1.000", 1);
    assert.equal(duration._data.seconds, 1);
  });

  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("00:00:11.000", 1);
    assert.equal(duration._data.seconds, 11);
  });

  it('Wront format of minutes, it should have less than 60', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("00:99:13.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });

  it('Only minutes duration', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("00:56:13.000", 1);
      assert.equal(duration._data.minutes, 56);      
      assert.equal(duration._data.seconds, 13);      
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });

  it('Hours duration duration', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("88:56:13.000", 1);
      assert.equal(duration._data.minutes, 56);      
      assert.equal(duration._data.seconds, 13);     
      assert.equal(duration._data.hours, 16);      
      assert.equal(duration._data.days, 3);      
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });

  it('Ellapsed time wrong format, it should have 00:00:00.000', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("000:00:11.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });
});

describe('Race service ellapsed time', function() {
  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("1.000", 1);
    assert.equal(duration._data.seconds, 1);
  });

  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("00:00:11.000", 1);
    assert.equal(duration._data.seconds, 11);
  });

  it('Wront format of minutes, it should have less than 60', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("00:99:13.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });

  it('Only minutes duration', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("00:56:13.000", 1);
      assert.equal(duration._data.minutes, 56);      
      assert.equal(duration._data.seconds, 13);      
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });

  it('Hours duration duration', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("88:56:13.000", 1);
      assert.equal(duration._data.minutes, 56);      
      assert.equal(duration._data.seconds, 13);     
      assert.equal(duration._data.hours, 16);      
      assert.equal(duration._data.days, 3);      
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });

  it('Ellapsed time wrong format, it should have 00:00:00.000', function() {
    try {
      let duration = raceServiceInstance.private.validation.parseLapEllapsedTime("000:00:11.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });
});

describe('Parse lap number test', function() {
  it('Not numeric lap number', function() {
    try {
      let lap = raceServiceInstance.private.validation.parseLapNumber("as232", 1);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapNumber");
    }
  });
  
  it('Negative lap number', function() {
    try {
      let lap = raceServiceInstance.private.validation.parseLapNumber("-1", 1);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapNumber");
    }
  });
  
  it('Valid lap number', function() {
    try {
      let lap = raceServiceInstance.private.validation.parseLapNumber("4", 1);
      assert.equal(4, lap);
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });
});

describe('Parse average speed test', function() {
  it('Average speed with dot parse', function() {
    try {
      let avgSpeed = raceServiceInstance.private.validation.parseAverageSpeed("1232.02320", 1);
      let expectedAvgSpeed = 1232.0232;
      assert.equal(avgSpeed, expectedAvgSpeed);
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });
  
  it('Average speed with dot parse', function() {
    try {
      let avgSpeed = raceServiceInstance.private.validation.parseAverageSpeed("1232,40", 1);
      let expectedAvgSpeed = 1232.40;
      assert.equal(avgSpeed, expectedAvgSpeed);
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });
  
  it('Wrong format of average speed string', function() {
    try {
      let avgSpeed = raceServiceInstance.private.validation.parseAverageSpeed("a123d", 1);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfAverageSpeed");
    }
  });
});

describe('Save lap to pilot test', function () {
  const testPilotId = '1';
  const testPilotName = 'Test Pilot';
  const lineNumber = 1;
  const lap = raceRepositoryInstance.buildLap(moment(), testPilotId, testPilotName, 1, moment.duration(100), 24.23);

  it('Save lap 2 without an entry for lap one should not work', function() {
    try {
      const otherLap = Object.assign({}, lap);
      otherLap.lapNumber = 2;
      raceServiceInstance.private.saveLapToPilot(otherLap, testPilotId, testPilotName, lineNumber);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "NotFoundRacerForAPreviousLap");
    }
  });

  it('Save lap 1 to the pilot should work', function() {
    try {
      const otherLap = Object.assign({}, lap);
      otherLap.lapNumber = 1;

      raceServiceInstance.private.saveLapToPilot(otherLap, testPilotId, testPilotName, lineNumber);

      let pilotsLap = raceServiceInstance.getAllLapsByPilots()[testPilotId];

      assert.equal(pilotsLap.laps.length, 1);
    } catch(exception) {
      assert.fail('exception thrown', exception);
    }
  });

  it('Save lap 2 to the pilot should work', function() {
    try {
      const otherLap = Object.assign({}, lap);
      otherLap.lapNumber = 2;
      otherLap.timeCompleted = moment().add(5, 'minute');

      raceServiceInstance.private.saveLapToPilot(otherLap, testPilotId, testPilotName, lineNumber);

      let pilotsLap = raceServiceInstance.getAllLapsByPilots()[testPilotId];

      assert.equal(pilotsLap.laps.length, 2);
    } catch(exception) {
      assert.fail('exception thrown', exception);
    }
  });

  it('Save lap 2 to the pilot should not work (duplicate)', function() {
    try {
      const otherLap = Object.assign({}, lap);
      otherLap.lapNumber = 2;

      raceServiceInstance.private.saveLapToPilot(otherLap, testPilotId, testPilotName, lineNumber);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "ThereIsAlreadyDataForThisLap");
    }
  });

  it('Save lap 1 to the pilot should not work (duplicate)', function() {
    try {
      const otherLap = Object.assign({}, lap);
      otherLap.lapNumber = 1;

      raceServiceInstance.private.saveLapToPilot(otherLap, testPilotId, testPilotName, lineNumber);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "ThereIsAlreadyDataForThisLap");
    }
  });

  it('Third lap should not have completed before second lap', function() {
    try {
      const otherLap = Object.assign({}, lap);
      otherLap.lapNumber = 3;
      otherLap.timeCompleted = moment().add( -5, 'minute');

      raceServiceInstance.private.saveLapToPilot(otherLap, testPilotId, testPilotName, lineNumber);
      assert.fail('exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "NextLapBeforePreviousLap");
    }
  });
});