/**
 * Created by jrey on 25/01/2017.
 * jrey > fixes $.browser rmoval from jquery > 1.9 libraries for blockUI
 */
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();