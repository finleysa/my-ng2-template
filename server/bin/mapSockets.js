const MapLayer = require('../models/mapLayer');
const CellMonitoring = require('../models/cellMonitoring');
const nmea = require('./nmea');
let io = require('socket.io');
let latestDate = 0;
var cellUpdateTimer;

export function SocketServer(app, server){
  io = io(server);
  io.on('connection', function(socket){
    console.log('a user connected');
    exports.GetLayers(socket);
    socket.on('LayerAdded',   exports.Insert);
    socket.on('RemoveLayer',  exports.RemoveLayer);
    socket.on('RemoveLayers', exports.RemoveLayers);
    socket.on('ChangePort',   nmea.changePort);
    socket.on('GetPorts',   nmea.GetPorts);
    //socket.on('GetGPS', nmea.GetGPS)
  });
}

export function Insert(data){
  var newLayer = new MapLayer(data);
  newLayer.insert(function(err, result){
    if(err) {
      logger.error('mapSockets: ' + err);
    }
    else {
      console.log('Layer added');
      io.emit('AddLayer', newLayer);
    }
  });
}

export function RemoveLayers(){
  MapLayer.removeLayers(function(err, number){
    if(err) {
      logger.error('mapSockets: ' + err);
    }
    else {
      console.log('Removed layers: ' + number);
      io.emit('RemoveLayers');
    }
  })
}

export function RemoveLayer(layer){
  var id = layer._id;
  MapLayer.removeLayers(id, function(err, number){
    if(err) {
      logger.error('mapSockets: ' + err);
    }
    else {
      console.log('Removed layer: ' + id);
    }
  })
}

export function GetLayers(socket) {
  MapLayer.findAll(function(err, records){
    if(err) {
      logger.error('mapSockets: ' + err);
    }
    else {
      console.log('Emitting GeoJSON layers: ' + records.length);
      //fn(records);
      socket.emit('AllLayers', records);
    }
  });
}

export function EmitGPS(nmea){
  try {
    io.emit('GPS', nmea)
  } catch (e) {
    logger.error('mapSockets: ' + e);
  }
}

export function EmitPorts(ports){
  try {
    io.emit('EmitPorts', ports)
  } catch (e) {
    logger.error('mapSockets: ' + e);
  }
}

export function beginCellMonitoring(date) {
  console.log("DATE: " + date);

  latestDate = date;
  cellUpdateTimer = setInterval(startCellMonitoringTimer, 5 * 5000);
}

function startCellMonitoringTimer() {
  CellMonitoring.findAll({ date: { $gt: latestDate } }, function(err, records) {
    console.log(records);
    if(records.length > 0) {
      io.emit('NewCellData', records)
    }
  });
}
