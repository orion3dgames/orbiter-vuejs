window.app = window.app || {};

window.app.version = '0.0.1';
window.app.debug = function (str) {
    str = 'DEBUG \n version ' + window.app.version + ' \n ' + str;
    document.querySelector('#debug').setAttribute('text', 'color: #000; align: left; value: ' + str + '; width: 2; side: double');
}