/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = $.localStorage.get('config');
        $('body').attr('data-layout', config.layout);
        $('body').attr('data-palette', config.theme);

        var colors = config.colors;
        var palette = config.palette;

        worldMap('e-commerce-vector-map', colors, palette);
    });

})();
