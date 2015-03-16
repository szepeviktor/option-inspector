jQuery(function ($) {
    var ser_opts = $('#all-options .form-table input[type="text"][value="SERIALIZED DATA"]');

    if (! OPTIONINS) {
        return;
    }

    ser_opts.each(function (){
        var header, dashicon,
            viewport = { maxx: 1100, maxy: 760 },
            input = $(this),
            icon_html = '<span class="dashicons dashicons-editor-expand"></span>';

        viewport.x = $(window).width() - 170;
        if (viewport.x > viewport.maxx)
            viewport.x = viewport.maxx;
        viewport.y = $(window).height() - 72;
        if (viewport.y > viewport.maxy)
            viewport.y = viewport.maxy;

        dashicon = input.wrap('<a class="inspector"></div>').parent().append(icon_html);
        header = input.parent().parent().prev();
        $.merge(dashicon, header).click(function () {
            var name = input.attr('name');
            tb_show(name, 'admin-ajax.php?action=o1_inspect_option&option_name=' + name +
                '&width=' + viewport.x + '&height=' + viewport.y + '&_nonce=' + OPTIONINS.nonce);
        });
    });
});
