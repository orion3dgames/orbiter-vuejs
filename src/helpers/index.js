global.app = global.app || {};

global.app.version = '0.0.1';
global.app.debug = function (str) {
    str = 'DEBUG \n version ' + global.app.version + ' \n ' + str;
    document.querySelector('#debug').setAttribute('text', 'color: #000; align: left; value: ' + str + '; width: 2; side: double');
}