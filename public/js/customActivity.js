define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

  function initialize(data) {
        console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }   
        initialLoad(data); 

        // var hasInArguments = Boolean(
        //     payload['arguments'] &&
        //     payload['arguments'].execute &&
        //     payload['arguments'].execute.inArguments &&
        //     payload['arguments'].execute.inArguments.length > 0
        //  );

        // var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        // console.log('Has In arguments: '+JSON.stringify(inArguments));

        // $.each(inArguments, function (index, inArgument) {
        //     $.each(inArgument, function (key, val) {

        //         if (key === 'accountSid') {
        //             $('#accountSID').val(val);
        //         }

        //         if (key === 'authToken') {
        //             $('#authToken').val(val);
        //         }

        //         if (key === 'messagingService') {
        //             $('#messagingService').val(val);
        //         }

        //         if (key === 'body') {
        //             $('#messageBody').val(val);
        //         }                                                               

        //     })
        // });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function initialLoad(data) {
        console.log(data);
        let activity = data;
        const hasInArguments = Boolean(
            activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.inArguments 
        );        
        const inArguments = hasInArguments ? activity.arguments.execute.inArguments : {};
        console.log(inArguments);
        // const title = inArguments.find((arg) => arg.title);
        // const message = inArguments.find((arg) => arg.message);
        // const time = inArguments.find((arg) => arg.time);

        $("#omn1-task-name_msg").val(inArguments.name);
        $("#omn1-task-type_msg").val(inArguments.type);
        $("#omn1-task-content_msg").val(inArguments.message);
        $("#omn1-task-phone_name_msg").val(inArguments.phone_name);

    };    

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {

        // var accountSid = $('#accountSID').val();
        // var authToken = $('#authToken').val();
        // var messagingService = $('#messagingService').val();
        // var body = $('#messageBody').val();

        // payload['arguments'].execute.inArguments = [{
        //     "accountSid": accountSid,
        //     "authToken": authToken,
        //     "messagingService": messagingService,
        //     "body": body,
        //     "to": "{{Contact.Attribute.Omn1.phone}}" //<----This should map to your data extension name and phone number column
        // }];

        // payload['metaData'].isConfigured = true;

        var name = $("#omn1-task-name_msg").val();
        var type = $("#omn1-task-type_msg").val();
        var message = $("#omn1-task-content_msg").val();
        var phone_name = $("#omn1-task-phone_name_msg").val();
        payload['arguments'].execute.inArguments =
            {
                name: name,
                type: type,
                message: message,
                phone_name: phone_name
            };
        payload['metaData'].isConfigured = true;        

        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }                    

});