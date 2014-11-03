(function(){

	var app = angular.module( "twineApp", [
		'twineMapModule',
		'twineGridModule'
	]);

	app.controller( "twineAppCtrl", [ '$scope', '$http', '$filter', '$location', function( $scope, $http, $filter, $location ){
		
		// Marker data 
		$scope.markerData = [];
		$scope.markerDataFiltered = [];
		// URL search params
		$scope.uuidSearch = $location.search().uuid;
		$scope.countrynameSearch = $location.search().country;
		$scope.nameSearch = $location.search().location;

		// Get the countries geojson data from a JSON
		$http.get("data/geolevels.json").success( function( geojson, status ) {
			// Add markers to $scope
			angular.forEach(geojson.features, function(location, i) {
				if ( location.geometry.coordinates[0] != 0 
					&& location.geometry.coordinates[1] != 0
					&& location.properties.countryname ) {

					// Format popup string
					var type="";
					var iconType = location.properties.map_icon.replace(".png","").split("-");
					angular.forEach(iconType, function(t, j) { type += t.charAt(0).toUpperCase() + t.slice(1) + " "; });
					var popup = '<div align="left"><b>' + location.properties.countryname + '</b>';
						popup += '<br/>Location: ' + location.properties.name;
						popup += '<br/>Type: ' + type.slice(0,-1) + '</div>';					

					// Push onto array of markers
					this.push({
						layer: 'locations',
						uuid: location.properties.uuid,
						countryname: location.properties.countryname,
						name: location.properties.name,
						geolevel: location.properties.geolevel,
						lng: location.geometry.coordinates[0],
						lat: location.geometry.coordinates[1],
						message: popup,
						focus: false,						
						icon: { 
							iconSize: [18, 18],
							iconUrl: 'icons/' + location.properties.map_icon
						}
					});
				}
			}, $scope.markerData);

			// Run initial ßfilter
			$scope.filterData();

		});

		// Run filter on search Box change
		$scope.$watch( "uuidSearch", "countrynameSearch", "nameSearch", function () {
			$scope.filterData();
		}, true);

		// Filter marker data
		$scope.filterData = function() {
			// Set URL
			$scope.setUrlParams();
			// Filter data
			$scope.markerDataFiltered = [];
			angular.forEach( $scope.markerData, function( m, key ) {
				// Filter on all columns
				if ( $scope.filterUuid( m ) && $scope.filterCountryname( m ) && $scope.filterName( m ) ) {
					this.push( m );
				}
			}, $scope.markerDataFiltered );
		};

		// Update URL
		$scope.setUrlParams = function(){
			if ($scope.uuidSearch || $scope.countrynameSearch || $scope.nameSearch ) {
				$location.search( 'uuid', $scope.uuidSearch );
				$location.search( 'country', $scope.countrynameSearch );
				$location.search( 'location', $scope.nameSearch );
			} else {
				$location.search({});
				$location.path('');
			}
		};
		
		// filter uuid
		$scope.filterUuid = function( m ) {
			// Search uuid
			if ( $scope.uuidSearch && $scope.uuidSearch.length > 0 ) {
				return m.uuid.indexOf($scope.uuidSearch) > -1;
			} else {
				return true;
			}
		};

		// filter country name
		$scope.filterCountryname = function( m ) {
			// Search country
			if ( $scope.countrynameSearch && $scope.countrynameSearch.length > 0 ) {
				return m.countryname.toLowerCase().indexOf($scope.countrynameSearch.toLowerCase()) > -1;
			} else {
				return true;
			}
		};

		// filter location name
		$scope.filterName = function( m ) {
			// Search location name
			if ( $scope.nameSearch && $scope.nameSearch.length > 0 ) {
				return m.name.toLowerCase().indexOf($scope.nameSearch.toLowerCase()) > -1;
			} else {
				return true;
			}
		};

	}]);

})();