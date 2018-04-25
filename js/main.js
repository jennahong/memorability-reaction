const PHOTO_SIZE = 350
var INFO;

// CURRENTLY TAKING PICTURE OPTIONAL
// LIMITED RESPONSIVENESS

window.onload = function () {
	// reset json
	INFO = {};

	// taking picture
	var pictureBtn = document.getElementById("take-picture-btn");
	pictureBtn.addEventListener('click', takePicture);

	// submit form
	var submitBtn = document.getElementById("submit-btn");
	submitBtn.addEventListener('click', submitForm);

	// remove picture popup when user clicks anywhere else
	window.onclick = function(event) {
		var popup = document.getElementById("popup");
		if (event.target == popup) {
			popup.style.display = "none";
		}
	}
}

function takePicture() {
	console.log("TAKE PICTURE Btn --> Open Pop Up");

	// open pop up for taking picture
	var popup = document.getElementById('popup');
	popup.style.display = "block";

	// x button on the top
	var span = document.getElementsByClassName("close")[0];
	span.addEventListener('click', exitOut);

	// button to capture photo
	var snapBtn = document.getElementById("snap-btn");
	var btnContainer = document.getElementsByClassName("photo-btn-container")[0];
	var trashBtn = document.getElementById("trash-btn");
	var saveBtn = document.getElementById("save-btn");

	// context for saving image
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var profile = document.getElementById("profile");
	var img;
	
	// start video stream
	var video = document.getElementById("video");
	var localstream;
	navigator.mediaDevices.getUserMedia({ video: {width: PHOTO_SIZE, height: PHOTO_SIZE}, audio: false })
	.then(function(stream) {
		localstream = stream;
		video.srcObject = stream;
		video.onloadedmetadata = function() {
			video.play();
		}
	})
	.catch(function(err) {
		console.log("somethig wrong with taking picture" + err);
	});

	snapBtn.addEventListener('click', function(e){
		console.log("SNAP");
		e.preventDefault();
		
		// pause video and take picture
		video.pause();
		img = capturePhoto();
		snapBtn.style.display = "none";
		btnContainer.style.display = "flex";

		// throw away or save
		trashBtn.addEventListener("click", function(){
			console.log("RETAKE PICTURE");
			// back to defualt
			btnContainer.style = "";
			snapBtn.style = "";
			context.clearRect(0, 0, canvas.width, canvas.height);
			video.play();
		});
		saveBtn.addEventListener("click", function(){
			console.log("SAVE PICTURE");
			// set profile picture
			profile.setAttribute("src", img);
			exitOut();

		});
	});

	function capturePhoto(){
		if (video) {
			canvas.width = PHOTO_SIZE;
			canvas.height = PHOTO_SIZE;
			context.drawImage(video, 0, 0, canvas.width, canvas.height);
			return canvas.toDataURL('image/png');
		}
	}

	function exitOut(){
		video.pause();
		context.clearRect(0, 0, canvas.width, canvas.height);
		// reset buttons
		btnContainer.style = "";
		snapBtn.style = "";

		// reset video
		let videoStream = video.srcObject;
		if (videoStream) {
			videoStream.getTracks().forEach(function(track) {
				track.stop();
			});
			video.srcObject = null;
		}
		popup.style.display = "none";
	}
}

function submitForm() {
	console.log("ENTER FORM");
	var input = $('.validate-input .input100');
    
	// validate input
    var check = true;
    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            check=false;
        }
    }

    // remove alert when user retype
    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    if (check){
        console.log("All Good");
        // save to json
        saveInfo(input);
        // render next html
        // window.open("videos.html");
        document.location.href = "videos.html";
    } else {
        console.log("MISSING more than one input");
    }
}

function saveInfo(){
	var firstname = document.getElementById("first-name").value;
	var lastname = document.getElementById("last-name").value;
	var email = document.getElementById("email").value;
	var affiliation = document.getElementById("affiliation").value;
	// console.log(firstname, lastname, email, affiliation);
	INFO.firstname = firstname.trim().toLowerCase();
	INFO.lastname = lastname.trim().toLowerCase();
	INFO.email = email.trim().toLowerCase();
	INFO.affiliation = affiliation.trim().toLowerCase();
	INFO.profile = document.getElementById("profile").src;
	console.log(INFO);
	localStorage.setItem(firstname+lastname, INFO.stringify);
}

function validate (input) {
	if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
		if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
			return false;
		}
	}
	else {
		if($(input).val().trim() == ''){
			return false;
		}
	}
}

function showValidate(input) {
	var thisAlert = $(input).parent();

	$(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
	var thisAlert = $(input).parent();

	$(thisAlert).removeClass('alert-validate');
}
