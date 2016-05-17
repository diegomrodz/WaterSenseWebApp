(function ($, angular, _) {
  var WaterSenseApplication = angular.module('WaterSenseApplication', ['ngRoute', 'angular-chartist', 'amChartsDirective', 'ngMap']);

  function url_view(path) {
    return 'http://localhost:1337/view' + path;
  }

  function url_api(path) {
    return 'http://localhost:1337' + path;
  }

  function digestDate(dateString) {
    var day = dateString.slice(0, 2);
    var month = dateString.slice(3, 5);
    var year = dateString.slice(6, 10);
    var hour = dateString.slice(11, 14);

    return new Date(year, month, day, hour);
  }

  function formatDate(date) {
    return date.getMonth() + "/" + date.getDate() + " " + date.getHours();
  }

  function digestAvgValue(valueString) {
    return parseFloat(valueString, 10).toFixed(3);
  }

  WaterSenseApplication.service('IQA', [
    function () {
      var self = this;

      var W_DT_A = 0.0003869;
      var W_DT_B = 0.1815;
      var W_DT_C = 0.01081;

      self.qDT = function (dt) {
        if (dt < -5) return undefined;
        if (dt > 15) return 9.0;

        return 1 / (W_DT_A * Math.pow(dt + W_DT_B, 2) + W_DT_C);
      }
    }
  ]);

  WaterSenseApplication.service('SensorRepository', [
    function () {
      var self = this;

      self.all = function (callback) {
        $.get(url_api("/Sensor"), function (data) {
          callback(data);
        });
      };

      self.find = function (id, callback) {
        $.get(url_api("/Sensor/" + id), function (data) {
          callback(data);
        });
      };
    }
  ]);

  WaterSenseApplication.service('SensorSignalRepository', [
    function () {
      var self = this;

      self.last1000 = function (sensor, callback) {
        $.ajax({
          url: url_api("/SensorSignal/find"),
          data: {'sensor': sensor, 'limit': 1000},
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };

      self.last20 = function (sensor, callback) {
        $.ajax({
          url: url_api("/SensorSignal/find"),
          data: {'sensor': sensor},
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };

      self.daily_avg = function (sensor, limit, callback) {
        $.ajax({
          url: url_api('/SensorSignal/daily_avg'),
          data: {'sensor': sensor, 'limit': limit},
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };

      self.hourly_avg = function (sensor, limit, callback) {
        $.ajax({
          url: url_api('/SensorSignal/hourly_avg'),
          data: {'sensor': sensor, 'limit': limit},
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };

      self.today = function (sensor, callback) {
        $.ajax({
          url: url_api("/SensorSignal/interval"),
          data: {'sensor': sensor, 'period': 'today'},
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

  WaterSenseApplication.controller('ExtTempSensorDailyCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.extTempDataset = [];

        $scope.dataFromPromise = function () {
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
            "dataDateFormat": "MM/DD HHh",
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
              "balloonText": "<span style='font-size:14px;'>[[value]]</span>"
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
              "labelsEnabled": false
            },
            "export": {
              "enabled": true
            },
            "data": $scope.dataFromPromise()
          };
        }, 1000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.hourly_avg(s.id, 1000, function (records) {
              records.reverse();

              $scope.$apply(function () {
                $scope.extTempDataset = _.map(records, function (e, key) {
                  var d = digestDate(e.DATA);
                  return {
                    date: formatDate(d),
                    value: digestAvgValue(e.ext_temp)
                  }
                });
              });

            });

          });
        });
      }
    ]);

  WaterSenseApplication.controller('WaterTempSensorDailyCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.waterTempDataset = [];

        $scope.dataFromPromise = function () {
          var deferred = $q.defer();

          var data = $scope.waterTempDataset;

          deferred.resolve(data);

          return deferred.promise;
        };

        $scope.waterTempChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "none",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "mouseWheelZoomEnabled": true,
            "dataDateFormat": "MM/DD HHh",
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
              "balloonText": "<span style='font-size:14px;'>[[value]]</span>"
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
              "labelsEnabled" : false
            },
            "export": {
              "enabled": true
            },
            "data": $scope.dataFromPromise()
          };
        }, 1000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.hourly_avg(s.id, 1000, function (records) {
              records.reverse();

              $scope.$apply(function () {
                $scope.waterTempDataset = _.map(records, function (e, key) {
                  var d = digestDate(e.DATA);
                  return {
                    date: formatDate(d),
                    value: digestAvgValue(e.water_temp)
                  }
                });
              });

            });
          });
        });
      }
    ]);

  WaterSenseApplication.controller('LuminositySensorDailyCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.luminosityDataset = [];

        $scope.dataFromPromise = function () {
          var deferred = $q.defer();

          var data = $scope.luminosityDataset;

          deferred.resolve(data);

          return deferred.promise;
        };

        $scope.luminosityChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "none",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "mouseWheelZoomEnabled": true,
            "dataDateFormat": "MM/DD HHh",
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
              "balloonText": "<span style='font-size:14px;'>[[value]]</span>"
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
              "labelsEnabled": false
            },
            "export": {
              "enabled": true
            },
            "data": $scope.dataFromPromise()
          };
        }, 1000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.hourly_avg(s.id, 1000, function (records) {
              records.reverse();

              $scope.$apply(function () {
                $scope.luminosityDataset = _.map(records, function (e, key) {
                  var d = digestDate(e.DATA);
                  return {
                    date: formatDate(d),
                    value: digestAvgValue(e.luminosity)
                  }
                });
              });

            });
          });
        });
      }
    ]);

  WaterSenseApplication.controller('PHSensorDailyCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.pHDataset = [];

        $scope.dataFromPromise = function () {
          var deferred = $q.defer();

          var data = $scope.pHDataset;

          deferred.resolve(data);

          return deferred.promise;
        };

        $scope.pHChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "none",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "mouseWheelZoomEnabled": true,
            "dataDateFormat": "MM/DD HHh",
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
              "balloonText": "<span style='font-size:14px;'>[[value]]</span>"
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
              "labelFrequency": 3
            },
            "export": {
              "enabled": true
            },
            "data": $scope.dataFromPromise()
          };
        }, 1000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.hourly_avg(s.id, 1000, function (records) {
              records.reverse();

              $scope.$apply(function () {
                $scope.pHDataset = _.map(records, function (e, key) {
                  var d = digestDate(e.DATA);
                  return {
                    date: formatDate(d),
                    value: digestAvgValue(e.ph)
                  }
                });
              });

            });
          });
        });
      }
    ]);

  WaterSenseApplication.controller('ExtTempSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.sensor = s;
        });
      }
    ]);

  WaterSenseApplication.controller('WaterTempSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository', 'IQA',
      function ($scope, $routeParams, SensorRepository, IQA) {
        $scope.chartOptions = {
          height: 270,
          width: 240,
          chartPadding: 1,
          fullWidth: false
        };

        var rng = _.range(-5, 20, 5);

        $scope.iqaWaterTempDataset = {
          labels: rng,
          series: [
            _.map(rng, function (e) {
              return IQA.qDT(e);
            })
          ]
        };

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.sensor = s;
        });
      }
    ]);

  WaterSenseApplication.controller('DetailLuminositySensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.sensor = s;
        });
      }
    ]);

  WaterSenseApplication.controller('PHSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.sensor = s;
        });
      }
    ]);

  WaterSenseApplication.controller('DetailSensorCtrl',
    ['$scope', '$routeParams', 'SensorRepository', 'SensorSignalRepository', 'NgMap',
      function ($scope, $routeParams, SensorRepository, SensorSignalRepository, NgMap) {
        $scope.sensor = {};

        $scope.chartOptions = {
          height: 270,
          chartPadding: 1
        };

        $scope.extTempDataset = {};
        $scope.waterTempDataset = {};
        $scope.luminosityDataset = {};
        $scope.phDataset = {};

        $scope.mapLat = 0;
        $scope.mapLng = 0;

        $scope.formatCreateDate = function (date) {
          var d = new Date(date);

          return d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
        };

        SensorRepository.find($routeParams.sensorId, function (data) {
          $scope.$apply(function () {
            $scope.sensor = data;

            $scope.mapLat = data.setup_position.latitude;
            $scope.mapLng = data.setup_position.longitude;

            SensorSignalRepository.daily_avg($routeParams.sensorId, 20, function (data) {
              $scope.$apply(function () {

                data.reverse();

                if ($scope.sensor.ext_temp_active) {

                  $scope.extTempDataset.labels = _.map(data, function (e, key) {
                    if (key % 3 == 0) {
                      return e['DATA'];
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
                    if (key % 3 == 0) {
                      return e['DATA'];
                    }
                    return '';return '';
                  });

                  $scope.waterTempDataset.series = [
                    _.map(data, function (e) {
                      return e.water_temp;
                    })
                  ];
                }

                if ($scope.sensor.luminosity_active) {
                  $scope.luminosityDataset.labels = _.map(data, function (e, key) {
                    if (key % 3 == 0) {
                      return e['DATA'];
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
                    if (key % 3 == 0) {
                      return e['DATA'];
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

        .when('/sensor/:sensorId/ext_temp/daily', {
          templateUrl: url_view('/sensor_detail_ext_temp_daily'),
          controller: 'ExtTempSensorDailyCtrl'
        })
        .when('/sensor/:sensorId/water_temp/daily', {
          templateUrl: url_view('/sensor_detail_water_temp_daily'),
          controller: 'WaterTempSensorDailyCtrl'
        })
        .when('/sensor/:sensorId/luminosity/daily', {
          templateUrl: url_view('/sensor_detail_luminosity_daily'),
          controller: 'LuminositySensorDailyCtrl'
        })
        .when('/sensor/:sensorId/ph/daily', {
          templateUrl: url_view('/sensor_detail_ph_daily'),
          controller: 'PHSensorDailyCtrl'
        })

        .when('/sensor/:sensorId/ext_temp/info', {
          templateUrl: url_view('/sensor_detail_ext_temp_info'),
          controller: 'ExtTempSensorInfoCtrl'
        })
        .when('/sensor/:sensorId/water_temp/info', {
          templateUrl: url_view('/sensor_detail_water_temp_info'),
          controller: 'WaterTempSensorInfoCtrl'
        })
        .when('/sensor/:sensorId/luminosity/info', {
          templateUrl: url_view('/sensor_detail_luminosity_info'),
          controller: 'DetailLuminositySensorInfoCtrl'
        })
        .when('/sensor/:sensorId/ph/info', {
          templateUrl: url_view('/sensor_detail_ph_info'),
          controller: 'PHSensorInfoCtrl'
        });

    }
  ]);

}).call(this, jQuery, angular, _);
