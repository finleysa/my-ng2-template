module.exports = GPS;

function GPS(){};

GPS.insert = function(line, fn) {
  try {
    var nmea = global.webmap.db.collection('nmea');

    nmea.insert(line, function(err, record){
      fn(err, record);
    });
  }
  catch(err){
    logger.error('GPS: ' + err);
  }
};

GPS.findByDate = function(date, fn) {
  try {
    var nmea = global.webmap.db.collection('nmea');
    nmea.find({date: date, sentence: 'GGA'}).toArray(function(err, records){
      if(!err) {
        fn(records);
      }
    });
  }
  catch(err) {
    logger.error('GPS: ' + err);
  }
}

GPS.findByQuery = function(query, fn) {
  try {
    var nmea = global.webmap.db.collection('nmea');
    nmea.find(query).toArray(function(err, records){
      if(!err) {
        fn(records);
      }
    });
  }
  catch(err) {
    logger.error('GPS: ' + err);
  }
}
