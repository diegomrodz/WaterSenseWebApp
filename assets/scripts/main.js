/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = {
            name: 'Marino',
            theme: 'palette-1',
            palette: getPalette('palette-1'),
            layout: 'horizontal-navigation-1',
            colors: getColors()
        };

        //$.removeAllStorages();
        if ($.localStorage.isEmpty('config') || !($.localStorage.get('config'))) {
            $.removeAllStorages();
            $.localStorage.set('config', config);
        }
        var config = $.localStorage.get('config');

        //detect IE
        var isIE = detectIE();
        if (isIE) {
            $('body').addClass('ie-' + isIE);
        }

    });
})();
