function on_load() {
	var DEBUG = true;

	var CONSTANTS = {};

	CONSTANTS[ "KONAMI" ] = [];
	CONSTANTS[ "KEYCODE" ] = {};

	CONSTANTS.KEYCODE[ "LEFT" ] = 37;
	CONSTANTS.KEYCODE[ "UP" ] = 38;
	CONSTANTS.KEYCODE[ "RIGHT" ] = 39;
	CONSTANTS.KEYCODE[ "DOWN" ] = 40;
	CONSTANTS.KEYCODE[ "A" ] = 65;
	CONSTANTS.KEYCODE[ "B" ] = 66;
	CONSTANTS.KEYCODE[ "RETURN" ] = 13;

	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.UP );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.UP );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.DOWN );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.DOWN );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.LEFT );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.RIGHT );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.LEFT );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.RIGHT );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.A );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.B );
	CONSTANTS.KONAMI.push( CONSTANTS.KEYCODE.RETURN );

	CONSTANTS[ "KEYS_ARR" ] = Object.keys( CONSTANTS.KEYCODE );

	var GLOBALS = {};

	GLOBALS[ "assets" ] = JSON.parse( document.getElementById( "RICHERT_DIV" ).innerHTML )[ "assets" ];

	GLOBALS[ "keys" ] = {};

	GLOBALS.keys[ "idx" ] = 0;
	var i = 0;
	for( ; i < CONSTANTS.KEYS_ARR.length; i++ ) {
		GLOBALS.keys[ CONSTANTS.KEYCODE[ CONSTANTS.KEYS_ARR[ i ] ] ] = { "pressed" : false, "last_pressed" : false };
	}

	function update_key( code, pressed ) {
		if( GLOBALS.keys[ code ] === undefined ) {
			GLOBALS.keys[ code ] = { "pressed" : pressed, "last_pressed" : !pressed };
			return;
		}
		GLOBALS.keys[ code ].pressed = pressed;
	}

	function on_key_down( evt ) {
		update_key( evt.keyCode, true );
	}

	function on_key_up( evt ) {
		update_key( evt.keyCode, false );
	}

	document.addEventListener( "keydown", on_key_down );
	document.addEventListener( "keyup", on_key_up );

	var last_ts = -1,
		fade_out_ts = -1,
		fade_in_ts = -1,
		started = false,
		fade = 500,
		ticks,
		imgs,
		img;
	function konami_game_loop( ts ) {
		if( last_ts == -1 ) last_ts = ts;
		var key_obj;
		var keys = Object.keys( GLOBALS.keys );
		for( var j = 0; j < keys.length; j++ ) {
			key_obj = GLOBALS.keys[ keys[ j ] ];
			if( keys[ j ] == CONSTANTS.KONAMI[ GLOBALS.keys.idx ] ) {
				if( key_obj.pressed && !key_obj.last_pressed ) {
					GLOBALS.keys.idx++;
				}
			}
			key_obj.last_pressed = key_obj.pressed;	
		}
		if( GLOBALS.keys.idx == 11 ) {
			started = true;
		}
		if( started && ts - last_ts >= 250 ) {
			if( img ) {
				if( fade_out_ts == -1 ) fade_out_ts = ts;
				ticks = ts - fade_out_ts;
				if( ticks < fade ) {
					img.style.opacity = 1 - ( ticks / fade );
				} else {
					if( fade_in_ts == -1 ) {
						fade_in_ts = ts;
						img.src = GLOBALS[ "assets" ][ 1 ];
						img.setAttribute( "srcset", GLOBALS[ "assets" ][ 1 ] );
					}
					ticks = ts - fade_in_ts;
					if( ticks < fade ) {
						img.style.opacity = 1 * ( ticks / fade );
					} else {
						img = null;
						last_ts = ts;
						fade_in_ts = -1;
						fade_out_ts = -1;
					}
				}
			} else {
				var timgs = document.getElementsByTagName( "img" );
				imgs = [];
				for( var i = 0; i < timgs.length; i++ ) {
					img = timgs[ i ];
					var bounding = img.getBoundingClientRect();
					if( bounding.bottom >= 0 &&  bounding.right >= 0 &&
						bounding.top <= ( window.innerHeight || document.documentElement.clientHeight ) &&
		        		bounding.left <= ( window.innerWidth || document.documentElement.clientWidth ) ) {
						if( img.src != GLOBALS[ "assets" ][ 1 ] ) {
							imgs.push( img );
						}
					}
				}
				img = imgs[ ( Math.random() * imgs.length ) | 0 ];
			}
		}
		window.requestAnimationFrame( GLOBALS.game_loop );
	}

	GLOBALS.game_loop = konami_game_loop;

	window.requestAnimationFrame( GLOBALS.game_loop )
}

on_load();