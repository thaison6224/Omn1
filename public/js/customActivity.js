define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    let eventDefinitionKey;
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

    connection.trigger('requestTriggerEventDefinition');

    connection.on('requestedTriggerEventDefinition',
    function(eventDefinitionModel) {
        if(eventDefinitionModel){

            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            console.log(">>>Event Definition Key " + eventDefinitionKey);
            /*If you want to see all*/
            console.log('>>>Request Trigger', 
            JSON.stringify(eventDefinitionModel));
        }

    });    

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

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: '+JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'name') {
                    $('#omn1-task-name_msg').val(val);
                }

                if (key === 'type') {
                    $('#omn1-task-type_msg').val(val);
                }

                if (key === 'message') {
                    $('#omn1-task-content_msg').val(val);
                }

                if (key === 'phone_name') {
                    $('#omn1-task-phone_name_msg').val(val);
                } 

                if (key === 'time') {
                    $('#omn1-task-time_msg').val(val);
                }                                                               


            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
        parseEventSchema();
    } 

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
        // var DE = "Omn1 Push";
        // var DE = "DEAudience-3c10b0c1-caa3-a5e0-58d9-ec86170b925f";
        var DE = "Event."+eventDefinitionKey;
        var name = $("#omn1-task-name_msg").val();
        var time = $("#omn1-task-time_msg").val();
        var type = $("#omn1-task-type_msg").val();
        var message = $("#omn1-task-content_msg").val();
        var phone_name = $("#omn1-task-phone_name_msg").val();
        var message_out = message;
        message_out = message_out.replace(/\%\%(.+?)\%\%/g, "{{\""+DE+"\".\"$1\"}}")
        var name_out = name;
        name_out = name_out.replace(/\%\%(.+?)\%\%/g, "{{\""+DE+"\".\"$1\"}}")        
        var sms = "[SMS-MKT]["+name_out+"]["+time+"]["+"{{\""+DE+"\".\""+phone_name+"\"}}"+"],"+type+","+message_out;
        payload['arguments'].execute.inArguments =
            [{
                "name": name,
                "time": time,
                "type": type,
                "message": message,
                "phone_name": phone_name,
                "sms": sms,
                "phone3": "{{Event.DEAudience-3c10b0c1-caa3-a5e0-58d9-ec86170b925f.Id}}"
            }];
        payload['metaData'].isConfigured = true;        

        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }

    function parseEventSchema() {
        // Pulling data from the schema
        connection.trigger('requestSchema');
        connection.on('requestedSchema', function (data) {
            console.log('*** Schema ***', JSON.stringify(data['schema']));
            // save schema
            // let dataJson = data['schema'];
            // for (let i = 0; i < dataJson.length; i++) {

            //     // Last name schema and creation of event schema
            //     // Last name is a required field in SF so this is used to pull the event schema
            //     if (dataJson[i].key.toLowerCase().replace(/ /g, '').indexOf("lastname") !== -1) {
            //         let splitArr = dataJson[i].key.split(".");
            //         lastnameSchema = splitArr[splitArr.length - 1];
            //         console.log('Last Name Schema >>', lastnameSchema);

            //         let splitName = lastnameSchema.split(":");
            //         let reg = new RegExp(splitName[splitName.length - 1], "g");
            //         let oldSchema = splitArr[splitArr.length - 1];

            //         eventSchema = oldSchema.replace(reg, "");
            //         console.log("Event Schema >>", eventSchema);
            //     }
            // }

        });
    }                        

});