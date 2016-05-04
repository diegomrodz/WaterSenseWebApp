(function ($, angular, _) {
  var WaterSenseApplication = angular.module('WaterSenseApplication', ['ngRoute', 'angular-chartist', 'amChartsDirective']);

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

      self.find = function (sensor, callback) {
        $.post({
          url: url_api("/realtime/ext_temp"),
          data: { 'sensor': sensor  },
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };

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

  WaterSenseApplication.controller('IndexCtrl',
    ['$scope', 'SensorRepository',
    function ($scope, SensorRepository) {
      $scope.sensorList = [];

      SensorRepository.all(function (data) {
        $scope.$apply(function () {
          $scope.sensorList = data;
        });
      });
    }
  ]);

  WaterSenseApplication.controller('DetailExtTempSensorCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
    function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
      $scope.sensor = {};

      $scope.extTempDataset = [];

      $scope.dataFromPromise = function(){
        var deferred = $q.defer();

        var data = $scope.extTempDataset;

        deferred.resolve(data);

        return deferred.promise;
      };

      $scope.extTempChartOptions = $timeout(function () {
        return {
          "type": "serial",
          "theme": "none",
          "marginRight": 40,
          "marginLeft": 40,
          "autoMarginOffset": 20,
          "mouseWheelZoomEnabled": true,
          "dataDateFormat": "YYYY-M-D H:N",
          "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth": true
          }],
          "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
          },
          "graphs": [{
            "id": "g1",
            "balloon": {
              "drop": true,
              "adjustBorderColor": false,
              "color": "#ffffff"
            },
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "value",
            "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
          }],
          "chartScrollbar": {
            "graph": "g1",
            "oppositeAxis": false,
            "offset": 30,
            "scrollbarHeight": 40,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount": true,
            "color": "#AAAAAA"
          },
          "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha": 1,
            "cursorColor": "#258cbb",
            "limitToGraph": "g1",
            "valueLineAlpha": 0.2,
            "valueZoomable": true
          },
          "valueScrollbar": {
            "oppositeAxis": false,
            "offset": 50,
            "scrollbarHeight": 10
          },
          "categoryField": "date",
          "categoryAxis": {
            "parseDates": false,
            "dashLength": 1,
            "minorGridEnabled": true,
            "autoWrap": true,
            "labelFrequency" : 3
          },
          "export": {
            "enabled": true
          },
          "data": $scope.dataFromPromise()
        };
      }, 1000);

      function formatDate(d) {
        return d.getFullYear() + "-" +
               d.getMonth() + "-" +
               d.getDay() + " " +
               d.getHours() + ":" +
               d.getMinutes();
      }

      SensorRepository.find($routeParams.sensorId, function (s) {
        $scope.$apply(function () {
          $scope.sensor = s;

          SensorSignalRepository.find(s.id, function (records) {
            records.reverse();

            $scope.$apply(function () {
              $scope.extTempDataset = _.map(records, function (e, key) {
                var d = new Date(e.createdAt);
                return {
                  date: formatDate(d),
                  value: e.ext_temp
                }
              });
            });

          });
        });
      });
    }
  ]);


  WaterSenseApplication.controller('DetailSensorCtrl',
    ['$scope', '$routeParams', 'SensorRepository', 'SensorSignalRepository',
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
        })

          .when('/sensor/:sensorId/ext_temp', {
            templateUrl: url_view('/sensor_detail_ext_temp'),
            controller: 'DetailExtTempSensorCtrl'
          });
    }
  ]);

}).call(this, jQuery, angular, _);
