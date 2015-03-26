<?php
/*
Plugin Name: Option Inspector
Version: 2.0.0
Description: Inspect and edit options, even serialized ones.
Plugin URI: https://wordpress.org/plugins/options-inspector/
Author: Viktor Szépe
Author URI: http://www.online1.hu/webdesign/
License: GNU General Public License (GPL) version 2
GitHub Plugin URI: https://github.com/szepeviktor/option-inspector
*/

if ( ! function_exists( 'add_filter' ) ) {
    ob_get_level() && ob_end_clean();
    header( 'Status: 403 Forbidden' );
    header( 'HTTP/1.1 403 Forbidden' );
    exit();
}

final class O1_Option_Inspector {

    private $plugin_url;

    public function __construct() {

        $this->plugin_url = plugin_dir_url( __FILE__ );
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_script' ) );
        add_action( 'wp_ajax_o1_inspect_option', array( $this, 'ajax_inspect_receiver' ) );
        add_action( 'wp_ajax_o1_edit_option', array( $this, 'ajax_edit_receiver' ) );
        add_action( 'wp_ajax_o1_update_option', array( $this, 'ajax_update_receiver' ) );
        // @TODO toggle autoload
        add_action( 'wp_ajax_o1_delete_option', array( $this, 'ajax_delete_receiver' ) );
        add_action( 'admin_menu', array( $this, 'menu' ) );
    }

    public function admin_script( $hook ) {

        if ( 'options.php' !== $hook ) {
            return;
        }

        add_thickbox();
        $nonce = wp_create_nonce( 'option_inspector' );
        wp_enqueue_style( 'option_inspector_style', $this->plugin_url . 'css/option-inspector.min.css' );

        wp_enqueue_script( 'option-inspector-dbug', $this->plugin_url . 'js/dbug.min.js' );
        wp_enqueue_script( 'option-inspector-jquery-typewatch', $this->plugin_url . 'js/jquery.typewatch.min.js',
            array( 'jquery-core' ) );
        wp_enqueue_script( 'option-inspector', $this->plugin_url . 'js/option-inspector.min.js',
            array( 'option-inspector-jquery-typewatch', 'thickbox', 'option-inspector-dbug' ) );
        wp_localize_script( 'option-inspector', 'OPTIONINS', array( 'nonce' => $nonce ) );
    }

    private function security_checks() {

        check_ajax_referer( 'option_inspector', '_nonce' );

        $capability = 'manage_options';

        /**
         * Filter the capability required when using the Settings API.
         *
         * By default, the options groups for all registered settings require the manage_options capability.
         * This filter is required to change the capability required for a certain options page.
         *
         * @since 3.2.0
         *
         * @param string $capability The capability used for the page, which is manage_options by default.
         */
        $capability = apply_filters( "option_page_capability_{$option_page}", $capability );

        if ( !current_user_can( $capability ) || empty( $_REQUEST['option_name'] ) ) {
            wp_die( __( 'Cheatin&#8217; uh?' ), 403 );
        }
    }

    public function ajax_inspect_receiver() {

        global $wpdb;

        $this->security_checks();

        $option_name = sanitize_key( $_REQUEST['option_name'] );

        $autoload = $wpdb->get_var( $wpdb->prepare(
            "SELECT autoload FROM $wpdb->options WHERE option_name = %s LIMIT 1", $option_name ) );
        print '<div class="option-autoload">autoload = '. $autoload . '</div>';

        $value = get_option( $option_name );

        // @TODO colors: http://flatuicolors.com/
        require_once( plugin_dir_path( __FILE__ ) . 'inc/dBug.php' );
        new dBug\dBug( $value );
        wp_die();
    }

    public function ajax_edit_receiver() {

        $this->security_checks();

        $option_name = sanitize_key( $_REQUEST['option_name'] );

        $value = get_option( $option_name );
        $content = var_export( $value, true );

        printf( '<textarea class="edit-option">%s</textarea><div class="update-button"><button
            class="button button-primary" id="option-update">Update Option</button></div>',
            esc_textarea( $content ) );
        wp_die();
    }

    public function ajax_update_receiver() {

        $this->security_checks();

        if ( ! isset( $_REQUEST['option_value'] ) ) {
            wp_die( -1, 403 );
        }

        $option_name = sanitize_key( $_REQUEST['option_name'] );
        $option_value = wp_unslash( $_REQUEST['option_value'] );

        // eval returns false on error.
        if ( 'false' === strtolower( $option_value ) ) {
            update_option( $option_name, false );
            wp_die(1);
        }

        //$option_value = str_replace( ';', '\;', $option_value );
        // preg_match( ')\s*;' ...
        if ( null !== eval( '$option_value = ' . $option_value . ';' ) ) {
            wp_die( 0 );
        } else {
            update_option( $option_name, $option_value );
            wp_die( 1 );
        }
    }

    public function ajax_delete_receiver() {

        $this->security_checks();

        $option_name = sanitize_key( $_REQUEST['option_name'] );

        if ( delete_option( $option_name ) ) {
            wp_die( 1 );
        } else {
            wp_die( 0 );
        }
    }

    public function menu() {

        global $submenu;

        // Hack into the Settings menu.
        // @TODO copy options.php listing loop.
        $submenu['tools.php'][7] = array( __( 'Options' ), 'manage_options', 'options.php' );
        ksort( $submenu['tools.php'] );
    }

}

new O1_Option_Inspector();
