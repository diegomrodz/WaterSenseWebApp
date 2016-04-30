/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = $.localStorage.get('config');
        $('body').attr('data-layout', config.layout);
        $('body').attr('data-palette', config.theme);

        $('#example-1').DataTable({
            "ajax": '/assets/json/datatables.json'
        });

        $('#example-2').DataTable();

    });

})();
