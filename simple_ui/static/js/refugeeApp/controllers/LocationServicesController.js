function chunk(arr, size) {
    var newArr = [];
    for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
    }
    return newArr;
}

angular.module('refugeeApp').controller('LocationServicesController', function ($scope, $state, $stateParams, LocationService, location, $location) {
    var vm = this;
    vm.busy = false;
    vm.noMoreData = false;
    vm.chunkedServicesList = [];
    vm.services = [];
    vm.serviceTypes = {};
    vm.slug = $stateParams.slug;
    vm.location = location;
    vm.mapView = false;
    vm.search = $stateParams.query;
    var getFilterTypesArr = function () {
        if ($stateParams.type) {
            if (angular.isArray($stateParams.type)) {
                return $stateParams.type.map(function (x) {
                    return parseInt(x, 10);
                });
            }
            else {
                return [parseInt($stateParams.type, 10)];
            }
        }
        else {
            return [];
        }
    };
    vm.filterTypes = getFilterTypesArr();

    LocationService.getServiceTypes().then(function (response) {
        response.data.forEach(function (serviceType) {
            vm.serviceTypes[serviceType.url] = serviceType;
        });
        vm.loaded = true;
    });
    var page = 1;

    $scope.$watch(function () {
        return vm.search;
    }, function (newValue) {
        if (angular.isDefined(newValue)) {
            if (newValue) {
                $location.search('query', newValue);
            }
            else {
                $location.search('query', null);
            }
        }
        vm.services = [];
        vm.chunkedServicesList = [];
        vm.noMoreData = false;
        page = 1;
        vm.search = newValue;
        vm.getNextPage();
    });

    $scope.$watchCollection(function () {
        return vm.filterTypes;
    }, function (newValue) {
        if (newValue) {
            $location.search('type', newValue);
        } else {
            $location.search('type', null);
        }
        vm.filterTypes = newValue;
        vm.services = [];
        vm.chunkedServicesList = [];
        vm.noMoreData = false;
        page = 1;
        vm.getNextPage();
    });

    vm.getServiceIcon = function (url) {
        var serviceType = vm.serviceTypes[url];
        if (!serviceType) {
            return;
        } else {
            return serviceType.vector_icon;
        }
    };

    vm.getNextPage = function () {
        if (vm.busy || vm.noMoreData) {
            return;
        }
        vm.busy = true;
        LocationService.getServices(vm.location, page, vm.search, vm.filterTypes).then(function (response) {
            response.data.results.forEach(function (service) {
                vm.services.push(service);
            });
            vm.chunkedServicesList = chunk(vm.services, 3);
            page++;
            vm.busy = false;
            if (!response.data.next) {
                vm.noMoreData = true;
            }
            else {
                vm.getNextPage();
            }
        });
    };

    vm.switchView = function () {
        vm.mapView = !vm.mapView;
    };
});
