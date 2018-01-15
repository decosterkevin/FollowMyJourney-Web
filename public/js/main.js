function generateQR(res) {
	if(res.length != 0){
		
		var key = localStorage['secret_key'] || null;
		
		if (key == null) {
			$.ajax({
				url:'/register',
				async: false,
				context: this,
				type: "GET",
				dataType: "json",
				success: function(data) {
					
					key = data.secret_seed;
					localStorage['secret_key'] = key;
					
				}
			});
		}
		qr(key);
		
	}
	else {
		console.log("not passed")
	}
	grecaptcha.reset();

}

function sendEmail() {
	var form = document.getElementById("emailForm");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", '/sendEmail', true);

	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {//Call a function when the state changes.
	    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
	        // Request finished. Do processing here.
	    }
	}
	//var data = {"to": form["mc-email"].value, "subject" : form["mc-subject"].value, "msg": form["mc-message"].value };
	var data = "to=" +form["mc-email"].value + "&subject=" +form["mc-subject"].value +"&msg=" +form["mc-message"].value
	console.log(data)
	xhr.send(data); 
}

function qr(key) {
	var modal = document.getElementById('myModal');	
	document.getElementById("iframe").innerHTML = '<div id="qrcode"></div>';
	new QRCode(document.getElementById("iframe"), key);
	$("#iframe > img").css({"margin":"auto"});
	var d = document.createElement("DIV");
	d.innerHTML = '<p style="margin-top:10px"><strong>Secret Seed:</strong> '+ key+ '</p>';
	document.getElementById("iframe").appendChild(d);
	modal.style.display = "block";
}

$(document).ready(function(){

	//Navigation menu scrollTo
	$('header nav ul li a').click(function(event){
		event.preventDefault();
		var section = $(this).attr('href');
		var section_pos = $(section).position();

		if(section_pos){
			$(window).scrollTo({top:section_pos.top, left:'0px'}, 1000);
		}
		
	});

	$('.app_link').click(function(e){
		event.preventDefault();
		$(window).scrollTo({top:$("#hero").position().top, left:'0px'}, 1000);		
	});

	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the button that opens the modal
	var btn = document.getElementById("myBtcButton");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal
	btn.onclick = function() {
		document.getElementById("iframe").innerHTML = '<iframe style="border:none;" src="vendors/donate-bitcoin/index.html" height="600px" width="400px"></iframe>';
	    modal.style.display = "block";
	}
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	} 

	$("#inputGenerate").on('keyup', function (e) {
	    if (e.keyCode == 13) {
	       	qr($("#inputGenerate").val());
	    }
	});


	//Show & Hide menu on mobil
	$('.burger_icon').click(function(){
		$('header nav').toggleClass('show');
		$('header .burger_icon').toggleClass('active');
	});


	//wow.js on scroll animations initialization
	wow = new WOW(
	    {
		  animateClass: 'animated',
		  mobile: false,
		  offset: 50
		}
	);
	wow.init();
	
	//parallax effect initialization
	$('.hero').parallax("50%", 0.3);
	
	//Nice scroll initialization
	$("html").niceScroll({
		scrollspeed: 50,
		autohidemode : false,
		cursorwidth : 8,
		cursorborderradius: 8,
		cursorborder : "0",
		background : "rgba(48, 48, 48, .4)",
		cursorcolor : '#1f1f1f',
		zindex : 999
	});


	//Popup video
	$('#play_video').click(function(e){
		e.preventDefault();	

		var video_link = $(this).data('video');
		video_link = '<iframe src="' + video_link + '" width="500" height="208" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

		$('.about_video').append(video_link).fadeIn(200);
	});

	$('.close_video').click(function(e){
		e.preventDefault();	

		$('.about_video').fadeOut(200,function(){
			$('iframe', this).remove();
		});

	});




});