(function(){
	'use sctrict';

	var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngTouch']);

  //begining of the navbar section

	app.component('navbar', {
		templateUrl: '/templates/navbar.html'
	});


  //begining of the section that links them to the page

	app.config(function($stateProvider) {
		$stateProvider
			.state('index', {
				url: '',
				templateUrl: '/templates/home.html',
				controller: 'homeCtrl'
			})
			.state('cuisines', {
				url: '/:id/cuisines',
				templateUrl: '/templates/cuisines.html',
				controller: 'cuisinesCtrl'
			})
			.state('restaurants',{
				url: '/:id/:cuisines_id/restaurants',
				templateUrl: '/templates/restaurants.html',
				controller: 'restaurantCtrl'
			})
	});

	app.run(['$rootScope', '$stateParams', '$http', function($rootScope, $stateParams, $http){
        //Put your API key here
        $rootScope.key = 'a093d5a3746d15cd7caa326b1853edb0';

    }]);



    //begining of the homeCtrl section

	app.controller('homeCtrl', function($scope, $http, $rootScope, $state){
		$scope.searchCity = function(){
			let city = $('#city').val();


      //getting those cities

			$http({
				method: 'GET',
				url: 'https://developers.zomato.com/api/v2.1/cities',
				params: {
					'q': city
				},
				headers: {
					'user-key': $rootScope.key
				},

			}).then(function(response){
				console.log(response);
				$scope.city = response.data;
				console.log($scope.city);
				$('#myModal').show()
			});
		}
		$scope.selectCity = function(id){
			$state.transitionTo('cuisines', {id:id})

		}
	});


  //Begining of the cuisinesCtrl section

	app.controller('cuisinesCtrl', function($scope, $http, $rootScope, $stateParams, $state){
		$scope.id = $stateParams.id;

		var food  = 0;
		var soup = 3;
		var selCuisine = [];

      //getting those cuisines for those cities

			$http({
				method: 'GET',
				url: 'https://developers.zomato.com/api/v2.1/cuisines',
				params: {
					'city_id': $scope.id
				},
				headers: {
					'user-key': $rootScope.key
				},

			}).then(function(response){
				console.log(response);
				$scope.getCuisines = response.data;

			});

      //getting some more cities because why not

			$http({
				method: 'GET',
				url: 'https://developers.zomato.com/api/v2.1/cities',
				params: {
					'city_ids': $scope.id
				},
				headers: {
					'user-key': $rootScope.key
				},


			}).then(function(response){
				console.log(response);
				$scope.getCity = response.data;
				$.each($scope.getCuisines.cuisine, function(index, data){
					data.cuisines.selected = false;
				});
			});

      //getting those cuisines to equal some good ole food

			$scope.toggle= function(index){
				console.log(index);
				$scope.getCuisines.cuisines[index].cuisine.selected = !$scope.getCuisines.cuisines[index].cuisine.selected;
				console.log($scope.getCuisines.cuisines[index])

					if($scope.getCuisines.cuisines[index].cuisine.selected == true) {
						food++;
						console.log("+1 selected")
					} else {
						food--;
						console.log("-1 selected")
					}

					selCuisine.push($scope.getCuisines.cuisines[index].cuisine.cuisine_id);
					console.log(selCuisine);

					$rootScope.selectedString = selCuisine.toString();
					console.log($rootScope.selectedString);

					if(food == soup){
						$state.transitionTo('restaurants',{cuisines_id:$rootScope.selectedString,id:$scope.id})
					};
			};
		})

    //begining of the restaurantCtrl section

		app.controller('restaurantCtrl', function($scope, $http, $rootScope, $stateParams, $state){
			$scope.id = $stateParams.id;
			$scope.getRestaurants;


        //getting even moreeeee cities

        $http({
          method: 'GET',
          url: 'https://developers.zomato.com/api/v2.1/cities',
          params: {
            'city_ids': $scope.id
          },
          headers: {
            'user-key': $rootScope.key
          },


        }).then(function(response){
          $scope.name = response.data.location_suggestions
          console.log($scope.name);
        })


        //getting some information about the cities and the stuff that is in them
        
				$http({
					method: 'GET',
					url: 'https://developers.zomato.com/api/v2.1/search',
					params: {
						'entity_type':"city",
						'entity_id': $scope.id,
						'cuisines': $rootScope.selectedString,
						'sort':'rating'
					},
					headers: {
						'user-key': $rootScope.key
					},

				}).then(function(response){
					console.log(response);
					$scope.getRestaurants = response.data;
				});


		});

})()
