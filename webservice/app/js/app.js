'use strict';

var cerebrumApp = angular.module('ediCreatorApp', ['ui.router', 'ngCookies', 'ngSanitize', 'ui.select']);

cerebrumApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider){
	
	$urlRouterProvider.otherwise('/home');
	$locationProvider.html5Mode(true);

	$stateProvider


// ********************CEREBRUM***************************
//Home
		.state('home', {
			url: '/home',
			templateUrl: '/views/home/index.html',
			controller: 'HomeCtrl'
		})
/*
	Create EDI Guide
*/
		//select Agency TODO : Change Names
		.state('selectAgencyAndVersion', {
			url: '/edi/agency',
			templateUrl: '/views/createEDI/selectAgencyAndVersion.html',
			controller: 'AgencyAndVersionCtrl'
		})

		//select Version
		.state('selectVersion',{
			url: '/edi/agency/version',
			templateUrl: '/views/createEDI/selectVersion.html',
			controller: 'VersionCtrl'	
		})

		//select TransactionSet
		.state('selectTransactionSet',{
			url: '/edi/agency/version/transactionSet',
			templateUrl: '/views/createEDI/selectTransactionSet.html',
			controller: 'TransactionSetCtrl'	
		})

		//select SegmentUsage
		.state('selectSegmentUsage',{
			url: '/edi/agency/version/transactionSet/segmentUsage',
			templateUrl: '/views/createEDI/selectSegmentUsage.html',
			controller: 'SegmentUsageCtrl'	
		})

		//select ElementUsageDefs
		.state('selectElementUsageDefs',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs',
			templateUrl: '/views/createEDI/selectElementUsageDefs.html',
			controller: 'ElementUsageDefsCtrl'	
		})

		//Set Additional Data
		.state('setAdditionalData',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData',
			templateUrl: '/views/createEDI/setAdditionalData.html',
			controller: 'SetAdditionalDataCtrl'	
		})

		//Preview document
		.state('previewDocument',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview',
			templateUrl: '/views/createEDI/previewDocument.html',
			controller: 'PreviewCtrl'	
		})
});