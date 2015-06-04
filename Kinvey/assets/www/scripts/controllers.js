/**
* Copyright (c) 2014 Kinvey Inc.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
* in compliance with the License. You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under the License
* is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
* or implied. See the License for the specific language governing permissions and limitations under
* the License.
*
*/
var controllers = angular.module('controllers', []);

// Login Controller
controllers.controller('LoginController', 
	['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
	$scope.active = false;
	$scope.active1 = true;
	angular.element(document.querySelector('.signup-header > span')).removeClass('arrow-down');
	angular.element(document.querySelector('.signup-header > span')).addClass('arrow-right');
	angular.element(document.querySelector('.login-header > span')).addClass('arrow-down');
	$scope.navigate = function (page) {
		if(page=='login') {
			$scope.active = false;
			$scope.active1 = true;
			angular.element(document.querySelector('.signup-header > span')).removeClass('arrow-down');
			angular.element(document.querySelector('.signup-header > span')).addClass('arrow-right');
			angular.element(document.querySelector('.login-header > span')).removeClass('arrow-right');
			angular.element(document.querySelector('.login-header > span')).addClass('arrow-down');
		} else {
			$scope.active1 = false;
			$scope.active = true;
			angular.element(document.querySelector('.login-header > span')).removeClass('arrow-down');
			angular.element(document.querySelector('.login-header > span')).addClass('arrow-right');
			angular.element(document.querySelector('.signup-header > span')).removeClass('arrow-right');
			angular.element(document.querySelector('.signup-header > span')).addClass('arrow-down');
		}
	}	
	$scope.goBack=function()
	{
		  history.back();
	}
	$scope.login = function () {
	    var isFormInvalid = false;

	    //check is form valid
	    if ($scope.loginForm.email.$error.email || $scope.loginForm.email.$error.required) {
		  $scope.submittedEmail = true;
		  isFormInvalid = true;
	    } else {
		  $scope.submittedEmail = false;
	    }
	    if ($scope.loginForm.password.$error.required) {
		  $scope.submittedPassword = true;
		  isFormInvalid = true;
	    } else {
		  $scope.submittedPassword = false;
	    }
	    if (isFormInvalid) {
		  return;
	    }
	    
	    //Kinvey login starts
	    
	    var promise = $kinvey.User.login({
		    username: $scope.username,
		    password: $scope.password
		});
		promise.then(
		    function (response) {
			  //Kinvey login finished with success
			  $scope.submittedError = false;
				  $scope.userName = $kinvey.getActiveUser().username;
				  $scope.userRole = $kinvey.getActiveUser().role;
				  $scope.userId = $kinvey.getActiveUser()._id;
				  if($scope.userRole=='manager'){
						$scope.loader="hidedata";
						$location.path("templates/manager_details");
					  } else {
						$scope.loader="hidedata";
						$location.path('/templates/user_details/'+$scope.userId);
					}
		    },
		    function (error) {
			  //Kinvey login finished with error
			  $scope.submittedError = true;
			  $scope.errorDescription = error.description;
			  $scope.userRole = $kinvey.getActiveUser().role;
			  $scope.userId = $kinvey.getActiveUser()._id;
			  if(error.name==='AlreadyLoggedIn') {
				if($scope.userRole=='manager'){
					$scope.loader="hidedata";
					$location.path("templates/manager_details");
				  } else {
					$scope.loader="hidedata";
					$location.path('/templates/user_details/'+$scope.userId);
				}
			  }
		    }
		);
	}
		
	$scope.forgetPassword = function () {
		$location.path("templates/password_reset");
	}
	$scope.signUp = function () {
		$location.path("templates/sign_up");
	}
}]);
	
// Reset Password Controller
controllers.controller('ResetPasswordController', 
	['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
	$scope.resetPassword = function () {
	    //check are form fields correct
	    if ($scope.resetPasswordForm.email.$error.email || $scope.resetPasswordForm.email.$error.required) {
		  $scope.submitted = true;
		  return;
	    }else{
		  $scope.submitted = false;
	    }
	    //Kinvey reset password starts
	    var promise = $kinvey.User.resetPassword($scope.email);
	    promise.then(
		  function () {
			//Kinvey reset password finished with success
			$location.path("templates/login");
		  });
	}

	$scope.logIn = function () {				
		$location.path("templates/login");
	}
	}]);
	
// SignUp Controller
controllers.controller('SignUpController', 
	['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
		$scope.signUp = function () {
		    var isFormInvalid = false;

		    //check is form valid
		    if ($scope.registrationForm.email.$error.email || $scope.registrationForm.email.$error.required) {
			  $scope.signupEmail = true;
			  isFormInvalid = true;
		    } else {
			  $scope.signupEmail = false;
		    }
		    if ($scope.registrationForm.password.$error.required) {
			  $scope.signupPassword = true;
			  isFormInvalid = true;
		    } else {
			  $scope.signupPassword = false;
		    }
		    if (isFormInvalid) {
			  return;
		    }

		    //Kinvey signup starts
			var promise = $kinvey.User.signup({
				 username: $scope.email,
				 password: $scope.password,
				 email: $scope.email,
				 role:'developer'
			});
			promise.then(
					function () {
			    //Kinvey signup finished with success
			    $scope.signupError = false;
						$location.path("templates/logged_in");
						$scope.loader = "hidedata";
					}, 
					function(error) {
			    //Kinvey signup finished with error
			    $scope.signupError = true;
			    $scope.errorDescription = error.description;
						console.log("signup error: " + error.description);
					}
			);
		}
	}]);

// LoggedIn Controller
controllers.controller('LoggedInController', 
	['$scope', '$kinvey', '$location', function($scope, $kinvey, $location)  {
   
	$scope.logout = function () {
	    console.log("logout");

	    //Kinvey logout starts
	    var promise = $kinvey.User.logout();
	    promise.then(
		  function () {
			//Kinvey logout finished with success
			$kinvey.setActiveUser(null);
			$location.path("templates/login");
		  },
		  function (error) {
			//Kinvey logout finished with error
		  });
	}
	
	var isFormInvalid = false;
	$scope.verifyEmail = function () {
	    var user = $kinvey.getActiveUser();

	    //Kinvey verifying email starts
		    var promise = $kinvey.User.verifyEmail(user.username);
			promise.then(function() {
				//Kinvey verifying email finished with success
				alert("Email is sent");
			  }
	    );
	}
	$scope.userRole = $kinvey.getActiveUser().role;
	if($scope.userRole=='manager')
	{
		$scope.loader = "hidedata";
		$location.path("templates/manager_details");
	}
		
	$scope.showEmailVerification = function () {
	    var activeUser = $kinvey.getActiveUser();
	    if (activeUser != null) {
		  //check is user confirmed email
		  var metadata = new $kinvey.Metadata(activeUser);
		  var status = metadata.getEmailVerification();
		  console.log("User email " + status + " " + activeUser.email);
		  $scope.loader="hidedata";
		  if (status === "confirmed" || !(!!activeUser.email)) {
			return false;
		  } else {
			return true;
		  }
	    }
	}
	$scope.goBack=function()
	{
		 history.back();
	}
  }]);
  
// Get Details Controller
controllers.controller('GetDetailsController', 
	['$scope', '$kinvey', "$location", "$routeParams",  function($scope, $kinvey, $location, $routeParams) {		
	   $scope.userName = $kinvey.getActiveUser().username;
	   $scope.userRole = $kinvey.getActiveUser().role;
	   $scope.userId = $kinvey.getActiveUser()._id;
	   $scope.loader="show-loading-screen";

     $scope.redirectTo = function(path) {
		$location.path("templates/"+path);
     }
	//check is form valid	  
	$scope.logout = function () {

	    //Kinvey logout starts
	    var promise = $kinvey.User.logout();
	    promise.then(
		  function () {
			//Kinvey logout finished with success
			$kinvey.setActiveUser(null);
			$location.path("templates/login");
		  },
		  function (error) {
			//Kinvey logout finished with error
		  });
	}
	
	// To fetch projects drop down
	$scope.allProjects = null;
	var projects = $kinvey.DataStore.get('projects');
			projects.then(function(model) {
			$scope.projects  = [];
			angular.forEach(model, function(item) {
				var list = {};
				list.name = item.name;
				list.id = item._id;
				$scope.projects.push(list);
		});
		$scope.loader="hidedata";
		$scope.allProjects = $scope.projects;
		$scope.projectName = $scope.projects[0];
	}, function(err) {
	    $scope.error = "error" ;
	    $scope.message = "fetch projects collection" ;
	    $scope.loader="hidedata";
	});			
	
	// updating project details with approve status in android collection 
	$scope.saveStatus = function (option, collectionId) {
		var query = new $kinvey.Query();
		query.equalTo('_id', collectionId);
		var promise1 = $kinvey.DataStore.find('android', query);
		promise1.then(function(model1) {   
			model1[0]['approve']=option;
			var promise = $kinvey.DataStore.save('android', model1[0]);
			promise.then(function(model) {
			    $location.path("templates/manager_details/");
			}, function(err) {
			});
		}, function(err) {
			$scope.error = "error" ;
			$scope.message = "update collection" ;
		});
		$scope.loader="hidedata";
	}
	
	// save the project details in android collection.
	$scope.SaveDetails = function () {
		var isFormInvalid = false;
		if ($scope.projectForm.projectName.$error.required) {
			$scope.SubmittedName = true;
			isFormInvalid = true;
		} else {
			$scope.SubmittedName = false;
		}
		if ($scope.projectForm.projectTime.$error.required) {
			$scope.submittedTime = true;
			isFormInvalid = true;
		} else {
			$scope.submittedTime = false;
		}
	     if ($scope.projectForm.projectDescription.$error.required) {
			$scope.submittedDesc = true;
			isFormInvalid = true;
		} else {
			$scope.submittedDesc = false;
		}
		if (isFormInvalid) {
			return;
		}
		
		var promise = $kinvey.DataStore.save('android', {
		    projectid : $scope.projectName.id,
		    time : $scope.projectTime,
		    desc : $scope.projectDescription,
		    userid : $scope.userId
		});
		promise.then(function(model) {
			$location.path("templates/user_details/"+$scope.userId);
		}, function(err) {
				$scope.error = "error" ;
				$scope.message = "save collection" ;
		});
		$scope.loader = "hidedata";
	}
	
	$scope.goBack=function()
	{
		 history.back();
	}
	
	// loading data when page is called 
	$scope.selecteduserid = $routeParams.userid;
	$scope.init = function()
	{
		$scope.loader="show-loading-screen";
		console.log('get Details init function');
		$scope.selecteduserid = $routeParams.userid;
		if($scope.selecteduserid==undefined)
		{
			var promise = $kinvey.DataStore.get('android');
			promise.then(function(model) {				
				var projectIds = [];
				angular.forEach(model, function(obj) {
					projectIds.push(obj.projectid);
				});
				// Fetching Project name from project collection
				var query = new $kinvey.Query();
				query.contains('_id', projectIds);
				var promise1 = $kinvey.DataStore.find('projects',query);
				promise1.then(function(model1) {					
					angular.forEach(model1, function(projectObj) {
						var projectId = projectObj._id.toString();
						angular.forEach(model, function(androidObj) {
							if (androidObj.projectid === projectId) {
								androidObj.projectName = projectObj.name;
								delete androidObj.projectid;
							}

						});
					});
					$scope.getUserData = model;
					$scope.loader="hidedata";
				}, function(err) {
					$scope.error = "error" ;
					$scope.message = "fetching project name error";
				});
			}, function(err) {
				$scope.error = "error" ;
				$scope.message = "fetching collection data error";
			});				
		}
		else
		{
			var query = new $kinvey.Query();
			query.equalTo('userid', $scope.selecteduserid);
			var promise = $kinvey.DataStore.find('android',query);
			promise.then(function(model) {
				var projectIds = [];
				angular.forEach(model, function(obj) {
					projectIds.push(obj.projectid);
				});
				// Fetching Project name from project collection
				var query = new $kinvey.Query();
				query.contains('_id', projectIds);
				var promise1 = $kinvey.DataStore.find('projects',query);
				promise1.then(function(model1) {					
					angular.forEach(model1, function(projectObj) {
						var projectId = projectObj._id.toString();
						angular.forEach(model, function(androidObj) {
							if (androidObj.projectid === projectId) {
								androidObj.projectName = projectObj.name;
								delete androidObj.projectid;
							}

						});
					});
					$scope.getUserData = model;
					$scope.loader="hidedata";
				}, function(err) {
					$scope.error = "error" ;
					$scope.message = "fetching project name error";
				});				
				$scope.loader="hidedata";
			}, function(err) {
				$scope.error = "error" ;
				$scope.message = "fetching collection data error";
			});
		}
		
		// fetching android collection data
		$scope.getManagerData = [];
		var currentTimeStamp =  new Date().toISOString().split('T')[0];
		var query = new Kinvey.Query();
		query.greaterThanOrEqualTo('_kmd.lmt', currentTimeStamp).descending('_kmd.lmt').and().exists('approve',false);
		var group = $kinvey.Group.count('userid');
		group.query(query);
		var promise = $kinvey.DataStore.find('android', query);
		promise.then(function(model2) {
			if(model2.length==0) {
				$scope.loader="hidedata";
				$scope.getManagerData = {};
			} else {
				var projectIds = [];
				angular.forEach(model2, function(obj) {
					projectIds.push(obj.projectid);
				});
				// Fetching Project name from project collection
				var query = new $kinvey.Query();
				query.contains('_id', projectIds);
				var promise1 = $kinvey.DataStore.find('projects',query);
				promise1.then(function(model1) {					
					angular.forEach(model1, function(projectObj) {
						var projectId = projectObj._id.toString();
						angular.forEach(model2, function(androidObj) {
							if (androidObj.projectid === projectId) {
								androidObj.projectName = projectObj.name;
								delete androidObj.projectid;
							}

						});
					});
					$scope.getManagerData = model2;
				}, function(err) {
					$scope.error = "error" ;
					$scope.message = "fetching projects error" ;
				});	
				var userIds = [];
				angular.forEach(model2, function(obj) {
					userIds.push(obj.userid);
				});
				var query = new $kinvey.Query();
				query.contains('_id', userIds);
				var promise1 = $kinvey.User.find(query);
				promise1.then(function(model1) {					
					angular.forEach(model1, function(userObj) {
						var userId = userObj._id;
						angular.forEach(model2, function(androidObj) {
							if (androidObj.userid === userId) {
								androidObj.userName = userObj.username;
							}
						});
					});
					$scope.loader="hidedata";
				}, function(err) {
					$scope.error = "error" ;
					$scope.message = "fetching user error" ;
				});
			}
		}, function(err) {
			$scope.error = "error" ;
			$scope.message = "fetching user error" ;
		});
		if($scope.userRole=='developer') {
			angular.element(document.querySelector('#new_entry')).removeClass('hide');
			angular.element(document.querySelector('#new_entry')).addClass('show');
		}else {
			angular.element(document.querySelector('#new_entry')).removeClass('show');
			angular.element(document.querySelector('#new_entry')).addClass('hide');
		}
	};
	
	$scope.showDetails = function(projectid) {
		$scope.selectedid =  projectid;	
		$location.path("templates/user_project_details/"+$scope.selectedid);
	}
}]);

// Approve Details Controller
controllers.controller('ApproveDetailsController', 
	['$scope', '$kinvey', "$location", "$routeParams",  function($scope, $kinvey, $location, $routeParams) {		
	   $scope.userName = $kinvey.getActiveUser().username;
	   $scope.loader="show-loading-screen";

	   $scope.logout = function () {
		console.log("logout");

	    //Kinvey logout starts
		var promise = $kinvey.User.logout();
			promise.then(
				function () {
					//Kinvey logout finished with success
					$kinvey.setActiveUser(null);
					$location.path("templates/login");
			},
			function (error) {
				//console.log('User logout', error);
		  });
	}
		
	// fetching approve data from android collection data
	$scope.getApprovedManagerData = [];
	var query = new Kinvey.Query();
	query.exists('approve',true);
	var promise = $kinvey.DataStore.find('android', query);
	promise.then(function(approveModel) {
		var projectIds = [];
		angular.forEach(approveModel, function(obj) {
			projectIds.push(obj.projectid);
		});
		// Fetching Project name from project collection
		var query = new $kinvey.Query();
		query.contains('_id', projectIds);
		var promise1 = $kinvey.DataStore.find('projects',query);
		promise1.then(function(model1) {					
			angular.forEach(model1, function(projectObj) {
				var projectId = projectObj._id.toString();
				angular.forEach(approveModel, function(androidObj) {
					if (androidObj.projectid === projectId) {
						androidObj.projectName = projectObj.name;
						delete androidObj.projectid;
					}
				});
			});
			$scope.getApprovedManagerData = approveModel;
			$scope.loader="hidedata";
		}, function(err) {
			$scope.error = "error" ;
			$scope.message = "fetching project name error";
		});	
		
		var userIds = [];
		angular.forEach(approveModel, function(obj) {
			userIds.push(obj.userid);
		});
		var query = new $kinvey.Query();
		query.contains('_id', userIds);
		var promise1 = $kinvey.User.find(query);
		promise1.then(function(model1) {					
			angular.forEach(model1, function(userObj) {
				var userId = userObj._id;
				angular.forEach(approveModel, function(androidObj) {
					if (androidObj.userid === userId) {
						androidObj.userName = userObj.username;
					}
				});
			});
		}, function(err) {
			$scope.error = "error" ;
			$scope.message = "fetching project name error";
		});
	}, function(err) {
		$scope.error = "error" ;
		$scope.message = "fetching user details error";
	});
	
	// Fetching Project name from project collection
	$scope.selectedid = $routeParams.projectid;	
	if($scope.selectedid!=undefined)
	{
		$scope.getProjectData = [];
		var query = new $kinvey.Query();
		query.contains('_id', [$scope.selectedid]);
		var promise1 = $kinvey.DataStore.find('android', query);
		promise1.then(function(model) {					
			$scope.getProjectData = model;
				// Fetching Project name from project collection
				var query = new $kinvey.Query();
				query.contains('_id', [$scope.getProjectData[0].projectid]);
				console.log('projectid----', $scope.getProjectData[0].projectid);
				var promise1 = $kinvey.DataStore.find('projects',query);
				promise1.then(function(model1) {					
					angular.forEach(model1, function(projectObj) {
						var projectId = projectObj._id.toString();
						angular.forEach(model1, function(androidObj) {
							$scope.getProjectData[0].projectName = projectObj.name;
							delete androidObj.projectid;
						});
					});
				}, function(err) {
					$scope.error = "error" ;
					$scope.message = "fetching project name error";
				});	
				
				var query = new $kinvey.Query();
				query.contains('_id', [$scope.getProjectData[0].userid]);
				var promise1 = $kinvey.User.find(query);
				promise1.then(function(model1) {					
					angular.forEach(model1, function(userObj) {
						var userId = userObj._id;
						angular.forEach(model1, function(androidObj) {
							$scope.getProjectData[0].userName = userObj.username;
							delete androidObj.userid;
						});
					});
				}, function(err) {
					$scope.error = "error" ;
					$scope.message = "fetching User dtails error";
				}); 
				$scope.loader="hidedata";
			}, function(err) {
				$scope.error = "error" ;
				$scope.message = "fetching project name error";
			});
	}
	
	$scope.showDetails = function(projectid) {
		$scope.selectedid =  projectid;	
		$location.path("templates/user_project_details/"+$scope.selectedid);
	}
			
	$scope.goBack=function()
	{
		 history.back();
	}
}]);