
window.addEventListener("load", function(){

	var config = {
		syncURL: "https://thisisapp.wilddogio.com"
	};

	wilddog.initializeApp(config);
	
	var myDBref = wilddog.sync().ref();

	(function(){

		var guideBox = document.getElementById('guide-panel');
		var closeGuide = guideBox.getElementsByClassName('close-guide')[0];

		var portraitList = guideBox.getElementsByTagName('a');
		var portrait;

			document.getElementById('head-portrait').className = 'portrait '+ localStorage.portrait;
			document.getElementById('uuid').className = localStorage.uuid;

		for(var i=0; i<portraitList.length; i++) {
			
			portraitList[i].index = i;

			var num;

			portraitList[i].onclick = function () {

				if(num != null) {
					portraitList[num].style.borderColor = "#DDD";
				}

				num = this.index;

				this.style.borderColor = "#F60";

				localStorage.portrait = 'po-'+ (this.index + 1);

				portrait = 'po-'+ (this.index + 1);

				console.log(portrait);

				document.getElementById('head-portrait').className = 'portrait '+ portrait;

			}

		}

		if(localStorage.firstRun == 1) {
			guideBox.style.display = "none";
		}else{
			guideBox.style.display = "block";
		}

		closeGuide.onclick = function () {

			guideBox.style.display = "none";
			localStorage.firstRun = 1;
			document.getElementById('uuid').className = localStorage.uuid = uuid();
			
		}

		function uuid() {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
			s[8] = s[13] = s[18] = s[23] = "-";
		
			var uuid = s.join("");
			return uuid;
		}

	})();
	

	(function(){
		document.getElementById('show-option').onclick = function () {
			if(!this.show) {
				document.getElementById('option-panel').style.left = "0%";
				this.getElementsByTagName('i')[0].className = 'active';
				this.show = true;
			} else {
				document.getElementById('option-panel').style.left = "-150%";	
				this.getElementsByTagName('i')[0].className = '';
				this.show = false;
			}
		}

		document.getElementById('show-chatroom').onclick = function () {
			if(!this.show) {
				document.getElementById('chatroom-panel').style.top = "0%";
				this.show = true;
			} else {
				document.getElementById('chatroom-panel').style.top = "-150%";	
				this.show = false;
			}
		}

	})();


	(function(){
		var contentBox = document.getElementById('content-box');
		var submit = document.getElementById('submit-content');
		var contentText = document.getElementById('content-text');

		contentBox.scrollTop = contentBox.scrollHeight - contentBox.offsetHeight;

		submit.onclick = function () {

			var portrait = document.getElementById('head-portrait').className;
			var content = contentText.value;
			var user = document.getElementById('uuid').className;

			if(content != "") {
				
				myDBref.child('message').push({
					"content" : content,
					"portrait" : portrait,
					"user" : user
				});

				//produceContent( content, 'sent', portrait);
				contentText.value = '';
				contentBox.scrollTop = contentBox.scrollHeight - contentBox.offsetHeight + 110;
			}

		

		}

	})();


	(function(){
		// 获取输入框的数据
		// 将数据写到云端 message 节点下，child 用来定位子节点

		myDBref.child('message').once('value', function(data, error) {

			if (error == null) {

				var objs = data.val();
				var user;
				for(var o in objs){

					if (objs[o].user ==  document.getElementById('uuid').className) {
						user = 'sent';
					} else {
						user = "";
					}


					// produceContent (objs[o].content, user, objs[o].portrait);

				}

			} else {

				console.log(error);

			}


		});
		
		myDBref.child('message').on('child_added', function(data) {

				var objs = data.val();
				var user;

				if (objs.user ==  document.getElementById('uuid').className) {
					user = 'sent';
				} else {
					user = "";
				}

				produceContent (objs.content, user, objs.portrait);
		});










	})();




});



function produceContent (content, user, portrait) {

	var contentBox = document.getElementById('content-box');

	var messageEle = document.createElement("div");
		messageEle.className = 'message ' + user;

		if(portrait == "") {
			messageEle.innerHTML = '<a class= "portrait ' + portrait + '"></a><p>' + content + '</p>';
		} else {
			messageEle.innerHTML = '<a class= "' + portrait + '"></a><p>' + content + '</p>';
		}


		contentBox.appendChild(messageEle);
		
		contentBox.scrollTop = contentBox.scrollHeight - contentBox.offsetHeight + 110;
}











