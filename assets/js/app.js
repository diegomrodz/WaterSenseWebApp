(function ($, angular, _) {
  var WaterSenseApplication = angular.module('WaterSenseApplication', ['ngRoute', 'angular-chartist']);

  function url_view(path) {
    return 'http://localhost:1337/view' + path;
  }

  function url_api(path) {
    return 'http://localhost:1337' + path;
  }

  WaterSenseApplication.service('SensorRepository', [
    function () {
      var self = this;

      self.all = function (callback) {
        $.get(url_api("/Sensor"), function (data) {
          callback(data);
        });
      };

      self.find = function (id, callback) {
        $.get(url_api("/Sensor/"+ id), function (data) {
          callback(data);
        });
      };
    }
  ]);

  WaterSenseApplication.service('SensorSignalRepository', [
    function () {
      var self = this;

      self.last20 = function (sensor, callback) {
        $.post({
          url: url_api("/SensorSignal/interval"),
          data: { 'sensor': sensor },
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };

    }
  ]);

  WaterSenseApplication.controller('IndexCtrl', ['$scope', 'SensorRepository',
    function ($scope, SensorRepository) {
      $scope.sensorList = [];

      SensorRepository.all(function (data) {
        $scope.$apply(function () {
          $scope.sensorList = data;
        });
      });
    }
  ]);

  WaterSenseApplication.controller('DetailSensorCtrl', ['$scope', '$routeParams', 'SensorRepository', 'SensorSignalRepository',
    function ($scope, $routeParams, SensorRepository, SensorSignalRepository) {
      $scope.sensor = {};

      $scope.chartOptions = {
        height: 270,
        chartPadding: 1
      };

      $scope.extTempDataset = {};
      $scope.waterTempDataset = {};
      $scope.luminosityDataset = {};
      $scope.phDataset = {};

      SensorRepository.find($routeParams.sensorId, function (data) {
        $scope.$apply(function () {
          $scope.sensor = data;

          SensorSignalRepository.last20($routeParams.sensorId, function (data) {
            $scope.$apply(function () {

              data.reverse();

              if ($scope.sensor.ext_temp_active) {

                $scope.extTempDataset.labels = _.map(data, function (e, key) {
                  if (key % 5 == 0) {
                    var d = new Date(e.createdAt);
                    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                  }
                  return '';
                });

                $scope.extTempDataset.series = [
                  _.map(data, function (e) {
                    return e.ext_temp;
                  })
                ];
              }

              if ($scope.sensor.water_temp_active) {
                $scope.waterTempDataset.labels = _.map(data, function (e, key) {
                  if (key % 5 == 0) {
                    var d = new Date(e.createdAt);
                    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                  }
                  return '';
                });

                $scope.waterTempDataset.series = [
                  _.map(data, function (e) {
                    return e.water_temp;
                  })
                ];
              }

              if ($scope.sensor.luminosity_active) {
                $scope.luminosityDataset.labels = _.map(data, function (e, key) {
                  if (key % 5 == 0) {
                    var d = new Date(e.createdAt);
                    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                  }
                  return '';
                });

                $scope.luminosityDataset.series = [
                  _.map(data, function (e) {
                    return e.luminosity;
                  })
                ];
              }

              if ($scope.sensor.ph_active) {
                $scope.phDataset.labels = _.map(data, function (e, key) {
                  if (key % 5 == 0) {
                    var d = new Date(e.createdAt);
                    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                  }
                  return '';
                });

                $scope.phDataset.series = [
                  _.map(data, function (e) {
                    return e.ph;
                  })
                ];
              }

            });
          });

        });
      });

    }
  ]);

  WaterSenseApplication.config(['$routeProvider',
    function ($routeProvider) {

      $routeProvider
        .when('/', {
          templateUrl: url_view('/index'),
          controller: 'IndexCtrl'
        })

        .when('/sensor/:sensorId', {
          templateUrl: url_view('/sensor_detail'),
          controller: 'DetailSensorCtrl'
        });
    }
  ]);

}).call(this, jQuery, angular, _);
