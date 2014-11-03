(function(){

	var app = angular.module( "twineMapModule", [ 'leaflet-directive' ]);

	// Update map height
	app.directive('leaflet', function() {
		return function (scope, element, attrs) {
			attrs.height = window.innerHeight - 60 + "px";
		}
	});

	app.controller("twineMapCtrl", [ '$scope', 'leafletData', function( $scope, leaflet ) {
		
		// App main
		$scope.ngTwine = $scope.$parent;

		// Defaults
		angular.extend( $scope, {
			defaults: {
				minZoom: 4,
				zoomControl: false,
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
			markers: $scope.ngTwine.markerDataFiltered,
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

		// Add zoom control to bottom left
		leaflet.getMap().then( function( map ) {
			new L.Control.Zoom( { position: 'bottomright' } ).addTo( map );
		});

		// Watch application marker data
		$scope.$watch( "ngTwine.markerDataFiltered", function () {
			$scope.updateMarkers();
		});

		// Update markers and zoom to bounds (not sure why this does not bind)
		$scope.updateMarkers = function() {
			$scope.markers = $scope.ngTwine.markerDataFiltered;
			leaflet.getMap().then(function(map) {
				// 
				if ( $scope.ngTwine.markerDataFiltered.length ) {
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