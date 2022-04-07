window.app = window.app || {};

window.app.debugText = ['DEBUG\n'];
window.app.debug = function (str) {
    window.app.debugText.push(' \n ' + str);
    if (window.app.debugText.length > 21) window.app.debugText.shift();
    document.querySelector('#debug')?.setAttribute('text', 'color: #000; align: left; value: ' + window.app.debugText.join() + '; width: 2; side: double');
}