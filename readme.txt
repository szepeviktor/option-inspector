=== Option Inspector ===
Contributors: Charles, szepe.viktor
Donate link: http://sexywp.com/plugin-options-inspector.htm
Tags: options, management, admin, developer, tools, administration
Requires at least: 4.0
Tested up to: 4.1.1
Stable tag: 2.0.1

Inspect and edit options, even serialized ones.

== Description ==

= Only for development! =

Features:

* Inspect options with the colorful [dBug](http://kolanich.github.io/dBug/)
* Edit serialized options
* List all options in the wp_options table on one page
* Search: Filter options in real time
* Delete options
* Show autoload status (yes or no)
* Popular plugin's options are marked with the author's website favicon
* Transients are marked with a clock icon
* Transient timeouts are marked with a red clock icon

You'll find Option Inspector under Tools / Options.

Notice: This plugin uses `eval()` to update serialized options.
Please **DO NOT** use it in production.

This plugin is as WordPress comform as it can be.

[GitHub repo](https://github.com/szepeviktor/option-inspector)

TODO: toggle autoload, i18n, don't use options.php, update option list on delete, http://flatuicolors.com/

== Installation ==

1. Upload `options-inspector` directory to the `wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= What privilege do I need to access Option Inspector? =

You need to have the `manage_options` privilege.

= How does it work? =

This plugin is a Javascript application built on the WordPress `options.php`.
It works by addig control icons and opening a lightbox on `options.php`.
Additional data are read and written by AJAX requests.

== Screenshots ==

1. dBug in an open lightbox.
1. `options.php`.
1. Edit a serialized option.

== Changelog ==

= 2.0.1 =
* Fixed an undefined variable.
* Detect [eval() parse errors](http://devwp.eu/eval-error-check/)

= 2.0.0 =
* This is another plugin, [the old one is available here](http://plugins.svn.wordpress.org/options-inspector/tags/1.0.2/).
* New features.

= 1.0.2 =
* Options Inspector is a tool with which you can easily view all the options in your database,
even its data is serialized, and alter exactly a certain part of option value.

== Upgrade Notice ==

= 2.0.0 =
This is completly different plugin than 1.0.2. Charles gave me permission.
