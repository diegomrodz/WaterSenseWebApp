/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = $.localStorage.get('config');
        //$('body').attr('data-layout', config.layout);
        $('body').attr('data-palette', config.theme);

        var bg = '<div class="fullsize fullsize-medium"><img src="/assets/backgrounds/bg274.png"/></div>';
        $('.fullsize').remove();
        $('body').prepend(bg);

        var searchForPage = $('#search-for-page');
        searchForPage.floatingLabels();

        $('#under-maintenance-counter').countdown('2016/8/17').on('update.countdown', function(event) {
            $(this).html(event.strftime(
                '<div class="table-responsive"><table class="table"><tr>' +
                '<td><span class="number">%D</span></br><span class="unit">days</span></td>' +
                '<td><span class="dots">:</span></td> ' +
                '<td><span class="number">%H</span></br><span class="unit">hours</span></td>' +
                '<td><span class="dots">:</span></td> ' +
                '<td><span class="number">%M</span></br><span class="unit">minutes</span></td>' +
                '<td><span class="dots">:</span></td> ' +
                '<td><span class="number">%S</span></br><span class="unit">seconds</span></td>' +
                '</tr></table></div>'
            ));
        });

    });

})();
