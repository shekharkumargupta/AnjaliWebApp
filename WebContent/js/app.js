var app = angular.module("myApp", [ 'ngRoute' ]);
app.config(function($routeProvider) {
	$routeProvider.when("/signup", {
		controller : 'loginController',
		templateUrl : "signup.html"
	}).when("/login", {
		controller : 'loginController',
		templateUrl : "login.html"
	}).when("/home", {
		controller : 'contentController',
		templateUrl : "home.html"
	}).when("/dashboard", {
		controller : 'dashboardController',
		templateUrl : "dashboard.html"
	}).when("/profileSettings", {
		controller : 'profileController',
		templateUrl : "profileSettings.html"
	}).when("/profile", {
		controller : 'profileController',
		templateUrl : "profile.html"
	}).when("/uploadProfileImage", {
		controller : 'profileController',
		templateUrl : "uploadProfileImage.html"
	}).when("/uploadContentImage", {
		controller : 'contentController',
		templateUrl : "uploadContentImage.html"
	}).when("/home", {
		controller : 'contentController',
		templateUrl : "home.html"
	}).when("/comment", {
		controller : 'commentController',
		templateUrl : "comment.html"
	}).when("/searchProfessionals", {
		controller : 'professionalsController',
		templateUrl : "searchProfessionals.html"
	}).when("/friendList", {
		controller : 'dashboardController',
		templateUrl : "friendList.html"
	}).when("/friendRequestList", {
		controller : 'friendRequestController',
		templateUrl : "friendRequestList.html"
	}).when("/composeMessage", {
		controller : 'messageController',
		templateUrl : "composeMessage.html"
	}).when("/replyMessage", {
		controller : 'messageController',
		templateUrl : "replyMessage.html"
	}).when("/messageList", {
		controller : 'messageController',
		templateUrl : "messageList.html"
	}).when("/chat", {
		controller : 'chatController',
		templateUrl : "chat.html"
	}).otherwise({
		redirectTo : '/home'
	});
});

app.directive('fileModel', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
});

app.filter('timeAgo', function() {
	return function(input) {
		if (input == null)
			return "";
		return jQuery.timeago(input);
	};
});

app.constant('config', {
	apiUrl : "http://localhost:8080/anjaliserver/resources/"
});

app.service('$globalVars', function() {
	var login = "";
	var content = "";
	var profile = login;
	var friendRequests = "";
	var requestedTo = "";
	var messageTo = "";
	var messageCount = "";
	var messageLog = "";
	return {
		setLogin : function(value) {
			login = value;
		},
		getLogin : function() {
			return login;
		},
		setContent : function(value) {
			content = value;
		},
		getContent : function() {
			return content;
		},
		setProfile : function(value) {
			profile = value;
		},
		getProfile : function() {
			return profile;
		},
		setFriendRequests : function(value) {
			friendRequests = value;
		},
		getFriendRequests : function() {
			return friendRequests;
		},
		setMessageTo : function(value) {
			messageTo = value;
		},
		getMessageTo : function() {
			return messageTo;
		},
		setMessageCount : function(value) {
			messageCount = value;
		},
		getMessageCount : function() {
			return messageCount;
		},
		setMessageLog : function(value) {
			messageLog = value;
		},
		getMessageLog : function() {
			return messageLog;
		},
		setRequestedTo : function(value) {
			requestedTo = value;
		},
		getRequestedTo : function() {
			return requestedTo;
		}
	};
});

app.service('appServices', ['$http', '$globalVars','$location',
function($http, $globalVars, $location) {

	var apiUrl = "http://localhost:8080/anjaliserver/resources/";
	this.uploadFile = function(file, description,uploadUrl) {
		var fd = new FormData();
		fd.append('file', file);
		fd.append('description', description);
		$http.post(uploadUrl, fd, {
			withCredentials : true,
			headers : {
				'Content-Type' : undefined
			},
			transformRequest : angular.identity
		}).success(function(fd) {
		}).error(function(error) {
		});
	};

	this.refreshAll = function() {
		var loginId = $globalVars.login.loginId;
		var messageCount = 0;
		var url = '';

		url = apiUrl + 'friendRequest/friendRequestTo/'
				+ loginId;
		$http.get(url).success(function(response) {
			$globalVars.friendRequests = response;
		});

		url = apiUrl
				+ 'friendRequest/friendRequestFrom/'
				+ loginId;
		$http.get(url).success(function(response) {
			$globalVars.requestedTo = response;
		});

		url = apiUrl + 'login/friendList/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.login.friends = response;
		});

		url = apiUrl + 'message/to/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.login.messages = response;
			angular.forEach($globalVars.login.messages,
				function(msgValue,msgKey) {
					if (msgValue.status === 0) {
						messageCount = messageCount + 1;
					}
				});
			$globalVars.messageCount = messageCount;
		});
	};

	this.friendList = function(loginId) {
		var url = apiUrl + 'login/friendList/'
				+ loginId;
		$http.get(url).success(function(response) {
			$globalVars.login.friends = response;
		});
	};

	this.friendRequestList = function(loginId) {
		var url = apiUrl
				+ 'friendRequest/friendRequestTo/'
				+ loginId;
		$http.get(url).success(function(response) {
			$globalVars.friendRequests = response;
		});
	};

	this.messageList = function(loginId) {
		var count = 0;
		$globalVars.login.messages = [];
		var url = config.apiUrl + 'message/to/'+ loginId;
		$http.get(url).success(function(response) {
			$globalVars.login.messages = response;
			angular.forEach($globalVars.login.messages,	
				function(msgValue,	msgKey) {
					if (msgValue.status === 0) {
						count = count + 1;
					}
				});
			$globalVars.messageCount = count;
		});
	};

	this.makeFriendRequest = function() {
		var url = apiUrl
				+ 'friendRequest/makeFriendRequest/'
				+ $globalVars.login.loginId + '/'
				+ $globalVars.profile.loginId;
		$http({
			url : url,
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// alert(JSON.stringify(data));
			$globalVars.requestedTo.splice(0, 0, data);
			$globalVars.profile.requested = true;
		}).error(function(error) {
			alert(error);
		});
	};

	this.profileFriendList = function(loginId) {
		var url = apiUrl + 'login/friendList/'
				+ loginId;
		$http.get(url).success(function(response) {
			// alert(JSON.stringify(response));
			$globalVars.profile.friends = response;
		});
	};

	this.viewProfile = function(loginId) {
		var url = apiUrl + 'login/findByLoginId/'
				+ loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile = response;
			url = apiUrl+ 'login/friendList/'+loginId;
			$http.get(url).success(function(response) {
					$globalVars.profile.friends = response;
				});
				$location.path("/profile");
			});
	};

	this.updateProfile = function(personData) {
		var url = apiUrl + 'login/update';
		$http({
			url : url,
			data : personData,
			method : 'post',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// alert(data);
		}).error(function(error) {
			alert(error);
		});
	};

	this.uploadProfilePic = function(files) {
		var url = apiUrl
				+ 'profileImage/uploadProfilePic/'
				+ $globalVars.login.loginId;
		var fd = new FormData();
		// Take the first selected file
		fd.append("file", files[0]);

		$http.post(url, fd, {
			withCredentials : true,
			headers : {
				'Content-Type' : undefined
			},
			transformRequest : angular.identity
		}).success(function(fd) {

		}).error(function(error) {
			alert(JSON.stringify(error));
		});
	};

	this.isItMe = function() {
		if ($globalVars.profile != null
				&& $globalVars.profile.loginId !== null
				&& $globalVars.login.loginId === $globalVars.profile.loginId) {
			return true;
		} else {
			return false;
		}
	};

	this.isMyFriend = function() {
		var status = false;
		angular.forEach(
			$globalVars.login.friends,
			function(frValue, frKey) {
				if ($globalVars.profile != null
						&& $globalVars.profile.loginId === frValue.loginId) {
					status = true;
				}
		});
		return status;
	};

	this.isRequestedTo = function() {
		var status = false;
		angular.forEach(
			$globalVars.requestedTo,
			function(frValue, frKey) {
				if ($globalVars.profile != null
						&& $globalVars.profile.loginId === frValue.requestTo.loginId) {
					status = true;
				}
		});
		return status;
	};
} ]);

app.factory('appFactory', function($globalVars) {
	var wsService = {};
	wsService.ws = {};

	wsService.connect = function() {
		this.ws = new WebSocket(
				"ws://localhost:8080/anjaliserver/chatServerEndpoint/"
						+ $globalVars.login.loginId);

		this.ws.onmessage = function(message) {
			try {
				if (message != null) {
					wsService.updateUI(message);
				}
			} catch (err) {
				alert(err);
			}
		};

		this.ws.onopen = function() {
			alert('connected');
		};

		this.ws.onclose = function() {
			alert('closed');
		};
	};

	wsService.updateUI = function(message) {
		var jsonData = JSON.parse(message.data);
		messageTextArea.innerHTML += jsonData.from.loginId
				+ ": " + jsonData.messageContent + "<br>";
	};

	wsService.sendMessage = function(message) {
		var index = message.indexOf("#");
		var msgData = message.substring(index + 1,
				message.length);
		messageTextArea.innerHTML += "<div style=\"background-color: yellow; width: 100%; text-align: right;\">"
				+ msgData + "</div>";
		this.ws.send(message);
		messageText.value = "";
	};

	wsService.disconnect = function() {
		if (this.ws != undefined && this.ws != null) {
			this.ws.onclose();
		}
	};
	return wsService;
});

app.controller('mainController', function($scope, $http, $location, $globalVars){
	$scope.login = $globalVars.login;
	$scope.openPage = function(pageName){
		$location.path(pageName);
		$('#wrapper').toggleClass('toggled');
	};
});

app.controller('loginController', function($scope, $http, $location, $globalVars, appServices, config) {
	$scope.baseUrl = config.apiUrl;
	
	var ws;
	$scope.connect = function() {
		ws = new WebSocket(
				"ws://localhost:8080/anjaliserver/chatServerEndpoint/"
						+ $globalVars.login.loginId);

		ws.onopen = function() {
			alert($globalVars.login.loginId+' connected successfully!');
		};

		ws.onclose = function() {
			alert($globalVars.login.loginId+' sign out!');
		};
	};

	
	
	$scope.doLogin = function() {
		var url = config.apiUrl + 'login/verify';
		var data = $scope.login;
		$http({
			url : url,
			data : data,
			method : 'post',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
				if (data.id === '0') {
					$scope.showAlert = true;
					$scope.msg = "Invalid Login Id or Password!";
				}
				if (data.id > 0) {
					$globalVars.login = data;
					appServices.refreshAll();
					$location.path("/home");
					$scope.connect();
				}
		}).error(
			function(error) {
				alert(error);
				$scope.msg = "Technical Problem. Work is going on will be back in a momment";
			});
	};

	$scope.createLogin = function() {
		var url = config.apiUrl + 'login/create';
		var data = $scope.person;
		$scope.person.city = geoplugin_city();
		$http({
			url : url,
			data : data,
			method : 'post',
			headers : {
				'Content-Type' : 'application/json'
			}
		})
				.success(function(data) {
					if (data.id > 0) {
						$location.path("/welcome");
					}
				})
				.error(
						function(error) {
							$scope.msg = "Technical Problem. Work is going on will be back in a momment";
							$location.path("/signup");
						});
	};

	$scope.back = function() {
		window.history.back();
	};
});

app.controller('dashboardController', function($scope, $http, $location,
		$globalVars, appServices, config, $interval) {
	$scope.baseUrl = config.apiUrl;
	$scope.login = $globalVars.login;
	$scope.profile = $globalVars.profile;
	$scope.friendRequests = $globalVars.friendRequests;
	$scope.messageCount = $globalVars.messageCount;

	$scope.friendRequestList = function() {
		$location.path("/friendRequestList");
	};

	$scope.messageList = function() {
		$location.path("/messageList");
	};

	$scope.chat = function() {
		$location.path("/chat");
	};

	$scope.viewProfile = function(loginId) {
		appServices.viewProfile(loginId);
	};

	$scope.refreshAll = function() {
		var object = appServices.refreshAll();
		$scope.friendRequests = $globalVars.friendRequests;
		$scope.messageCount = $globalVars.messageCount;
	};

	/*
	 * $interval(function(){ $scope.refreshAll(); }, 18000);
	 */

	$scope.back = function() {
		window.history.back();
	};
});

app.controller('profileController', function($scope, $http, $location,
		$globalVars, appServices, config) {
	$scope.baseUrl = config.apiUrl;
	$scope.login = $globalVars.login;
	$scope.profile = $globalVars.profile;
	$scope.hideFriendRequest = false;

	if (appServices.isItMe()) {
		$scope.hideFriendRequest = true;
	}
	if (appServices.isMyFriend()) {
		$scope.hideFriendRequest = true;
	}
	if (appServices.isRequestedTo()) {
		$scope.hideFriendRequest = true;
	}

	$scope.updateProfile = function() {
		$scope.login = $globalVars.login;
		appServices.updateProfile($scope.login.person);
	};

	$scope.makeFriendRequest = function() {
		appServices.makeFriendRequest();
	};

	$scope.uploadProfilePic = function(files) {
		var url = config.apiUrl + 'profileImage/uploadProfilePic/'
				+ $scope.login.loginId;
		var fd = new FormData();
		// Take the first selected file
		fd.append("file", files[0]);

		$http.post(url, fd, {
			withCredentials : true,
			headers : {
				'Content-Type' : undefined
			},
			transformRequest : angular.identity
		}).success(function(fd) {

		}).error(function(error) {
			alert(JSON.stringify(error));
		});
	};

	$scope.viewProfile = function(loginId) {
		appServices.viewProfile(loginId);
	};

	$scope.back = function() {
		window.history.back();
	};

});

app.controller('contentController', function($scope, $http, $location,
		$globalVars, appServices, config, $interval) {
	$scope.baseUrl = config.apiUrl;
	$scope.login = $globalVars.login;
	$scope.page = 0;
	$scope.contents = [];
	$scope.content = $globalVars.content;
	$scope.numLimit = 100;
	$scope.showDetails = false;
	$scope.searchString = '';

	$scope.sharedBy = '';

	$scope.findUserByLoginId = function(loginId) {
		var url = config.apiUrl + "login/findByLoginId/" + loginId;
		$http.get(url).success(function(response) {
			$scope.sharedBy = response;
		});
	};

	$scope.showDetails = function() {
		$scope.showDetails = true;
	};

	$scope.search = function() {
		$scope.page++;
		var url = config.apiUrl + "content/searchContent/"
				+ $scope.searchString;
		$http.get(url).success(function(response) {
			$scope.contents = response;
		});
	};

	$scope.showAll = function() {
		$scope.page++;
		// var url = config.apiUrl + "content/findAll/"+ $scope.login.loginId +
		// "/" + $scope.page;
		var url = config.apiUrl + "content/findAll/shekhar@gmail.com/"
				+ $scope.page;
		$http.get(url).success(function(response) {
			$scope.contents = response;
			/*
			 * var url = config.apiUrl + "content/findAll/" +
			 * $scope.login.loginId + "/" + $scope.page;
			 * $http.get(url).success(function(response) { $scope.contents =
			 * response; });
			 */
		});
	};

	/*
	 * $interval(function(){ $scope.showAll(); }, 18000);
	 */

	$scope.showContentList = function() {
		var url = config.apiUrl + 'content/findAllByLoginId' + $scope.login.id;
		$http.get(url).success(function(response) {
			if (response.content.length > 1) {
				$scope.contents = response.content;
			} else {
				$scope.contents = response;
			}
		});
	};

	$scope.createContent = function(uploadImage) {
		var data = $scope.content;
		$scope.content.categoryName = "Health";

		var url = config.apiUrl + 'content/create/' + $scope.login.loginId;
		$http({
			url : url,
			data : data,
			method : 'post',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// $scope.contents.push(data);
			$scope.contents.splice(0, 0, data);
			$globalVars.content = data;
			$scope.content = '';
			if (uploadImage === 'true') {
				$location.path("/uploadContentImage");
			}
		}).error(function(error) {
			// error
		});
	};

	$scope.upload = {
		file : '',
		description : ''
	};

	$scope.showSelectedImage = function() {
		$scope.fileList = [];
		var file = document.getElementById('file');
		var fileArray = file.files;
		if (fileArray.length > 0) {
			for (var i = 0; i < fileArray.length; i++) {
				var urlString = URL.createObjectURL(fileArray[i]);
				alert(urlString);
				$scope.fileList[i] = urlString;
			}
		}
	};

	$scope.uploadImageContent = function() {
		var file = $scope.upload.file;
		var description = $scope.upload.description;
		var url = config.apiUrl + 'contentImage/uploadImage/'
				+ $scope.content.id;
		appServices.uploadFile(file, description, url);
		$scope.content = '';
		$globalVars.content = '';

		$location.path("/home");

	};

	$scope.like = function(content) {
		var url = config.apiUrl + 'content/like/' + content.id + "/"
				+ $scope.login.loginId;
		$http({
			url : url,
			method : 'post',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			if (content.likes === null) {
				content.likes = [];
				content.likes.push($scope.login);
			} else {
				content.likes.push($scope.login);
			}
		}).error(function(error) {

		});
	};

	$scope.share = function(content) {
		var url = config.apiUrl + 'content/share/' + content.id + "/"
				+ $scope.login.loginId;
		$http({
			url : url,
			method : 'post',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// alert(JSON.stringify(data));
		}).error(function(error) {

		});
	};

	$scope.commentScreen = function(content) {
		$globalVars.content = content;
		$location.path("/comment");
	};

	$scope.viewProfile = function(loginId) {
		appServices.viewProfile(loginId);
	};

	$scope.back = function() {
		window.history.back();
	};

});

app.controller('commentController', function($scope, $http, $globalVars,
		$location, appServices, config) {
	$scope.baseUrl = config.apiUrl;
	$scope.content = $globalVars.content;
	$scope.comment = {
		text : '',
		commentedBy : $globalVars.login,
	};

	$scope.doComment = function() {
		var url = config.apiUrl + 'comment/create/' + $scope.content.id;
		$http({
			url : url,
			method : 'post',
			data : $scope.comment,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			if ($scope.content.comments === null) {
				$scope.content.comments = [];
				$scope.content.comments.push($scope.comment);
			} else {
				$scope.content.comments.push($scope.comment);
			}
			$scope.comment = '';
		}).error(function(error) {

		});
	};

	$scope.clearSelectedContent = function() {
		$globalVars.content = '';
	};

	$scope.viewProfile = function(loginId) {
		appServices.viewProfile(loginId);
	};

	$scope.back = function() {
		window.history.back();
	};
});

app.controller('professionalsController', function($scope, $http, $location,
		$globalVars, appServices, config) {
	$scope.baseUrl = config.apiUrl;
	$scope.login = $globalVars.login;
	$scope.page = 0;
	$scope.logins = [];
	$scope.numLimit = 100;
	$scope.showDetails = false;
	$scope.searchString = '';

	$scope.showDetails = function() {
		$scope.showDetails = true;
	};

	$scope.isFriend = function(userList) {
		angular.forEach($globalVars.login.friends, function(frValue, frKey) {
			angular.forEach(userList, function(loginValue, loginKey) {
				if (frValue.loginId === loginValue.loginId) {
					loginValue.friend = true;
				}
			});
		});
	};

	$scope.isRequestSent = function(userList) {
		angular.forEach($globalVars.requestedTo, function(frValue, frKey) {
			angular.forEach(userList, function(loginValue, loginKey) {
				if (frValue.requestTo.loginId === loginValue.loginId) {
					loginValue.requested = true;
				}
			});
		});
	};

	$scope.search = function() {
		$scope.page++;
		var url = config.apiUrl + 'login/search/' + $scope.searchString;
		$http.get(url).success(function(response) {
			$scope.logins = response;
			$scope.isFriend($scope.logins);
			$scope.isRequestSent($scope.logins);
		});
	};

	$scope.showAll = function() {
		$scope.page++;
		var url = config.apiUrl + 'login/findAll';
		$http.get(url).success(function(response) {
			$scope.logins = response;
			$scope.isFriend($scope.logins);
			$scope.isRequestSent($scope.logins);
		});
	};

	$scope.friendList = function(loginId) {
		var url = config.apiUrl + 'login/friendList/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile.friends = response;
		});
	};

	$scope.viewProfile = function(loginId) {
		var url = config.apiUrl + 'login/findByLoginId/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile = response;
			$scope.friendList(loginId);
			$location.path("/profile");
		});
	};

	$scope.back = function() {
		window.history.back();
	};
});

app.controller('friendRequestController', function($scope, $http, $location,
		$globalVars, appServices, config) {
	$scope.baseUrl = config.apiUrl;
	$scope.friendRequests = $globalVars.friendRequests;

	$scope.confirm = function(friendRequestId) {
		$scope.login = $globalVars.login;
		var url = config.apiUrl + 'friendRequest/confirm/' + friendRequestId;
		$http({
			url : url,
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// alert(JSON.stringify(data));
		}).error(function(error) {
			alert(error);
		});
	};

	$scope.friendList = function(loginId) {
		var url = config.apiUrl + 'login/friendList/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile.friends = response;
		});
	};

	$scope.viewProfile = function(loginId) {
		var url = config.apiUrl + 'login/findByLoginId/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile = response;
			$scope.friendList(loginId);
			$location.path("/profile");
		});
	};

	$scope.back = function() {
		window.history.back();
	};
});

app.controller('messageController', function($scope, $http, $location,
		$globalVars, appServices, config) {
	$scope.baseUrl = config.apiUrl;
	$scope.login = $globalVars.login;
	$scope.profile = $globalVars.profile;
	$scope.friendRequests = $globalVars.friendRequests;
	$scope.messageTo = $globalVars.messageTo;
	$scope.message = {
		from : $scope.login,
		to : $scope.messageTo,
		messageContent : ''
	};
	$scope.showList = true;

	$scope.selectUser = function(user) {
		$scope.messageTo = user;
		$scope.message.to = user;
		$scope.showList = false;
	};

	$scope.compose = function(to) {
		$globalVars.messageTo = to;
		$location.path("/composeMessage");
	};

	$scope.reply = function(to) {
		$globalVars.messageTo = to;
		$location.path("/replyMessage");
	};

	$scope.send = function() {
		$scope.login = $globalVars.login;
		var url = config.apiUrl + 'message/create/';
		$http({
			url : url,
			method : 'post',
			data : $scope.message,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// alert(JSON.stringify(data));
		}).error(function(error) {
			alert(error);
		});
	};

	$scope.updateStatus = function(message) {
		$scope.login = $globalVars.login;
		var url = config.apiUrl + 'message/update/';
		$http({
			url : url,
			method : 'post',
			data : message,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			// alert(JSON.stringify(data));
		}).error(function(error) {
			alert(error);
		});
	};

	$scope.friendList = function(loginId) {
		var url = config.apiUrl + 'login/friendList/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile.friends = response;
		});
	};

	$scope.viewProfile = function(loginId) {
		var url = config.apiUrl + 'login/findByLoginId/' + loginId;
		$http.get(url).success(function(response) {
			$globalVars.profile = response;
			$scope.friendList(loginId);
			$location.path("/profile");
		});
	};

	$scope.back = function() {
		window.history.back();
	};

});

app.controller('categoryController', function($scope, $http, config) {
	$scope.baseUrl = config.apiUrl;
	var url = config.apiUrl + 'category/findAll';
	$http.get(url).success(function(response) {
		$scope.categories = response.category;
	});

	$scope.setCategoryId = function(data) {
		alert(data);
	};

	$scope.back = function() {
		window.history.back();
	};
});

app.controller('chatController',function($scope, $http, $globalVars, config, appFactory) {
	$scope.baseUrl = config.apiUrl;
	$scope.login = $globalVars.login;
	$scope.messageLog = $globalVars.messageLog;
	$scope.message = {
		id : '0',
		messageContent : '',
		from : {
			loginId : $scope.login.loginId
		},
		to : {
			loginId : ''
		},
		status : '0'

	};
	$scope.showList = false;

	$scope.selectUser = function(user) {
		$scope.messageTo = user;
		$scope.message.to.loginId = user.loginId;
		$scope.showList = false;
	};

	$scope.back = function() {
		window.history.back();
	};

	var ws;
	$scope.connect = function() {
		ws = new WebSocket(
				"ws://localhost:8080/anjaliserver/chatServerEndpoint/"
						+ $globalVars.login.loginId);

		ws.onmessage = function(message) {
			try {
				if (message != null) {
					$scope.updateUI(message);
				}
			} catch (err) {
				alert(err);
			}
		};

		/*
		ws.onopen = function() {
			alert('connected');
		};

		ws.onclose = function() {
			alert('closed');
		};
		*/
	};

	$scope.updateUI = function(message) {
		var jsonData = JSON.parse(message.data);
		var messageContent = jsonData.messageContent;
		var index = messageContent.indexOf("#");
		var msgData = messageContent.substring(index + 1,
				messageContent.length);
		var messageTextArea = document
				.getElementById(jsonData.from.loginId);

		messageTextArea.innerHTML += "<div style=\"padding: 5px; text-align: left;\">"
				+ "<span style=\"display: inline-block; background-color: green; color: white; padding: 5px; border-radius: 20px; \">"
				+ msgData + "</span>" + "</div>";
	};

	$scope.sendMessage = function() {
		var messageTextArea = document
				.getElementById($scope.messageTo.loginId);
		messageTextArea.innerHTML += "<div style=\"padding: 5px; text-align: right; border-radius: 5px;\">"
				+ "<span style=\"display: inline-block; background-color: #0057b3; color: white; padding: 5px; border-radius: 20px; \">"
				+ $scope.message.messageContent
				+ "</span>"
				+ "</div>";

		// var messageString =
		// $scope.messageTo.loginId+"#"+$scope.message;
		ws.send(JSON.stringify($scope.message));
		messageText.value = "";
	};

	$scope.disconnect = function() {
		if (ws != undefined && ws != null) {
			ws.onclose();
		}
	};
});
