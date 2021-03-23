define(['postmonger','jquery'], function (Postmonger,jquery) {
    'use strict';

    let connection = new Postmonger.Session();
    let authTokens = {};
    let payload = {};

    // Configuration variables
    let eventSchema = ''; // variable is used in parseEventSchema()
    let lastnameSchema = ''; // variable is used in parseEventSchema()
    let eventDefinitionKey;
    // var $ = require('jquery');
    $(window).ready(onRender);
    connection.on('initActivity', initialize);
    connection.on('clickedNext', save); //Save function within MC

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

    /**
     * This function is to pull out the event definition within journey builder.
     * With the eventDefinitionKey, you are able to pull out values that passes through the journey
     */
    connection.trigger('requestTriggerEventDefinition');
    connection.on('requestedTriggerEventDefinition', function (eventDefinitionModel) {
        if (eventDefinitionModel) {
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            console.log('--------------');
            console.log('Request Trigger >>>', JSON.stringify(eventDefinitionModel));
            console.log('--------------');
        }
    });

    function initialize(data) {
        if (data) {
            payload = data;
        }
        initialLoad(data);
        parseEventSchema();
    }

    /**
     * Save function is fired off upon clicking of "Done" in Marketing Cloud
     * The config.json will be updated here if there are any updates to be done via Front End UI
     */
    function save() {
        var name = $("#omn1-task-name_msg").val();
        var type = $("#omn1-task-type_msg").val();
        var time = $("#omn1-task-time_msg").val();
        var message = $("#omn1-task-content_msg").val();
        var phone_name = $("#omn1-task-phone_name_msg").val();
        payload['arguments'].execute.inArguments =
            {
                name: name,
                type: type,
                time: time,
                message: message,
                phone_name: phone_name
            };
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }

    /**
     * 
     * @param {*} data
     * 
     * This data param is the config json payload that needs to be loaded back into the UI upon opening the custom application within journey builder 
     * This function is invoked when the user clicks on the custom activity in Marketing Cloud. 
     * If there are information present, it should be loaded back into the appropriate places. 
     * e.g. input fields, select lists
     */
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
        $("#omn1-task-time_msg").val(inArguments.time);
        $("#omn1-task-content_msg").val(inArguments.message);
        $("#omn1-task-phone_name_msg").val(inArguments.phone_name);

    };


    /**
     * This function is to pull the relevant information to create the schema of the objects
     * 
     * This function pulls out the schema for additional customizations that can be used.
     * This function leverages on the required field of "Last Name" to pull out the overall event schema
     * 
     * returned variables of: lastnameSchema , eventSchema.
     * eventSchema = Case:Contact:
     * lastnameSchema = Case:Contact:<last_name_schema>
     * 
     * View the developer console in chrome upon opening of application in MC Journey Builder for further clarity.
     */
    function parseEventSchema() {
        // Pulling data from the schema
        connection.trigger('requestSchema');
        connection.on('requestedSchema', function (data) {
            // save schema
            let dataJson = data['schema'];
            console.log('parseEventSchema');
            for (let i = 0; i < dataJson.length; i++) {

                // Last name schema and creation of event schema
                // Last name is a required field in SF so this is used to pull the event schema
                if (dataJson[i].key.toLowerCase().replace(/ /g, '').indexOf("lastname") !== -1) {
                    let splitArr = dataJson[i].key.split(".");
                    lastnameSchema = splitArr[splitArr.length - 1];
                    console.log('Last Name Schema >>', lastnameSchema);

                    let splitName = lastnameSchema.split(":");
                    let reg = new RegExp(splitName[splitName.length - 1], "g");
                    let oldSchema = splitArr[splitArr.length - 1];

                    eventSchema = oldSchema.replace(reg, "");
                    console.log("Event Schema >>", eventSchema);
                }
            }

        });
    }
});