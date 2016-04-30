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
        worldMap('products-vector-map', colors, palette);
        chartJsAreaChart('products-area-chart', colors, palette);
        chartJsBarChart('products-bar-chart', colors, palette);
    });

})();
