if(!com) var com={};
if(!com.spedr) com.spedr={};

com.spedr.package = function(){
  var pub = {};

  pub.loading = false;
  pub.shorted = false;
  pub.urlbar_icon = {
  	init: function() {		
  		document.getElementById("browser").addEventListener("DOMAttrModified", function(e) {
  			if(e.attrName == "selected" || e.attrName == "value"){
  				pub.shorted = false;
  				pub.urlbar_icon.show_normal();
  			}
  		}, false);
  	},
  	
  	mouseOver: function() {
  		if (pub.loading == false){
  			var icon = document.getElementById("spedr-button");
  			if(pub.shorted == false)
  				icon.src='chrome://spedr/skin/icon12.png';
  			else
  				icon.src='chrome://spedr/skin/icon22.png';
  		}
  	},
  	
  	mouseOut: function() {
  		if (pub.loading == false){
  			var icon = document.getElementById("spedr-button");
  			if(pub.shorted == false)
  				icon.src='chrome://spedr/skin/icon11.png';
  			else
  				icon.src='chrome://spedr/skin/icon21.png';
  		}
  	},
  	
  	show_loading: function() {
  		var icon = document.getElementById("spedr-button");
  		
  		pub.loading = true;
  		icon.src='chrome://spedr/skin/ajax-loader.gif';
  	},
  	
  	show_normal: function() {
  		var icon = document.getElementById("spedr-button");
  		
  		pub.loading = false;
  		if(pub.shorted == false)
  			icon.src='chrome://spedr/skin/icon11.png';
  		else
  			icon.src='chrome://spedr/skin/icon21.png';
  	},
  	
  	show_exclamation: function() {
  		var icon = document.getElementById("spedr-button");
  		
  		pub.loading = false;
  		icon.src='chrome://spedr/skin/exclamation.png';
  	}
  };
  
  
  pub.conn;
  pub.conn_error = false;
  pub.spedr = {
  	url_short: function(){
  		if(pub.loading == false){
  			conn_error = false;
  		
  			var large_url = document.getElementById('urlbar').value;
  			var spedr_url = "http://spedr.com/post";
  			var params = "url=" + encodeURIComponent(large_url);
  
  			conn = new XMLHttpRequest();
  			conn.open('POST', spedr_url, true);
  			conn.onerror = pub.spedr.onError;
  			conn.onreadystatechange = pub.spedr.callback;
  			conn.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  			conn.setRequestHeader("Content-length", params.length);
  			conn.setRequestHeader("Connection", "close");
  			conn.send(params);
  			
  			pub.urlbar_icon.show_loading();
  		}
  	},
  	
  	url_unshort: function(){
  	},
  	
  	onError: function(e) {
  		if(conn_error == false){
  			if(e.target.status != '')
  				error_text = "Error " + e.target.status + " occurred.";
  			else
  				error_text = "spedr not available at this moment. Sorry";
  			conn_error = true;
  			pub.urlbar_icon.show_exclamation();
  			alert(error_text);
  			pub.urlbar_icon.show_normal();
  		}
  	},
  
  
  	callback: function() {
  		if (conn.readyState == 4){
  	        if (conn.status == 200){
  	            document.getElementById('urlbar').value = conn.responseText;
  				if(conn.responseText.match('^(http\:\/\/)?(www\.)?spedr.com.*')){
  					const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].  
  					getService(Components.interfaces.nsIClipboardHelper);  
  					gClipboardHelper.copyString(conn.responseText);  
  					pub.shorted = true;
  				} else
  					pub.shorted = false;
  				pub.urlbar_icon.show_normal();
  			} else {
  				if(conn_error == false) {		
  					conn_error = true;
  					pub.urlbar_icon.show_exclamation();					
  					if(conn.responseText != '')
  						error_text = conn.responseText;
  					else
  						error_text = "spedr not available at this moment. Sorry";						
  					alert(error_text);
  					pub.urlbar_icon.show_normal();
  				}
  			}
  		}
  	}
  };

  return pub;
}();

window.addEventListener("load", function(e) { com.spedr.package.urlbar_icon.init(e); }, false);
//com.ziesemer.myPackage.alertHello();
