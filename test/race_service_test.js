
var raceService = require('../services/race_service');
var assert = require('assert');

const raceServiceInstance = raceService.raceService();

describe('Race service time completed', function() {
  it('Time completed must not have more than 24 hours', function() {
    try {
      raceServiceInstance.validation.parseTimeCompleted("25:00:00.000", 1);
      assert.fail('expected exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfTimeCompleted")
    }
  });

  it('Time completed correct format', function() {
    let timeCompleted = raceServiceInstance.validation.parseTimeCompleted("23:00:00.000", 1);
    assert.equal(timeCompleted.format('HH:mm'), '23:00');
  });

  it('Time completed random format must throw exception', function() {
    try {
      raceServiceInstance.validation.parseTimeCompleted("123123", 1);
      assert.fail('expected exception not thrown');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfTimeCompleted")
    }
  });
});

describe('Race service ellapsed time', function() {
  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.validation.parseLapEllapsedTime("1.000", 1);
    assert.equal(duration._data.seconds, 1);
  });

  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.validation.parseLapEllapsedTime("00:00:11.000", 1);
    assert.equal(duration._data.seconds, 11);
  });

  it('Wront format of minutes, it should have less than 60', function() {
    try {
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("00:99:13.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });

  it('Only minutes duration', function() {
    try {
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("00:56:13.000", 1);
      assert.equal(duration._data.minutes, 56);      
      assert.equal(duration._data.seconds, 13);      
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });

  it('Hours duration duration', function() {
    try {
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("88:56:13.000", 1);
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
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("000:00:11.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });
});

describe('Race service ellapsed time', function() {
  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.validation.parseLapEllapsedTime("1.000", 1);
    assert.equal(duration._data.seconds, 1);
  });

  it('Ellapsed time with just seconds', function() {
    let duration = raceServiceInstance.validation.parseLapEllapsedTime("00:00:11.000", 1);
    assert.equal(duration._data.seconds, 11);
  });

  it('Wront format of minutes, it should have less than 60', function() {
    try {
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("00:99:13.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });

  it('Only minutes duration', function() {
    try {
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("00:56:13.000", 1);
      assert.equal(duration._data.minutes, 56);      
      assert.equal(duration._data.seconds, 13);      
    } catch(exception) {
      assert.fail('exception thrown');
    }
  });

  it('Hours duration duration', function() {
    try {
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("88:56:13.000", 1);
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
      let duration = raceServiceInstance.validation.parseLapEllapsedTime("000:00:11.000", 1);
      assert.fail('did not throw exception');
    } catch(exception) {
      assert.equal(exception.type, "WrongFormatOfLapEllapsedTime");
    }
  });
});

