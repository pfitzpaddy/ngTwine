(function(){

	var app = angular.module( "twineGridModule", [ 'ui.grid' ] );

	app.controller( "twineGridCtrl", [ '$scope', function( $scope ) {
		
		// App main
		$scope.ngTwine = $scope.$parent;

		// Set grid height
		$scope.twineGridOptions = {
			enableFiltering: true,
			columnDefs: [
				{ 
					field: 'uuid',
					filter: {
						term: $scope.ngTwine.uuidSearch,
						condition: function(searchTerm, cellValue) {
							return true;
						}
					}
				},
				{ 
					field: 'countryname',
					filter: {
						term: $scope.ngTwine.countrynameSearch,
						condition: function(searchTerm, cellValue) {
							return true;
						}
					}
				},
				{ 
					field: 'name',
					filter: {
						term: $scope.ngTwine.nameSearch,
						condition: function(searchTerm, cellValue) {
							return true;
						}
					}
				}
			],
			onRegisterApi: function( gridApi ) {
				$scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
					// On filter changed, get filter values
					$scope.ngTwine.uuidSearch = this.grid.columns[0].filter.term;
					$scope.ngTwine.countrynameSearch = this.grid.columns[1].filter.term;
					$scope.ngTwine.nameSearch = this.grid.columns[2].filter.term;
					// Filter data
					$scope.ngTwine.filterData();
				});
			}
		};

		// Watch application marker data
		$scope.$watch( "ngTwine.markerDataFiltered", function () {
			$scope.twineGridOptions.data = $scope.ngTwine.markerDataFiltered;
		});
	}]);

})();