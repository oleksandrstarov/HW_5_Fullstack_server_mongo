'use strict';

var serverURL = 'https://fullstack1-oleksandrstarov.c9users.io/';


window.onload = function(){
    init(window);
};

function init(global){
    global.registrationHandler = new RegistrationHandler();
    global.viewRender = new ViewRender();
    global.processEngine = new ProcessEngine(serverURL);
}


