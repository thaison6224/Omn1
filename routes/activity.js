'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');
let axios = require("axios");

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path, 
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");   
    console.log("4");   
    console.log("3");   
    console.log("2");   
    console.log("1");   
    //console.log("Edited: "+req.body.inArguments[0]);    
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");   
    console.log("4");   
    console.log("3");   
    console.log("2");   
    console.log("1");   
    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    console.log("5 -- For Execute");    
    console.log("4");   
    console.log("3");   
    console.log("2");   
    console.log("1");   
    logData(req);
    
    var requestBody = req.body.inArguments[0];

    const name = requestBody.name;
    const type = requestBody.type;
    const message = requestBody.message;
    const phone_name = requestBody.phone_name;
    // const sms = requestBody.sms;
    const time = requestBody.time;
    const phone_number = requestBody.phone_number;
    const message_out = requestBody.message_out;
    const name_out = requestBody.name_out;
    const time_out = requestBody.time_out;
    const lead_account = requestBody.lead_account;
    const lead_related = requestBody.lead_related;


    // var data = JSON.stringify({"Subject":"[SMS-MKT]["+name+"]["+phone_name+"],"+type+","+message+"{{Contact.Attribute.pushApp.pushApp}}"});
    // var data = JSON.stringify({"Subject":sms});
    var phone = phone_number.replace(/^0+/, '+84');
    if(phone[0] != '+'){
        phone = '+84'+phone;
    }
    var data = JSON.stringify({"Subject":message_out,"TimeMessage":time_out,"Type":type,"PhoneName":phone,"Name":name_out,'OwnerId':lead_account,'RelatedId':lead_related});
    var url = 'https://hoanmy.force.com/services/apexrest/APICreateTask';
    if(message_out == '[test]'){
        url = 'https://hoanmy.force.com/services/apexrest/APICreateTask';
    }
    var config = {
      method: 'post',
      // url: 'https://sanbqc-hfh.cs5.force.com/services/apexrest/APICreateTask',
      url: url,
      // url: 'https://dev-hoanmy.cs17.force.com/services/apexrest/APICreateTask',
      // url: 'https://hoanmy.force.com/services/apexrest/APICreateTask',
      headers: { 
        'Content-Type': 'application/json', 
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

    // FOR TESTING
    
    res.send(200, 'Publish');

    // Used to decode JWT
    // JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    //     // verification error -> unauthorized request
    //     if (err) {
    //         console.error(err);
    //         return res.status(401).end();
    //     }

    //     if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
    //         // decoded in arguments
    //         var decodedArgs = decoded.inArguments[0];
            
    //         logData(req);
    //         res.send(200, 'Execute');
    //     } else {
    //         console.error('inArguments invalid.');
    //         return res.status(400).end();
    //     }
    // });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");    
    console.log("4");   
    console.log("3");   
    console.log("2");   
    console.log("1");   
    //console.log("Published: "+req.body.inArguments[0]);        
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

    console.log("5 -- For Validate");   
    console.log("4");   
    console.log("3");   
    console.log("2");   
    console.log("1");   
    //console.log("Validated: "+req.body.inArguments[0]);       
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};
