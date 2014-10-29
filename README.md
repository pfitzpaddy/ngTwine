
## NgTwine

- Playground implementing Angular, Leaflet and NgTable.

### Requires
 - Bower
 - Grunt

### Libraries
	
- The required libraries can be found in the bower.json file and include
	- [Angular](https://angularjs.org/)
	- [leaflet-directive](http://tombatossals.github.io/angular-leaflet-directive/) for mapping	
	- [NgTable](http://bazalt-cms.com/ng-table/) for tabular data

### Usage
 - Clone this repo and run the server from the terminal;

		ngTable:$ grunt web_server

- The app is now available here [http://localhost:8000/index.html](http://localhost:8000/index.html)

### Implementation

 - The __twineMapModule__ ("app/controllers/twineMapModule.js") contains the __twineMapCtrl__ controller that manages the leaflet-directive config as well as the locations table definition.
 
 - Both the map and table are linked by __$scope.markerFilteredData__ (GL4 & GL5 data) within the __twineMapCtrl__ controller.
  
 - An __ng-model__ directive is binded to __$scope.search__ and watched within __twineMapCtrl__ controller on change.
 
		// Run filter on search Box change
		$scope.$watch( "search", function () {
			if ( $scope.search && $scope.search.length > 0 ) {
				$scope.filterData();
			}else{
				// Assign to filered data
				$scope.markerFilteredData = $scope.markerData;				
			}		
		}, true);
		
 - This filters the __$scope.markerFilteredData__ based on the user entry
 
 - The map and table are then refreshed by updating;
 		
 		$scope.markers = $scope.markerFilteredData; 
 		
 		$scope.tableParams.reload();
 		
### Notes

 - The binding is not quite correct and the last steps to refresh the map and table should not be required. The use of Angular filter should be enough to update the map and table automatically however this is currently not the case.
 
 - [Zev Ross](http://zevross.com/blog/2014/05/27/synchronize-leaflet-map-data-with-angularjs/) had similar issues and used a __$scope.$watch__ on the map and leaflet data.
 
 - For any further functionality the app can be broken into seperate Directives/Modules to ensure maintainability. 
 
 		


	 
 
