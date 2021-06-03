var RICHERT_ASSETS = [];
RICHERT_ASSETS.push(browser.runtime.getURL("konami/index.html"));
RICHERT_ASSETS.push(browser.runtime.getURL("popup/richert-no-bg.png"));
var RICHERT_DIV = document.createElement("span");
RICHERT_DIV.setAttribute("style", "display: none");
RICHERT_DIV.setAttribute("id", "RICHERT_DIV");
RICHERT_DIV.innerHTML = JSON.stringify({
    "assets": RICHERT_ASSETS
});
document.body.appendChild(RICHERT_DIV);
var richert = document.createElement("script");
richert.src = browser.runtime.getURL("konami/richert.js");
richert.setAttribute("id", "RICHERT_KONAMI");
var doc = document.head || document.documentElement;
doc.appendChild(richert);

function do_nothing() {

}

function get_specs( section ) {
	var rows = [];
	if( section ) {
		console.log(section);
		var tr = section.getElementsByTagName( "tr" ),
			th,
			td,
			spec,
			i;
		for( i = 0; i < tr.length; i++ ) {
			th = tr[ i ].getElementsByTagName( "th" );
			td = tr[ i ].getElementsByTagName( "td" );
			spec = {};
			if( th.length > 0 ) spec[ "key" ] = th[ 0 ].innerHTML.trim();
			else spec[ "key" ] = "";
			if( td.length > 0 ) spec[ "value" ] = td[ 0 ].innerHTML.trim();
			else spec[ "value" ] = "";
			rows.push( spec );
		}
	}
	return rows;
}

var amazon_url = document.location.toString();

var is_product_1 = amazon_url.indexOf("/dp/product/");
var is_product_2 = amazon_url.indexOf("/gp/product/");
var is_product_3 = amazon_url.indexOf("/dp/");

if( is_product_1 != -1 || is_product_2 != -1 || is_product_3 != -1 ) {
	var pid;
	if (is_product_3 === -1) {
        pid = amazon_url.split("/gp/product/");
    } else {
        if (is_product_1 === -1) {
            pid = amazon_url.split("/dp/");
        } else {
            pid = amazon_url.split("/dp/product/");
        }
    }
    pid = pid[1]
    pid = pid.split("/");
    pid = pid[0]
    pid = pid.split("?");
    pid = pid[0]
    pid = pid.toLowerCase();
	var message_json = {};
	var product_json = {};
	message_json[ "funct" ] = "scrape";
	product_json[ "title" ] = document.getElementById("productTitle").innerHTML.trim();
	product_json[ "price" ] = document.getElementById("priceblock_ourprice")
	product_json[ "price" ] = product_json[ "price" ] || document.getElementById( "priceblock_saleprice" );
	if( product_json[ "price" ] ) {
		product_json[ "price" ] = product_json[ "price" ].innerHTML.trim();
	} else {
		product_json[ "price" ] = "N/A";
	}
	product_json[ "p_id" ] = pid;
	product_json[ "url" ] = amazon_url.split( "/dp/" )[ 0 ] + "/dp/" + pid;
	product_json[ "img_url" ] = document.getElementById("landingImage").src;
	var specs = [];

	specs.push.apply( specs, get_specs( document.getElementById( "productDetails_techSpec_section_2" ) ) );
	specs.push.apply( specs, get_specs( document.getElementById( "productDetails_techSpec_section_1" ) ) );

	if( specs.length > 0 ) {
		product_json[ "specs" ] = specs;
	}
	message_json[ "product_json" ] = product_json;
	browser.runtime.sendMessage( message_json, do_nothing );	
} else {
	browser.runtime.sendMessage( {"funct" : "scrape", "product_json" : { "p_id" : undefined } }, do_nothing );
}