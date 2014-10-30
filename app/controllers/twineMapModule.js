(function(){

	var app = angular.module("twineMapModule", []);

	// Update map height
	app.directive('leaflet', function() {
		return function (scope, element, attrs) {
			attrs.height = window.innerHeight - 60 + "px";
		}
	});	

	// Update table height
	app.directive('leaflet-table', function() {
		return function (scope, element, attrs) {
			attrs.height = window.innerHeight - 60 + "px";
		}
	});

	app.controller("twineMapCtrl", [ '$scope', '$http', '$filter', '$location', 'leafletData', 'ngTableParams', function( $scope, $http, $filter, $location, leaflet, ngTableParams ) {
		
		// markers
		$scope.markerData = [];
		$scope.markerFilteredData = [];
		$scope.search = $location.$$path.split("=")[1];

		// Defaults
		angular.extend( $scope, {
			defaults: {
				minZoom: 4,
				scrollWheelZoom: false
			},          
			center: {
				lat: 0,
				lng: 0,
				zoom: 3
			},
			events: {
				map: {
					enable: ['zoomend'],
					logic: 'emit'
				}
			},
			markers: $scope.markerData,
			layers: {
				baselayers: {
					osm: {
						name: 'OpenStreetMap',
						url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
						type: 'xyz'
					}
				},
				overlays: {
					locations: {
						name: 'Locations',
						type: 'group',
						visible: true
					}
				}				
			}           
		});

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

			// Assign to filered data
			$scope.markerFilteredData = $scope.markerData;
			// Update table
			$scope.tableParams.reload();

			// Initial filter
			if ( $scope.search && $scope.search.length > 0 ) {
				$scope.filterData();
			}

		});

		// Run filter on search Box change
		$scope.$watch( "search", function () {
			if ( $scope.search && $scope.search.length > 0 ) {
				$scope.filterData();
			}else{
				// Assign to filered data
				$scope.markerFilteredData = $scope.markerData;				
			}		
		}, true);


		// Table (ng-table is bloody great http://bazalt-cms.com/ng-table/)
		$scope.tableParams = new ngTableParams({
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				countryname: 'asc' // initial sorting
			}
		}, {
			total: 0, // length of data
			counts: [], // hide page counts control
			getData: function($defer, params) {
				//get data from service
				var data = $scope.markerFilteredData;
				var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
				params.total(orderedData.length)
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});

		// Filter marker data
		$scope.filterData = function() {
			$scope.markerFilteredData = [];
			angular.forEach($scope.markerData, function(m, key) {
				// String search on each attribute
				if ( ( m.uuid.indexOf($scope.search) > -1 ) || 
					 ( m.countryname.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ) || 
					 ( m.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ) ) {
					// Add to filtered list
					this.push(m);
				}
			}, $scope.markerFilteredData);

			// Update URL
			$location.path('/search=' + $scope.search);
			// Update markers
			$scope.updateMarkers();	
			// Update table
			$scope.tableParams.reload();
		};

		// Update markers and zoom to bounds (not sure why this does not bind)
		$scope.updateMarkers = function() {
			$scope.markers = $scope.markerFilteredData;
			leaflet.getMap().then(function(map) {
				// 
				if ( $scope.markerFilteredData.length ) {
					map.fitBounds($scope.getBounds($scope.markers));
				}
			});
		};

		// Zoom to location
		$scope.zoomToLocation = function(m) {
			leaflet.getMap().then(function(map) {
				map.setView( [m.lat, m.lng], 10 );
			});
		};		

		// Get bounds from array of markers
		$scope.getBounds = function(markers) {
			var latlngs = [];
			// Create latlng array
			angular.forEach(markers, function(m, key) {
				this.push([m.lat,m.lng]);
			}, latlngs);

			// Return bounds
			return new L.LatLngBounds(latlngs);
		};

	}]);    

})();