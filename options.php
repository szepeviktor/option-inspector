<?php
/*
option listing part of options.php
*/

global $wpdb;
?>
  <h2><?php esc_html_e('All Settings'); ?></h2>

  <form name="form" action="options.php" method="post" id="all-options">
  <?php wp_nonce_field('options-options') ?>
  <input type="hidden" name="action" value="update" />
  <input type="hidden" name="option_page" value="options" />
  <table class="form-table">
<?php
$options = $wpdb->get_results( "SELECT * FROM $wpdb->options ORDER BY option_name" );

foreach ( (array) $options as $option ) :
	$disabled = false;
	if ( $option->option_name == '' )
		continue;
	if ( is_serialized( $option->option_value ) ) {
		if ( is_serialized_string( $option->option_value ) ) {
			// This is a serialized string, so we should display it.
			$value = maybe_unserialize( $option->option_value );
			$options_to_update[] = $option->option_name;
			$class = 'all-options';
		} else {
			$value = 'SERIALIZED DATA';
			$disabled = true;
			$class = 'all-options disabled';
		}
	} else {
		$value = $option->option_value;
		$options_to_update[] = $option->option_name;
		$class = 'all-options';
	}
	$name = esc_attr( $option->option_name );

	?>
<tr>
	<th scope="row"><label for="<?php echo $name ?>"><?php echo esc_html( $option->option_name ); ?></label></th>
<td>
<?php if ( strpos( $value, "\n" ) !== false ) : ?>
	<textarea class="<?php echo $class ?>" name="<?php echo $name ?>" id="<?php echo $name ?>" cols="30" rows="5"><?php
		echo esc_textarea( $value );
	?></textarea>
	<?php else: ?>
		<input class="regular-text <?php echo $class ?>" type="text" name="<?php echo $name ?>" id="<?php echo $name ?>" value="<?php echo esc_attr( $value ) ?>"<?php disabled( $disabled, true ) ?> />
	<?php endif

	?>
</td>
</tr>
<?php endforeach; ?>
  </table>

<input type="hidden" name="page_options" value="<?php echo esc_attr( implode( ',', $options_to_update ) ); ?>" />

<?php submit_button( __( 'Save Changes' ), 'primary', 'Update' ); ?>

  </form>
