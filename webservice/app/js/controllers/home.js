'use strict';

angular.module('ediCreatorApp')
.controller('HomeCtrl', ['$rootScope','$scope','customHttp',function ($rootScope,$scope,customHttp){	
	localStorage.clear();
}])


































// .controller('LoginCtrl',['$rootScope','$scope','$location','customHttp',function ($rootScope, $scope, $location,customHttp){


// 	customHttp.request('','/api/users/getSessionStat',"GET",function(data){
// 		if(data==true)
// 			$location.path('/home');
// 	});


// 	$scope.loading=false;
	
// 	$scope.login= function()
// 	{

// 		$scope.loading=true;
// 		var params={};

// 		var username=$scope.username;
// 		var password=$scope.password;
		
// 		console.log("username"+username);

// 		if(!username)
// 		{
// 			$scope.message="Check Username";
// 			Materialize.toast("Username not entered",6000);
// 			return;	
// 		}
// 		if(!password)
// 		{
// 			$scope.message="Check Password";
// 			Materialize.toast("Password not entered",6000);
// 			return;
// 		}

// 		params="username="+username;
// 		params=params+"&password="+password;

// 		customHttp.request(params,'/api/users/authenticate','POST',function(data){

// 			console.log("data recieved");
// 			console.log(data);
// 			if(data.status!=1)
// 			{
// 				$scope.message=data.msg;
// 				Materialize.toast(data.msg,6000);
// 				$scope.loading=false;
// 			}
// 			else
// 			{
// 				$scope.loading=false;
				
// 				$location.path('/home');

// 			}

// 		});
// 	}
	
// }])

// .controller('IndexCtrl',['$scope', '$location' ,'customHttp',function ( $scope,$location, customHttp){
	
// 	customHttp.request('','/api/users/getSessionStat',"GET",function(data){
// 		if(data==false)
// 			$location.path('/');
// 	});


// 	$scope.path={

// 		admin : "/admin",
// 		'data_entry' : "/dataentry",
// 		accounting : "/accounting",
// 		inventory : "/inventory",
// 	};

// 	$scope.name={
// 		admin : "Admin",
// 		'data_entry' : "Data Entry",
// 		accounting : "Accounting",
// 		inventory : "Inventory",
// 	}


// 	console.log($scope.path['admin']);

// 	customHttp.request('',"/api/users/getIndex",'GET',function(data){
// 		$scope.contents=data.split(",");
// 	});

// 	$scope.logout=function()
// 	{
// 		$location.path('/logout');
// 	};

// }])

.controller('LogoutCtrl',['$scope','$location','customHttp',function ( $scope,$location,customHttp){

	customHttp.request('','/api/users/getSessionStat',"GET",function(data){
		if(data==false)
			$location.path('/');
	});


		customHttp.request('',"/api/users/logout",'GET',function(data){

			if(data)
			{
				$scope.message="Logout Successful";
				$location.path('/');
			}
			else
			{
				$scope.message="Logout Not Successful";
				$location.path('/');
			}
		});



}])

