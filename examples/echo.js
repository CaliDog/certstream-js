const CertStreamClient = require('../lib/index.js');

let client = new CertStreamClient(function(message){
    console.log("Received -> ", message)
});

client.connect();
