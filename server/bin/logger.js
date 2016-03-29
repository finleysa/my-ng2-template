const winston = require('winston');

export function connect() {
  try{
    global.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'test.log' })
      ]
    });
  }
  catch(err)
  {
    console.log('Could not start Winston Logger: ' + err);
  }
};
