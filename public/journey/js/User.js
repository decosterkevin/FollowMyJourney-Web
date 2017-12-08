/**
 * http://usejsdoc.org/
 */

function User() {
	this.tripName = null;
	this.userHashId = null;
	this.started = null;
	this.ended = null;
	this.totalTime = 0; //in days
	this.init = function(userID) {
		var result = true;
		$.ajax({
			url:'/user?id='+userID,
			async: false,
			context: this,
			type: "GET",
			dataType: "json",
			success: function(data) {
				if (data.length>0) {
					var user = data[0];
					this.userHashId = user.userKey;
					this.started = new Date(user.started);
					this.tripName = user.nameTrip;
					if(user.ended != null) {
						this.ended = new Date(user.ended);
					}
					var end =new Date();
					if (this.ended != null) {
						end = this.ended;
					}
					var timeDiff = Math.abs(end.getTime() - this.started.getTime());
					this.totalTime = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
					var header = document.getElementById("title").innerHTML =  this.tripName;
					
					document.getElementById("totalDays").innerHTML = "Number of days: " +this.totalTime;
					document.getElementById("startedDate").innerHTML = "Started: " + (new Date(this.started)).toLocaleDateString();
					result = true;
				}
				else {
					result = false;
				}
				
				
			}
		});
		return result;
		
		
	}
}