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

        $('.knob-success').each(function() {
            $(this).attr('data-fgColor', colors.success);
            $(this).attr('data-inputColor', colors.light);
            $(this).attr('data-bgColor', colors.light);
        }).knob();

        $('.knob-warning').each(function() {
            $(this).attr('data-fgColor', colors.warning);
            $(this).attr('data-inputColor', colors.light);
            $(this).attr('data-bgColor', colors.light);
        }).knob();

        $('.knob-danger').each(function() {
            $(this).attr('data-fgColor', colors.danger);
            $(this).attr('data-inputColor', colors.light);
            $(this).attr('data-bgColor', colors.light);
        }).knob();

        $('.knob-info').each(function() {
            $(this).attr('data-fgColor', colors.info);
            $(this).attr('data-inputColor', palette.hoverColor);
            $(this).attr('data-bgColor', colors.light);
        }).knob();

    });

})();
