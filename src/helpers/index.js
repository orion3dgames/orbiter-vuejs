global.app = global.app || {};

global.app.debug = function (str) {
    document.querySelector('#debug').setAttribute('text', 'color: #000; align: left; value: ' + str + '; width: 2; side: double');
}