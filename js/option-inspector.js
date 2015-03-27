jQuery(function ($) {
    'use strict';
    var wpOptions, pluginLogos, pageSize, twOptions,
        viewport = { maxx: 1100, maxy: 760 },
        all_opts = $('#all-options .form-table input[type="text"], #all-options .form-table textarea'),
        searchHtml = '<div class="tablenav top"><div class="tablenav-pages search-plugins"><input type="search" autofocus \
        value="" name="s" id="oi-search"><span title="Just start typing!" class="dashicons dashicons-search"></span></div><div \
        class="tablenav-pages"><span class="displaying-num"></span></div><br class="clear"></div>',
        deleteIconHtml = '<span title="Delete option" class="dashicons dashicons-trash"></span>',
        editIconHtml = '<span title="Edit option" class="dashicons dashicons-edit"></span>',
        transientRegexp = /^_transient_/,
        transientTimeoutRegexp = /^_transient_timeout_/,
        siteTransientRegexp = /^_site_transient_/,
        siteTransientTimeoutRegexp = /^_site_transient_timeout_/,
        wpIconHtml = '<span title="WordPress core option" class="dashicons dashicons-wordpress"></span>',
        pluginIconHtml = '<span title="Possibly belongs to %n plugin" class="pluginicon%s" ></span>',
        transientIconHtml = '<span title="Transient" class="dashicons dashicons-clock"></span>',
        transientTimeoutIconHtml = '<span title="Transient" class="transient-timeout dashicons dashicons-clock"></span>',
        siteTransientIconHtml = '<span title="Site transient" class="site-transient dashicons dashicons-clock"></span>',
        siteTransientTimeoutIconHtml = '<span title="Site transient" class="site-transient-timeout dashicons dashicons-clock"></span>',
        serIconHtml = '<span title="View option\'s value" class="dashicons dashicons-editor-expand"></span>';

    /**
     * Current WordPress core option.
     *
     * @see: https://core.trac.wordpress.org/browser/trunk/src/wp-admin/includes/schema.php#L374
     */
    wpOptions = [
'siteurl','home','blogname','blogdescription','users_can_register',
'admin_email','start_of_week','use_balanceTags','use_smilies','require_name_email',
'comments_notify','posts_per_rss','rss_use_excerpt','mailserver_url','mailserver_login',
'mailserver_pass','mailserver_port','default_category','default_comment_status','default_ping_status',
'default_pingback_flag','posts_per_page','date_format','time_format','links_updated_date_format',
'comment_moderation','moderation_notify','permalink_structure','gzipcompression','hack_file',
'blog_charset','moderation_keys','active_plugins','category_base','ping_sites',
'advanced_edit','comment_max_links','gmt_offset','default_email_category','recently_edited',
'template','stylesheet','comment_whitelist','blacklist_keys','comment_registration',
'html_type','use_trackback','default_role','db_version','uploads_use_yearmonth_folders',
'upload_path','blog_public','default_link_category','show_on_front','tag_base',
'show_avatars','avatar_rating','upload_url_path','thumbnail_size_w','thumbnail_size_h',
'thumbnail_crop','medium_size_w','medium_size_h','avatar_default','large_size_w',
'large_size_h','image_default_link_type','image_default_size','image_default_align','close_comments_for_old_posts',
'close_comments_days_old','thread_comments','thread_comments_depth','page_comments','comments_per_page',
'default_comments_page','comment_order','sticky_posts','widget_categories','widget_text',
'widget_rss','uninstall_plugins','timezone_string','page_for_posts','page_on_front',
'default_post_format','link_manager_enabled','initial_db_version',
// Additionals.
'WPLANG', 'widget_search', 'widget_recent-posts', 'widget_recent-comments', 'widget_archives',
'widget_meta', 'sidebars_widgets', 'widget_tag_cloud', 'widget_pages', 'widget_nav_menu',
'current_theme', 'cron', 'dashboard_widget_options'
];
    pluginLogos = [
        { regexp: /^woocommerce_/, name: 'WooCommerce', iconclass: 'pluginicon-woo' },
        { regexp: /^wpseo/, name: 'WordPress SEO by Yoast', iconclass: 'pluginicon-wpseo' },
        { regexp: /^wpcf7/, name: 'Contact Form 7', iconclass: 'pluginicon-wpcf7' },
        { regexp: /^pods_|^widget_pods_/, name: 'Pods', iconclass: 'pluginicon-pods' },
        // http://plugins.svn.wordpress.org/better-wp-security/trunk/lib/icon-fonts/fonts/ithemes-icons.svg
        { regexp: /^itsec_/, name: 'iThemes Security', iconclass: 'pluginicon-itsec' }
    ];

    if (! OPTIONINS) {
        return;
    }
// titles
// option: $table_prefix . 'user_roles'


    // Measure viewport
    pageSize = tb_getPageSize();
    viewport.x = pageSize[0] - 170;
    if (viewport.x > viewport.maxx) {
        viewport.x = viewport.maxx;
    }
    viewport.y = pageSize[1] - 72;
    if (viewport.y > viewport.maxy) {
        viewport.y = viewport.maxy;
    }

    twOptions = {
        callback: function (text) {
            var count = 0;
            all_opts.each( function () {
                var optionName, row,
                    input = $(this);
                optionName = input.attr('name');
                row = input.closest('tr');
                if ( optionName.indexOf(text) === -1 ) {
                    row.hide();
                } else {
                    count += 1;
                    row.show();
                }
            });
            $('.tablenav .displaying-num').text(String(count) + ' items');
        },
        wait: 600,
        highlight: true,
        captureLength: 2
    }

    $('.wrap')[0].insertBefore($(searchHtml)[0], $('#all-options')[0]);
    $('#oi-search').typeWatch( twOptions );

    all_opts.each( function () {
        var optionName, labelTh, label, inspector, edit, remove, viewIcon,
            input = $(this);

        labelTh = input.parent().prev();
        label = labelTh.find('label');
        optionName = input.attr('name');
        inspector = input.wrap('<span class="inspector"></span>').parent();

        // Delete option
        // @TODO update all_opts
        remove = inspector.append(deleteIconHtml).find('.dashicons-trash');
        remove.click(function () {
            if (confirm('Delete option ' + optionName + ' ?')) {
                $.get(ajaxurl, {
                        action: 'o1_delete_option',
                        option_name: optionName,
                        _nonce: OPTIONINS.nonce
                    }
                ).done(function (data) {
                    var row, th, td;
                    if ('1' === data) {
                        row = labelTh.parent();
                        // Shrink paddings, wrap cell contents and slide up.
                        row.children()
                            .animate({'padding-top': 0, 'padding-bottom': 0}, 500)
                            .wrapInner('<div class="table-slider"/>').parent().find('.table-slider')
                            .slideUp(500, function () {row.remove();});
                    } else {
                        alert('Deletion failed.');
                    }
                });
            }
        });

        // WP core
        if ($.inArray(optionName, wpOptions) !== -1) {
            labelTh.append(wpIconHtml);
        }

        // Popular plugins' icons
        $(pluginLogos).each(function (i, plugin) {
            var style;
            if (plugin.regexp.test(label.text())) {
                if (plugin.url) {
                    style = '" style="background-image:url(' + plugin.url + ')';
                } else if (plugin.iconclass) {
                    style = ' ' + plugin.iconclass;
                } else {
                    style = ' dashicons dashicons-admin-plugins';
                }
                labelTh.append(pluginIconHtml
                    .replace('%n', plugin.name)
                    .replace('%s', style));
            }
        });

        // Transients
        if (siteTransientTimeoutRegexp.test(optionName)) {
            labelTh.append(transientTimeoutIconHtml);
        } else if (siteTransientRegexp.test(optionName)) {
            labelTh.append(siteTransientIconHtml);
        } else if (transientTimeoutRegexp.test(optionName)) {
            labelTh.append(transientTimeoutIconHtml);
        } else if (transientRegexp.test(optionName)) {
            labelTh.append(transientIconHtml);
        }


        if (input.attr('value') !== 'SERIALIZED DATA') {
            inspector.addClass('non-ser');
            return;
        }

        // Serialized options - View
        viewIcon = inspector.prepend(serIconHtml).find('.dashicons-editor-expand');
        $.merge(viewIcon, label).click(function () {
            tb_show(optionName, 'admin-ajax.php?action=o1_inspect_option&option_name=' + optionName +
                '&width=' + viewport.x + '&height=' + viewport.y + '&_nonce=' + OPTIONINS.nonce);
        });

        // Serialized options - Edit
        edit = inspector.append(editIconHtml).find('.dashicons-edit');
        edit.click(function () {
            var update;
            tb_show(optionName, 'admin-ajax.php?action=o1_edit_option&option_name=' + optionName +
                '&width=' + viewport.x + '&height=' + viewport.y + '&_nonce=' + OPTIONINS.nonce);
            (function pollTbOpen() {
                if ($('#TB_load').length === 1) {
                    setTimeout(pollTbOpen, 50);
                    return;
                }
                $('#TB_window .edit-option').focus();
                update = $('#option-update');
                update.click(function () {
                    $.post(ajaxurl, {
                            action: 'o1_update_option',
                            option_name: optionName,
                            option_value: $('#TB_window .edit-option').val(),
                            _nonce: OPTIONINS.nonce
                        }
                    ).done(function (data) {
                        if ('1' === data) {
                            tb_remove();
                        } else {
                            alert('Update failed: ' + data);
                        }
                    });
                });
            }());
        });
    });

});
