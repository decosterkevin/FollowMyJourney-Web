/**
 * http://usejsdoc.org/
 */
function MyMap(map) {
	this.myMap = map;
	this.timestamps= [];
	this.coordinates = [];
	this.polyline = null;
	this.totalDistance = 0;
	this.imageArrays = [];
	this.bounds = new google.maps.LatLngBounds();
	this.initMap = function(userID, bounds) {
		console.log(bounds)
		$.ajax({
			url:'/tracks?id='+userID,
			async: false,
			context: this,
			type: "GET",
			dataType: "json",
			success: function(data) {
				
				if(data.length > 0) {
					var polylines = [];
					var tmpCoordinates = [];
					var tmpTimestamp = [];
					
					var lastElem = data[data.length -1];
					var lastCoord = new google.maps.LatLng(lastElem.coordinates[0] , lastElem.coordinates[1] );
					var min_dist= 1500;
					var boundstmp = this.bounds;
					$.each(data, function(){
						
						var ptnLatLng =  new google.maps.LatLng(this.coordinates[0] , this.coordinates[1]);
						var ptn = {lat:this.coordinates[0] , lng: this.coordinates[1]};
						var distance = google.maps.geometry.spherical.computeDistanceBetween(lastCoord, ptnLatLng);
						if(distance > min_dist)
						{
							tmpTimestamp.push(this.timestamp);
							polylines.push(ptn);
							tmpCoordinates.push(ptnLatLng);
							boundstmp.extend(ptn);
						}
						
					});
					this.bounds = boundstmp;
					min_dist = google.maps.geometry.spherical.computeDistanceBetween(lastCoord, tmpCoordinates[tmpCoordinates.length-1]);
					console.log(min_dist);
					this.polyline = new google.maps.Polyline({
						path: polylines,
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 1.0,
						strokeWeight: 2
					});
					this.totalDistance = google.maps.geometry.spherical.computeLength(this.polyline.getPath().getArray());
					this.polyline.setMap(this.myMap);
					
					
					var tmpMap = this.myMap;
					var onChangeHandler = function () {
						style.changeStyle(tmpMap);
					};
					document.getElementById('style').addEventListener('change', onChangeHandler);
					document.getElementById("totalDistance").innerHTML = "Number of kilometers: " + Math.round(this.totalDistance/1000);
					
					//instead we display a blurr circle
					var cityCircle = new google.maps.Circle({
							strokeColor : '#FF0000',
							strokeOpacity : 0.8,
							strokeWeight : 2,
							fillColor : '#FF0000',
							fillOpacity : 0.35,
							map : this.myMap,
							center : lastCoord,
							radius : min_dist
						});
					this.timestamps= tmpTimestamp;
					this.coordinates = tmpCoordinates;
					// Close the InfoWindow on mouseout:
	//				google.maps.event.addListener(flightPath,'mouseout', function() {
	//				infoWindow.close();
	//				});
					
				}
				var style = new StyledMap();
				var keys = style.getKeys();
				var elem = $("#style");
				for (k = 0; k < keys.length; k++) {
					//<option value="chicago, il">Chicago</option>
					var opt = $('<option>');
					opt.attr('value', keys[k]);
					$('<p>' + (keys[k]).toString() + '</p>').appendTo(opt);
					opt.appendTo(elem);
				}
				var control = document.getElementById('floating-panel');
				control.style.display = 'block';
				
				var control2 = document.getElementById('panelBtn');
				
				this.myMap.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
				this.myMap.controls[google.maps.ControlPosition.TOP_LEFT].push(control2);
				this.myMap.fitBounds(this.bounds);
				
			}
		});
	}
	this.addListeners = function() {
		var infoWindow= new google.maps.InfoWindow({content: "TEST"});
		var time = this.timestamps;
		var coord = this.coordinates;
		var map = this.myMap;
		if(this.polyline != null) {
			google.maps.event.addListener(this.polyline,'click', function(e) {
				var minDist = Number.MAX_VALUE;
				var index = 0;
				for(i = 0; i < time.length; i++) {
					var distance = google.maps.geometry.spherical.computeDistanceBetween(e.latLng, coord[i]);
					if (distance < minDist) {
						minDist = distance;
						index = i;
					}
				}
				infoWindow.setPosition(e.latLng);
				infoWindow.setContent("<b>Date:</b> " +time[index] +"<br> <b>Coordinates</b> (lat,lng) :"+e.latLng.lat().toFixed(4) + ", " +e.latLng.lng().toFixed(4));
				infoWindow.open(map);
			});
		}
		
	}
	
	this.addImages = function(userID, bounds) {
		
		
		
		//Images
		var arrayMarkers = [];
		$.ajax({
			url:'/images?id='+userID,
			async: false,
			context: this,
			type: "GET",
			dataType: "json",
			success: function(data) {
				
				var tmpArrayImages = [];
				var pswpArray = [];
				var left_panel = document.getElementById("left-panel");
				var map = this.myMap;
				var index = 0;
				
				$.each(data, function(){
					var currentIndex = index;
					tmpArrayImages.push({path: this.path+this.name, timestamp:this.timestamp, index: index, comment: this.comment, coordinates: this.coordinates});
					pswpArray.push({src: this.path+this.name, w:this.width, h:this.height});
					index = index + 1;
				});
				
				index = 0;
				var boundsTmp =this.bounds;
				$.each(data, function(){
					var mark = new google.maps.Marker({
			            position: new google.maps.LatLng(this.coordinates[0] , this.coordinates[1] ),
						icon : "images/image.png"
			          });
					boundsTmp.extend({lat:this.coordinates[0] , lng: this.coordinates[1]});
					arrayMarkers.push(mark);
					var currentIndex = index;
					var infoWindow = new google.maps.InfoWindow;
					var div = $('<div class=myBox style="text-align:center"><img id=marker_'+index +' width=140 style="margin:auto" src='+ this.path+this.name+ ' alt="sometext" /> <div style=text-align:center><button style="font-size:20px,display:inline-block" type="button" id=image_'+index+'><i class="material-icons">collections</i></button><p style=display:inline-block>'+(new Date(this.timestamp)).toLocaleDateString()+'</p></div></div>');
					
					var iDiv = document.createElement('img');
					iDiv.addEventListener("click", function () {
						var pswpElement = document.querySelectorAll('.pswp')[0];

						// define options (if needed)
						var options = {
							// history & focus options are disabled on CodePen
							index: currentIndex,
							history : false,
							focus : true,
							showAnimationDuration : 500,
							hideAnimationDuration : 500,
							showHideOpacity : 1,
							bgOpacity : 0.8

						};

						var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpArray, options);
						gallery.init();
					});
					iDiv.src = this.path+this.name;
					iDiv.id = 'marker_' + index;
					iDiv.setAttribute("width", "100%");
					
					left_panel.appendChild(iDiv);
					google.maps.event.addListener(infoWindow, 'domready', function () {
						document.getElementById("image_" +currentIndex).addEventListener("click", function () {
							var pswpElement = document.querySelectorAll('.pswp')[0];

							// define options (if needed)
							var options = {
								// history & focus options are disabled on CodePen
								index: currentIndex,
								history : false,
								focus : true,
								showAnimationDuration : 500,
								hideAnimationDuration : 500,
								showHideOpacity : 1,
								bgOpacity : 0.8

							};

							var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpArray, options);
							gallery.init();
						}, false);
					});
					google.maps.event.addListener(mark, 'click', function () {
						infoWindow.setContent(div.html());
						infoWindow.open(map, mark);

					});
					index ++;
				});
				this.bounds = boundsTmp;
				this.imageArrays = tmpArrayImages;
				
				$.ajax({
					url:'/comments?id='+userID,
					async: false,
					context: this,
					type: "GET",
					dataType: "json",
					success: function(data) {
						var map = this.myMap;
						
						var boundsTmp = this.bounds;
						$.each(data, function(){
							var infoWindow = new google.maps.InfoWindow;
							var mark = new google.maps.Marker({
					            position: new google.maps.LatLng(this.coordinates[0] , this.coordinates[1] ),
								icon : "images/comment.png"
					          });
							boundsTmp.extend({lat:this.coordinates[0] , lng: this.coordinates[1]});
							arrayMarkers.push(mark);
							var div = $('<div style="text-align:center"><p style=text-align:center>'+(new Date(this.timestamp)).toLocaleDateString()+'</p><blockquote style=font-style:italic>  &ldquo; '+this.comment+' &rdquo;,</blockquote></div>');

							google.maps.event.addListener(mark, 'click', function () {
								infoWindow.setContent(div.html());
								infoWindow.open(map, mark);
						});
						

						});
						this.bounds = boundsTmp;
					}
					
				});
				var markerCluster = new MarkerClusterer(map, arrayMarkers,
	            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

			}
		});
		
		

		
		
		
	}
	this.addComments = function(userID,arrayMarkers) {
		$.ajax({
			url:'/comments?id='+userID,
			async: false,
			context: this,
			type: "GET",
			dataType: "json",
			success: function(data) {
				var map = this.myMap;
				$.each(data, function(){
					var infoWindow = new google.maps.InfoWindow;
					var mark = new google.maps.Marker({
			            position: new google.maps.LatLng(this.coordinates[0] , this.coordinates[1] ),
						icon : "images/comment.png"
			          });
					this.bounds.extend({lat:this.coordinates[0] , lng: this.coordinates[1]});
					arrayMarkers.push(mark);
					var div = $('<div style="text-align:center"><blockquote>'+this.comment+'</blockquote><p style=text-align:center>'+(new Date(this.timestamp)).toLocaleDateString()+'</p></div>');

					google.maps.event.addListener(mark, 'click', function () {
						infoWindow.setContent(div.html());
						infoWindow.open(map, mark);
				});
				

				});
			}
			
		});
	}

}