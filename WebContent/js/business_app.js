var app = angular.module("myApp", ['infinite-scroll']);
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {controller: 'ideaHomeController', templateUrl: "ideaHome.html"})
            .when("/login", {controller: 'loginController', templateUrl: "login.html"})
            .when("/signUp", {controller: 'loginController', templateUrl: "signup.html"})
            .when("/signUpSuccess", {controller: 'loginController', templateUrl: "signupSuccess.html"})
            .when("/welcome", {controller: 'loginController', templateUrl: "welcome.html"})
            .when("/ideaHome", {controller: 'ideaSearchController', templateUrl: "ideaSearchMain.html"})
            .when("/ideaCreate", {controller: 'ideaCreateController', templateUrl: "ideaCreate.html"})
            .when("/ideaUploadDocuments", {controller: 'ideaUploadController', templateUrl: "ideaUploadDocuments.html"})
            .when("/ideaUploadVideos", {controller: 'ideaUploadController', templateUrl: "ideaUploadVideos.html"})
            .when("/ideaUploadImage", {controller: 'ideaUploadController', templateUrl: "ideaUploadImage.html"})
            .when("/ideaUpdateOptions", {controller: 'ideaUpdateOptionsController', templateUrl: "ideaUpdateOptions.html"})
            .when("/ideaList", {controller: 'ideaListController', templateUrl: "ideaList.html"})
            .when("/ideaSearch", {controller: 'ideaSearchController', templateUrl: "ideaSearchMain.html"})
            .when("/ideaDetails", {controller: 'ideaDetailsController', templateUrl: "ideaDetails.html"})
            .when("/ideaDocuments", {controller: 'ideaDocumentsController', templateUrl: "ideaDocuments.html"})
            .when("/ideaAbout", {controller: 'ideaAboutController', templateUrl: "ideaAbout.html"})
            .when("/ideaInvestment", {controller: 'ideaInvestmentController', templateUrl: "ideaInvestment.html"})
            .when("/ideaProfit", {controller: 'ideaProfitController', templateUrl: "ideaProfit.html"})
            .when("/ideaMoreAbout", {controller: 'ideaMoreAboutController', templateUrl: "ideaMoreAbout.html"})
            .when("/ideaImportants", {controller: 'ideaImportantsController', templateUrl: "ideaImportants.html"})
            .when("/projectSearch", {controller: 'ideaSearchController', templateUrl: "projectSearchMain.html"})
            .otherwise({redirectTo: '/ideaHome'});
});

app.filter('isArray', function () {
    return function (input) {
        return angular.isArray(input);
    };
});

app.service("$globalVars", function () {
    var myName = "Jimmy";
    var searchString = 'Start';
    var ideaId = "0";
    var ideaName = "";
    var idea = "";
    var categoryId = "";
    var login = "";
    return {
        getMyName: function () {
            return myName;
        },
        setMyName: function (value) {
            myName = value;
        },
        getSearchString: function () {
            return searchString;
        },
        setSearchString: function (value) {
            searchString = value;
        },
        getIdeaId: function () {
            return ideaId;
        },
        setIdeaId: function (value) {
            ideaId = value;
        },
        getIdeaName: function () {
            return ideaName;
        },
        setIdeaName: function (value) {
            ideaName = value;
        },
        getIdea: function () {
            return idea;
        },
        setIdea: function (data) {
            idea = data;
        },
        getLogin: function () {
            return login;
        },
        setLogin: function (data) {
            login = data;
        }
    };
});

app.controller('loginController', function ($scope, $http, $location, $globalVars) {
    $scope.loginData = $globalVars.login;
    $scope.login = function () {
        $scope.msg = 'Invalid Login/Password!';
        var url = 'http://shethjee.com/InvestIndia/resources/login/login';
        var data = $scope.fields;
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            if (data.id === 0) {
                $location.path("/login");
            }
            if (data.id > 0 data.active === true) {
                $globalVars.login = data;
                $location.path("/ideaSearch");
            }
        }).error(function (error) {
            $scope.msg = "Technical Problem. Work is going on will be back in a momment";
            $location.path("/login");
        });
    };

    $scope.createLogin = function () {
        var url = 'http://shethjee.com/InvestIndia/resources/login/create';
        var data = $scope.fields;
        $scope.msg = "";
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            alert(JSON.stringify(data));
            if (data.id > 0) {
                $globalVars.login = data;
                alert(JSON.stringify($globalVars.login));
                $location.path("/signUpSuccess");
            }
        }).error(function (error) {
            $scope.msg = "Technical Problem. Work is going on will be back in a momment";
            $location.path("/signUp");
        });
    };

    $scope.goToIdeaCreate = function () {
        $location.path("/ideaCreate");
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToSignUp = function () {
        $location.path("/signUp");
    };
});

app.controller('categoryListController', function ($scope, $http, $globalVars) {
    var url = 'http://shethjee.com/InvestIndia/resources/category/findAll';
    $http.get(url).success(function (response) {
        $scope.categories = response;
    });

    $scope.setCategoryId = function (data) {
        $globalVars.categoryId = data;
        alert(data);
    };
});

app.controller('ideaHomeController', function ($scope, $location, $globalVars) {
    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToProjectSearch = function () {
        $location.path("/projectSearch");
    };

    $scope.goToIdeaCreate = function () {
        $location.path("/ideaCreate");
    };
});

app.controller('ideaListController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.page = 0;
    $scope.ideaPagination = false;
    $scope.ideas = [];
    $scope.showAll = function () {
        $scope.page++;
        if ($scope.login !== undefined) {
            //var url = 'http://shethjee.com/InvestIndia/resources/idea/findAllByLoginId/' + $scope.login.id;
            var url = 'http://shethjee.com/InvestIndia/resources/idea/findAll/' + $scope.page;
            $http.get(url).success(function (response) {
                $scope.ideas = response;
                $scope.loadingText = "Result: " + response.length;
            });
        }
    };

    $scope.showIdeaList = function () {
        var url = 'http://shethjee.com/InvestIndia/resources/idea/findAllByLoginId' + $scope.login.id;
        $http.get(url).success(function (response) {
            if (response.idea.length > 1) {
                $scope.ideas = response.idea;
            } else {
                $scope.ideas = response;
            }
        });
    };

    $scope.showUploadDocumentForm = function (ideaId, ideaName) {
        $globalVars.ideaId = ideaId;
        $globalVars.ideaName = ideaName;
        $location.path("/ideaUploadDocuments");
    };

    $scope.showUploadImage = function (ideaId, ideaName) {
        $globalVars.ideaId = ideaId;
        $globalVars.ideaName = ideaName;
        $location.path("/ideaUploadImage");
    };

    $scope.showIdeaCreate = function () {
        $globalVars.idea = "";
        $location.path("/ideaCreate");
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToIdeaEdit = function (idea) {
        $globalVars.idea = idea;
        $location.path("/ideaCreate");
    };

    $scope.goToUpdateOptions = function (idea) {
        $globalVars.idea = idea;
        $location.path("/ideaUpdateOptions");
    };

});

app.controller('ideaSearchController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.loadingText = "";
    $scope.alertShow = true;
    $scope.searchShow = false;
    $scope.comments = '';
    $scope.ideas = [];
    $scope.page = 0;
    $scope.ideaPagination = false;

    $scope.data = {
        text: '',
        commentedBy: ''
    };
    $scope.enquiryData = {
        consumerQuestion: '',
        email: '',
        mobileNumber: ''
    };

    $scope.showHideSearch = function () {
        $scope.searchShow = !$scope.searchShow;
    };

    $scope.setBusinessTypeValue = function (value) {
        $scope.businessType = value;
    };

    $scope.showAllIdeas = function () {
        var url = 'http://shethjee.com/InvestIndia/resources/idea/findAll/' + $scope.page;
        $http.get(url).success(function (response) {
            $scope.ideas = response;
            $scope.loadingText = "Result: " + response.length;
        });
    };

    $scope.advSearchForm = {
        businessType: '1',
        categoryId: '1',
        city: 'India',
        maxInvestment: '0',
        minProfit: '0'
    };

    $scope.searchAdvance = function () {
        $scope.page++;
        $scope.searchShow = true;
        $scope.loadingText = "Loading...";

        if ($scope.advSearchForm.categoryId === undefined) {
            $scope.advSearchForm.categoryId = 1;
        }
        if ($scope.advSearchForm.city === undefined
                || $scope.advSearchForm.city === '') {
            $scope.advSearchForm.city = 'India';
        }
        if ($scope.advSearchForm.maxInvestment === undefined
                || $scope.advSearchForm.maxInvestment === '') {
            $scope.advSearchForm.maxInvestment = 0;
        }

        var url = 'http://shethjee.com/InvestIndia/resources/idea/searchAdvance/' +
                $scope.advSearchForm.categoryId + "/" + $scope.advSearchForm.city + "/" + $scope.advSearchForm.maxInvestment + "/" + $scope.advSearchForm.minProfit + "/" + $scope.advSearchForm.businessType + "/" + $scope.page;

        $http.get(url).success(function (response) {
            $scope.ideas = $scope.ideas.concat(response);
            $scope.loadingText = "Result: " + response.length;
        });
    };

    $scope.searchIdeas = function () {
        $scope.loadingText = "Loading...";
        var data = $scope.fields;
        if (data === '' || data === undefined) {
            $scope.showAllIdeas();
        } else {
            var url = 'http://shethjee.com/InvestIndia/resources/idea/search/' + data.searchString;
            $http.get(url).success(function (response) {
                $scope.ideas = response;
                $scope.loadingText = "Result: " + response.length;
            });
        }
    };

    $scope.findAllComments = function (idea) {
        $scope.comments = '';
        var url = 'http://shethjee.com/InvestIndia/resources/comment/findAll/' + idea.id;
        $http.get(url).success(function (response) {
            idea.comments = response;
        });
    };
    $scope.postComment = function (idea) {
        var url = 'http://shethjee.com/InvestIndia/resources/comment/create/' + idea.id;
        $http({
            url: url,
            data: $scope.data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.findAllComments(idea);
            $scope.data = {};
        }).error(function (error) {
            alert("ERROR" + $scope.data + "->>" + error);
        });
    };

    $scope.doComment = function (idea) {
        var login = $scope.login;
        if (login !== null && login !== undefined && login.id > 0) {
            $scope.postComment(idea);
        } else {
            $scope.goToLogin();
        }
    };


    $scope.postEnquiry = function () {
        var ideaId = $scope.idea.id;
        var email = $scope.enquiryData.email;
        var url = '';
        if ($scope.idea !== undefined) {
            url = 'http://shethjee.com/InvestIndia/resources/enquiry/create/' + ideaId + '/' + email;
        } else {
            url = 'http://shethjee.com/InvestIndia/resources/enquiry/create/0/' + email;
        }
        $http({
            url: url,
            data: $scope.enquiryData,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            showDialog('#dialog' + ideaId);

            $scope.enquiryMsg = data;
            $scope.enquiryData = {};
            $scope.idea = {};
        }).error(function (error) {
            $scope.enquiryMsg = error;
            alert("ERROR" + error);
        });
    };

    function showDialog(id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    }
    ;

    $scope.goToDocumentList = function (data) {
        $globalVars.idea = data;
        //$location.path("/ideaDocuments");
        $scope.idea = $globalVars.idea;
        var id = $scope.idea.id;
        var url = 'http://shethjee.com/InvestIndia/resources/document/documents/' + id;
        $http.get(url).success(function (response) {
            $scope.documents = response.document;
        });
    };

    $scope.setIdea = function (data) {
        $scope.idea = data;
    };

    $scope.goToHome = function () {
        $location.path("/ideaHome");
    };

    $scope.goToLogin = function () {
        $location.path("/login");
    };

    $scope.goToSignUp = function () {
        $location.path("/signUp");
    };

    $scope.goToIdeaCreate = function () {
        var login = $scope.login;
        if (login !== null && login !== undefined && login.id > 0) {
            $globalVars.idea = "";
            $location.path("/ideaCreate");
        } else {
            $scope.goToLogin();
        }
    };

    $scope.goToIdeaList = function () {
        var login = $scope.login;
        if (login !== null && login !== undefined && login.id > 0) {
            $globalVars.idea = "";
            $location.path("/ideaList");
        } else {
            $scope.goToLogin();
        }
    };

    $scope.goToProjectSearch = function () {
        $location.path("/projectSearch");
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToIdeaDetails = function (data) {
        $globalVars.idea = data;
        $location.path("/ideaDetails");
    };

});

app.controller('ideaDetailsController', function ($scope, $http, $location, $globalVars) {
    $scope.idea = $globalVars.idea;
    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };
});


app.controller('ideaCreateController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.fields = $globalVars.idea;
    $scope.data = $scope.fields;
    $scope.create = function () {
        var data = $scope.fields;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/create';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };


    $scope.update = function () {
        var data = $scope.data;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/update';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };

    $scope.save = function () {
        if ($scope.fields.id === undefined) {
            $scope.create();
        } else {
            $scope.update();
        }
    };

    $scope.showDialog = function (id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    };

    $scope.reload = function () {
        var data = $scope.fields = "";
        $location.path("/ideaCreate");
    };

    $scope.goToHome = function () {
        $location.path("/ideaHome");
    };

    $scope.goToIdeaList = function () {
        $location.path("/ideaList");
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToVideoUpload = function () {
        $globalVars.ideaId = $globalVars.idea.id;
        $globalVars.ideaName = $globalVars.idea.name;
        $location.path("/ideaUploadVideos");
    };

    $scope.goToDocumentUpload = function () {
        $globalVars.ideaId = $globalVars.idea.id;
        $globalVars.ideaName = $globalVars.idea.name;
        $location.path("/ideaUploadDocuments");
    };

    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});

app.controller('ideaUpdateOptionsController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.idea = $globalVars.idea;

    $scope.goToIdeaList = function () {
        $location.path("/ideaList");
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToBasicInfo = function () {
        $location.path("/ideaCreate");
    };

    $scope.goToAbout = function () {
        $location.path("/ideaAbout");
    };

    $scope.goToInvestment = function () {
        $location.path("/ideaInvestment");
    };

    $scope.goToProfit = function () {
        $location.path("/ideaProfit");
    };

    $scope.goToMoreAbout = function () {
        $location.path("/ideaMoreAbout");
    };

    $scope.goToImportants = function () {
        $location.path("/ideaImportants");
    };

    $scope.goToVideoUpload = function () {
        $globalVars.ideaId = $globalVars.idea.id;
        $globalVars.ideaName = $globalVars.idea.name;
        $location.path("/ideaUploadVideos");
    };

    $scope.showUploadImage = function (ideaId, ideaName) {
        $globalVars.ideaId = ideaId;
        $globalVars.ideaName = ideaName;
        $location.path("/ideaUploadImage");
    };
});

app.controller('ideaAboutController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.idea = $globalVars.idea;

    $scope.update = function () {
        $scope.copyText();
        var data = $scope.idea;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/update';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };

    $scope.copyText = function () {
        var editorData = $('#editor').val();
        $scope.idea.about = editorData;
    };

    $scope.showDialog = function (id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});

app.controller('ideaInvestmentController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.idea = $globalVars.idea;

    $scope.update = function () {
        $scope.copyText();
        var data = $scope.idea;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/update';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };

    $scope.copyText = function () {
        var editorData = $('#editor').val();
        $scope.idea.investmentComment = editorData;
    };

    $scope.showDialog = function (id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});

app.controller('ideaProfitController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.idea = $globalVars.idea;

    $scope.update = function () {
        $scope.copyText();
        var data = $scope.idea;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/update';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };

    $scope.copyText = function () {
        var editorData = $('#editor').val();
        $scope.idea.profitComment = editorData;
    };

    $scope.showDialog = function (id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});

app.controller('ideaMoreAboutController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.idea = $globalVars.idea;

    $scope.update = function () {
        $scope.copyText();
        var data = $scope.idea;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/update';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };

    $scope.copyText = function () {
        var editorData = $('#editor').val();
        $scope.idea.moreAbout = editorData;
    };

    $scope.showDialog = function (id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});

app.controller('ideaImportantsController', function ($scope, $http, $location, $globalVars) {
    $scope.login = $globalVars.login;
    $scope.idea = $globalVars.idea;

    $scope.update = function () {
        $scope.copyText();
        var data = $scope.idea;
        var url = 'http://shethjee.com/InvestIndia/resources/idea/update';
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.data = data;
            $scope.showDialog('#dialog');
        }).error(function (error) {
            //error
        });
    };

    $scope.copyText = function () {
        var editorData = $('#editor').val();
        $scope.idea.notes = editorData;
    };

    $scope.showDialog = function (id) {
        var dialog = $(id).data('dialog');
        dialog.open();
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});




app.controller('ideaUploadController', function ($http, $scope, $location, $globalVars) {
    $scope.idea = $globalVars.idea;
    $scope.login = $globalVars.login;
    $scope.ideaId = $globalVars.ideaId;
    $scope.ideaName = $globalVars.ideaName;
    $scope.successMsg = 'Msg';
    $scope.alertShow = false;

    $scope.uploadDocument = function () {
        var url = 'http://shethjee.com/InvestIndia/resources/document/uploadDocument';
        var data = $scope.fields;
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.successMsg = $scope.fields.name + " created successfully!";
            $scope.alertShow = true;
        }).error(function (error) {
            alert("ERROR" + data + "->>" + error);
        });
    };

    $scope.uploadVideo = function () {
        var url = 'http://shethjee.com/InvestIndia/resources/document/uploadVideo/' + $scope.ideaId;
        var data = $scope.fields;
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            $scope.successMsg = $scope.fields.url + " uploaded successfully!";
        }).error(function (error) {
            alert("ERROR" + data + "->>" + error);
        });
    };

    $scope.uploadIdeaImage = function (ideaId) {
        var url = 'http://shethjee.com/InvestIndia/resources/ideaImage/changeImage/' + ideaId;
        var data = $scope.fields;
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            alert(JSON.stringify(idea));
            $scope.goToUpdateOptions(idea);
        }).error(function (error) {
            alert("ERROR" + data + "->>" + error);
        });
    };

    $scope.goToIdeaList = function () {
        $location.path("/ideaList");
    };

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };

    $scope.goToVideoUpload = function () {
        $location.path("/ideaUploadVideos");
    };
    $scope.goToDocumentUpload = function () {
        $location.path("/ideaUploadDocuments");
    };
    $scope.goToUpdateOptions = function () {
        $location.path("/ideaUpdateOptions");
    };
});

app.controller('ideaDocumentsController', function ($http, $scope, $location, $globalVars) {
    $scope.idea = $globalVars.idea;
    var id = $scope.idea.id;
    var url = 'http://shethjee.com/InvestIndia/resources/document/documents/' + id;
    $http.get(url).success(function (response) {
        $scope.documents = response.document;
    });

    $scope.goToIdeaSearch = function () {
        $location.path("/ideaSearch");
    };
});


app.controller('ideaCommentController', function ($scope, $http, $location) {
    $scope.findAllComments = function (idea) {
        var url = 'http://shethjee.com/InvestIndia/resources/comment/findAll/' + idea.id;
        $http.get(url).success(function (response) {
            $scope.comments = response.comment;
        });
    };

    $scope.postComment = function (idea) {
        var url = 'http://shethjee.com/InvestIndia/resources/comment/create/' + idea.id;
        var data = $scope.commentData;
        $http({
            url: url,
            data: data,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            //alert(JSON.stringify(data));
            findAllComments(idea);
        }).error(function (error) {
            alert("ERROR" + data + "->>" + error);
        });
    };

    $scope.doComment = function (idea) {
        var login = $scope.login;
        if (login !== null && login !== undefined && login.id > 0) {
            $scope.postComment(idea);
        } else {
            $scope.goToLogin();
        }
    };
});
