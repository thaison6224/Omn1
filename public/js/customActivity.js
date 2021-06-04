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
        var omn1_task_Id = '';
        var phone_name_msg = '';
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
                    phone_name_msg = val;
                    $('#omn1-task-phone_name_msg').val(val);
                } 

                if (key === 'time') {
                    $('#omn1-task-time_msg').val(val);
                }     

                if (key === 'lead_account_name') {
                    omn1_task_Id = val;
                    $('#omn1-task-Id').val(val);
                }                                                                            


            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
        parseEventSchema(phone_name_msg,omn1_task_Id);
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
        if(message_out && message_out !='')
            message_out = message_out.replace(/\%\%(.+?)\%\%/g, "{{\""+DE+"\".\"$1\"}}");
        var name_out = name;
        if(name_out && name_out !='')
            name_out = name_out.replace(/\%\%(.+?)\%\%/g, "{{\""+DE+"\".\"$1\"}}") ;       
        // var sms = "[SMS-MKT]["+name_out+"]["+time+"]["+"{{\""+DE+"\".\""+phone_name+"\"}}"+"],"+type+","+message_out;
        var lead_account_name = $("#omn1-task-Id").val();
        var lead_account = lead_account_name;
        if(lead_account && lead_account !='')
         lead_account = lead_account_name.replace(/\%\%(.+?)\%\%/g, "{{\""+DE+"\".\"$1\"}}");;
        var d = new Date();

        var month = d.getMonth()+1;
        var day = d.getDate();
        var year = d.getFullYear();
        if(month < 10) month = '0'+month;
        if(day < 10) day = '0'+day;        
        // 11/6/2014 12:00 AM
        // var time_out = day+'/'+month+'/'+ year + ' ' + time + (time?' AM':'');
        var time_out = '';
        if(time && time !='')
         time_out = day+'/'+month+'/'+ year + ' ' + time + ':00';

        payload['arguments'].execute.inArguments =
            [{
                "name": name,
                "time": time,
                "type": type,
                "message": message,
                "phone_name": phone_name,
                "phone_number": "{{\""+DE+"\".\""+phone_name+"\"}}",
                "message_out": message_out,
                "name_out": name_out,
                "time_out": time_out,
                "lead_account_name": lead_account_name,
                "lead_account": lead_account
            }];
        payload['metaData'].isConfigured = true;        

        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }

    function parseEventSchema(phone_name_msg,omn1_task_Id) {
        // Pulling data from the schema
        connection.trigger('requestSchema');
        connection.on('requestedSchema', function (data) {
            console.log('*** Schema ***', JSON.stringify(data['schema']));
            // save schema
            let dataJson = data['schema'];
            // let omn1_task_Id = $("#omn1-task-Id").val();
            // let phone_name_msg = $("#omn1-task-phone_name_msg").val();
            $("#omn1-task-Id").empty();
            $("#omn1-task-phone_name_msg").empty();
            $("#omn1-task-Id").append(new Option('Select…', ''));
            $("#omn1-task-phone_name_msg").append(new Option('Select…', ''));
            for (let i = 0; i < dataJson.length; i++) {
                $("#omn1-task-Id").append(new Option(dataJson[i].name, dataJson[i].name));
                $("#omn1-task-phone_name_msg").append(new Option(dataJson[i].name, dataJson[i].name));
            }
            $("#omn1-task-Id").val(omn1_task_Id);
            $("#omn1-task-phone_name_msg").val(phone_name_msg);
        });
    }                        

});