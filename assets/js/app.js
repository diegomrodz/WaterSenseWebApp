(function ($, angular, _) {
  var WaterSenseApplication = angular.module('WaterSenseApplication', ['ngRoute', 'angular-chartist', 'amChartsDirective', 'ngMap']);
  var APP_URL = $("meta[name=app_url]").attr('content');

  function url_view(path) {
    return  APP_URL + '/view' + path;
  }

  function url_api(path) {
    return APP_URL + path;
  }

  function digestDate(dateString) {
    var day = dateString.slice(0, 2);
    var month = dateString.slice(3, 5);
    var year = dateString.slice(6, 10);
    var hour = dateString.slice(11, 14);

    return new Date(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), 0, 0);
  }
  
  function digestDate2(dateString) {
    var day = dateString.slice(0, 2);
    var month = dateString.slice(3, 5);
    var year = dateString.slice(6, 10);

    return new Date(parseInt(year), parseInt(month), parseInt(day), 0, 0, 0);
  }

  function formatDate(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + " " + date.getHours() + "h";
  }

  function digestAvgValue(valueString) {
    return parseFloat(valueString, 10).toFixed(3);
  }
  
  function formatHour(date) {
    return date.getDate() + " " + date.getUTCHours() + "h";
  }
  
  function formatDateDaily(date) {
    var d = new Date(date);
    
    return d.getDate() + "/" + (d.getMonth() + 1);
  }

  function calcDailyAverage(records) {
    var s = _.groupBy(records, function (e) {
      var d = digestDate(e.DATA);
      
      return d.getMonth() + "/" + d.getDate();
    });
    
    return _.map(s, function (e, key) {
      var ext_temp = _.reduce(e, function (a, b) {
        return a + b.ext_temp;
      }, 0);
      
      var water_temp = _.reduce(e, function (a, b) {
        return a + b.water_temp;
      }, 0);
      
      var luminosity = _.reduce(e, function (a, b) {
        return a + b.luminosity;
      }, 0);
      
      var ph = _.reduce(e, function (a, b) {
        return a + b.ph;
      }, 0);
      
      return {
        DATA: key,
        ext_temp: ext_temp / e.length,
        water_temp: water_temp / e.length,
        luminosity: luminosity / e.length,
        ph: ph / e.length
      };
    });
  }

  WaterSenseApplication.service('IQA', [
    function () {
      var self = this;

      self.cetesbIndex = function (iqa) {
        if (iqa <= 19) {
          return "PÉSSIMA";
        }
        
        if (iqa <= 36) {
          return "RUIM";
        }
        
        if (iqa <= 50) {
          return "ACEITÁVEL";
        }
        
        if (iqa <= 79) {
          return "BOA";
        }
        
        return "ÓTIMA";
      };
      
      self.conamaIndex = function (iqa) {
        if (iqa <= 25) {
          return "PÉSSIMA";
        }
        
        if (iqa <= 50) {
          return "RUIM";
        }
        
        if (iqa <= 70) {
          return "ACEITÁVEL";
        }
        
        if (iqa <= 90) {
          return "BOA";
        }
        
        return "ÓTIMA";
      };
      
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

  WaterSenseApplication.service('PeriodicMeasurementRepository', [
    function () {
      var self = this;

      self.create = function (sensor, obj, callback) {
        $.ajax({
          url: url_api('/PeriodicMeasurement'),
          data: _.extend({sensor: sensor}, obj),
          type: 'post',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };
      
      self.last20 = function (sensor, variable, callback) {
        $.ajax({
          url: url_api("/PeriodicMeasurement/find"),
          data: {'sensor': sensor, 'limit': 20, 'variable': variable},
          type: 'post',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };
    }
  ]);
  
  WaterSenseApplication.service('IQARepository', [
    function () {
      var self = this;
      
      self.daily = function (sensor, limit, callback) {
        $.ajax({
          url: url_api("/IQA/daily"),
          data: {'sensor': sensor, 'limit': limit },
          type: 'get',
          dataType: 'json'
        }).done(function (data) {
          callback(data);
        });
      };
    }
  ]);
  
  WaterSenseApplication.service('SubscriberRepository', [
    function () {
      var self = this;
      
      self.create = function (sensor, subscriber, callback) {
        $.ajax({
          url: url_api("/EmailSubscription"),
          data: _.extend({ sensor: sensor }, subscriber),
          method: 'post',
          dataType: 'json'
        }).done(function (data) {
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
          url: url_api("/SensorSignal/today"),
          data: {'sensor': sensor},
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

        $scope.formatDescription = function (text) {
          if (text.length <= 123) return text;
          
          return text.slice(0, 120) + "...";
        };

        SensorRepository.all(function (data) {
          $scope.$apply(function () {
            $scope.sensorList = data;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('ExtTempSensorControlCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.dailyExtTempDataset = [];
        $scope.weeklyExtTempDataset = [];
        $scope.monthlyExtTempDataset = [];
        
        $scope.dailyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.dailyExtTempDataset, function (e) {
            return {
              date: new Date(e.createdAt),
              ext_temp: e.ext_temp
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.weeklyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.orderBy(
            _.map($scope.weeklyExtTempDataset, function (e) {
              return {
                date: new Date(e.DATA),
                ext_temp: parseFloat(e.ext_temp).toFixed(4)
              };
            }), function (e) {
              return e.date;
            })
         );
          
          return deferred.promise;
        };
        
        $scope.monthlyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.monthlyExtTempDataset, function (e) {
            return {
              date: new Date(e.DATA),
              ext_temp: parseFloat(e.ext_temp).toFixed(4)
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.dailyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.dailyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 5,
                "title": "Temperatura Ambiente",
                "valueField": "ext_temp",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);
        
        $scope.weeklyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.weeklyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "Temperatura Ambiente",
                "valueField": "ext_temp",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "hh",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        $scope.monthlyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.monthlyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "Temperatura Ambiente",
                "valueField": "ext_temp",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.today(s.id, function (records) {
              $scope.$apply(function () {
                $scope.dailyExtTempDataset = records;
              });
            });
            
            SensorSignalRepository.hourly_avg(s.id, 7 * 24, function (records) {
              $scope.$apply(function () {
                $scope.weeklyExtTempDataset = records;
              });
            });
            
            SensorSignalRepository.daily_avg(s.id, 30 * 12, function (records) {
              $scope.$apply(function () {
                $scope.monthlyExtTempDataset = records;
              });
            });
            
            
          });
        });
      }
    ]);

  WaterSenseApplication.controller('WaterTempSensorControlCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.dailyWaterTempDataset = [];
        $scope.weeklyWaterTempDataset = [];
        $scope.monthlyWaterTempDataset = [];
        
        $scope.dailyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.dailyWaterTempDataset, function (e) {
            return {
              date: new Date(e.createdAt),
              water_temp: e.water_temp
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.weeklyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.orderBy(
            _.map($scope.weeklyWaterTempDataset, function (e) {
              return {
                date: new Date(e.DATA),
                water_temp: parseFloat(e.water_temp).toFixed(4)
              };
            }), function (e) {
              return e.date;
            })
         );
          
          return deferred.promise;
        };
        
        $scope.monthlyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.monthlyWaterTempDataset, function (e) {
            return {
              date: new Date(e.DATA),
              water_temp: parseFloat(e.water_temp).toFixed(4)
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.dailyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.dailyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 5,
                "title": "Temperatura da Água",
                "valueField": "water_temp",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);
        
        $scope.weeklyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.weeklyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "Temperatura da Água",
                "valueField": "water_temp",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        $scope.monthlyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.monthlyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "Temperatura da Água",
                "valueField": "water_temp",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.today(s.id, function (records) {
              $scope.$apply(function () {
                $scope.dailyWaterTempDataset = records;
              });
            });
            
            SensorSignalRepository.hourly_avg(s.id, 7 * 24, function (records) {
              $scope.$apply(function () {
                $scope.weeklyWaterTempDataset = records;
              });
            });
            
            SensorSignalRepository.daily_avg(s.id, 30 * 12, function (records) {
              $scope.$apply(function () {
                $scope.monthlyWaterTempDataset = records;
              });
            });
            
            
          });
        });
      }
    ]);

  WaterSenseApplication.controller('LuminositySensorControlCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
        function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.dailyLuminosityDataset = [];
        $scope.weeklyLuminosityDataset = [];
        $scope.monthlyLuminosityDataset = [];
        
        $scope.dailyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.dailyLuminosityDataset, function (e) {
            return {
              date: new Date(e.createdAt),
              luminosity: e.luminosity
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.weeklyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.orderBy(
            _.map($scope.weeklyLuminosityDataset, function (e) {
              return {
                date: new Date(e.DATA),
                luminosity: parseFloat(e.luminosity).toFixed(4)
              };
            }), function (e) {
              return e.date;
            })
         );
          
          return deferred.promise;
        };
        
        $scope.monthlyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.monthlyLuminosityDataset, function (e) {
            return {
              date: new Date(e.DATA),
              luminosity: parseFloat(e.luminosity).toFixed(4)
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.dailyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.dailyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 5,
                "title": "Luminosidade",
                "valueField": "luminosity",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);
        
        $scope.weeklyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.weeklyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "Luminosidade",
                "valueField": "luminosity",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        $scope.monthlyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.monthlyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "Luminosidade",
                "valueField": "luminosity",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.today(s.id, function (records) {
              $scope.$apply(function () {
                $scope.dailyLuminosityDataset = records;
              });
            });
            
            SensorSignalRepository.hourly_avg(s.id, 7 * 24, function (records) {
              $scope.$apply(function () {
                $scope.weeklyLuminosityDataset = records;
              });
            });
            
            SensorSignalRepository.daily_avg(s.id, 30 * 12, function (records) {
              $scope.$apply(function () {
                $scope.monthlyLuminosityDataset = records;
              });
            });
            
            
          });
        });
      }
  ]);

  WaterSenseApplication.controller('PHSensorControlCtrl',
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'SensorSignalRepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, SensorSignalRepository) {
        $scope.sensor = {};

        $scope.dailyPHDataset = [];
        $scope.weeklyPHDataset = [];
        $scope.monthlyPHDataset = [];
        
        $scope.dailyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.dailyPHDataset, function (e) {
            return {
              date: new Date(e.createdAt),
              ph: e.ph
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.weeklyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.orderBy(
            _.map($scope.weeklyPHDataset, function (e) {
              return {
                date: new Date(e.DATA),
                ph: parseFloat(e.ph).toFixed(4)
              };
            }), function (e) {
              return e.date;
            })
         );
          
          return deferred.promise;
        };
        
        $scope.monthlyDataFromPromise = function(){
          var deferred = $q.defer();

          deferred.resolve(_.map($scope.monthlyPHDataset, function (e) {
            return {
              date: new Date(e.DATA),
              ph: parseFloat(e.ph).toFixed(4)
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.dailyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.dailyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left",
                "guides": [
                  {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite superior segundo Ministério da Saúde",
                    "lineAlpha": 1,
                    "value": 9.5
                },
                {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite superior segundo CONAMA",
                    "lineAlpha": 1,
                    "value": 9.0
                },
                {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite inferior segundo Ministério da Saúde",
                    "lineAlpha": 1,
                    "value": 6.0
                }]
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 5,
                "title": "PH",
                "valueField": "ph",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);
        
        $scope.weeklyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.weeklyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left",
                "guides": [
                  {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite superior segundo Ministério da Saúde",
                    "lineAlpha": 1,
                    "value": 9.5
                },
                {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite superior segundo CONAMA",
                    "lineAlpha": 1,
                    "value": 9.0
                },
                {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite inferior segundo Ministério da Saúde",
                    "lineAlpha": 1,
                    "value": 6.0
                }]
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "PH",
                "valueField": "ph",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "hh",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        $scope.monthlyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.monthlyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left",
                "guides": [
                  {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite superior segundo Ministério da Saúde",
                    "lineAlpha": 1,
                    "value": 9.5
                },
                {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite superior segundo CONAMA",
                    "lineAlpha": 1,
                    "value": 9.0
                },
                {
                    "dashLength": 6,
                    "inside": true,
                    "label": "Limite inferior segundo Ministério da Saúde",
                    "lineAlpha": 1,
                    "value": 6.0
                }]
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 50,
                "title": "PH",
                "valueField": "ph",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;

            SensorSignalRepository.today(s.id, function (records) {
              $scope.$apply(function () {
                $scope.dailyPHDataset = records;
              });
            });
            
            SensorSignalRepository.hourly_avg(s.id, 7 * 24, function (records) {
              $scope.$apply(function () {
                $scope.weeklyPHDataset = records;
              });
            });
            
            SensorSignalRepository.daily_avg(s.id, 30 * 12, function (records) {
              $scope.$apply(function () {
                $scope.monthlyPHDataset = records;
              });
            });
            
            
          });
        });
      }
    ]);
  
  WaterSenseApplication.controller('IQASensorControlCtrl', 
    ['$scope', '$routeParams', '$q', '$timeout', 'SensorRepository', 'IQARepository',
      function ($scope, $routeParams, $q, $timeout, SensorRepository, IQARepository) {
        $scope.sensor = {};
        
        $scope.monthlyIQADataset = [];
        $scope.annualyIQADataset = [];
        
        $scope.monthlyDataFromPromise = function () {
          var deferred = $q.defer();
          
          deferred.resolve(_.map($scope.monhtlyIQADataset, function (e) {
            return {
              date: new Date(e.DATA),
              iqa: e.IQA
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.annualyDataFromPromise = function () {
          var deferred = $q.defer();
          
          deferred.resolve(_.map($scope.annualyIQADataset, function (e) {
            return {
              date: new Date(e.DATA),
              iqa: e.IQA
            }
          }));
          
          return deferred.promise;
        };
        
        $scope.monthlyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.monthlyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 5,
                "title": "IQA",
                "valueField": "iqa",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);
        
        $scope.annualyChartOptions = $timeout(function () {
          return {
            "type": "serial",
            "theme": "light",
            "marginRight": 30,
            "autoMarginOffset": 20,
            "marginTop": 7,
            "data": $scope.annualyDataFromPromise(),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled": true,
            "graphs": [{
                "id": "g1",
                "fillAlphas": 0.4,
                "balloonText": "[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "hideBulletsCount": 5,
                "title": "IQA",
                "valueField": "iqa",
                "useLineColorForBulletBorder": true,
                "balloon":{
                    "drop":true
                }
            }],
            "chartCursor": {
              "limitToGraph":"g1"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
          };
        }, 3000);
        
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          
            IQARepository.daily(s.id, 30, function (iqas) {
              $scope.$apply(function () {
                $scope.monthlyIQADataset = iqas;
              });
            });
          });
        });
      }
    ]);

  WaterSenseApplication.controller('PeriodicNewSensorCtrl',
    ['$scope', '$routeParams', '$location', 'SensorRepository', 'PeriodicMeasurementRepository',
      function ($scope, $routeParams, $location, SensorRepository, PeriodicMeasurementRepository) {

        $scope.sendPeriodicMeasurement = function () {
          var bag = {};

          bag.p_name = $scope.userName;
          bag.p_email = $scope.userEmail;
          bag.variable = $scope.variable;
          bag.measurement = $scope.measurement;

          PeriodicMeasurementRepository.create($scope.sensor.id, bag, function () {
            $scope.$apply(function () {
              alert("Nova medição inserida com sucesso.");
              $location.path('/sensor/' + $scope.sensor.id);
            });
          });
        };

        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);
  
  WaterSenseApplication.controller('SubscriberNewSensorCtrl', 
    ['$scope', '$routeParams', 'SensorRepository', 'SubscriberRepository',
      function ($scope, $routeParams, SensorRepository, SubscriberRepository) {
        
        $scope.subscribeToSensor = function () {
          var bag = {};
          
          bag.email = $scope.p_email;
          bag.name = $scope.p_name;
          
          SubscriberRepository.create($routeParams.sensorId, bag, function (res) {
            alert("Você receberá as notificações deste sensor!");
            $location.path('/sensor/' + $routeParams.sensorId);
          });
        };
        
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('ReportWeekelySensorDetail', 
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        
        $scope.generateReport = function () {
          var bag = {};
          
          bag.institution = $scope.institution;
          bag.resp = $scope.resp;
          bag.obs = $scope.obs;
          
          
        };
        
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('ReportMonthlySensorDetail', 
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('ExtTempSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('WaterTempSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository', 'IQA',
      function ($scope, $routeParams, SensorRepository, IQA) {
       
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('DetailLuminositySensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('PHSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('DissolvedO2SensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('FecalMatterSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('DBOSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });  
        });
      }
    ]);

  WaterSenseApplication.controller('TotalNitrogenSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('PhosphorusTotalSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('TurbiditySensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('TotalSolidsSensorInfoCtrl',
    ['$scope', '$routeParams', 'SensorRepository',
      function ($scope, $routeParams, SensorRepository) {
        SensorRepository.find($routeParams.sensorId, function (s) {
          $scope.$apply(function () {
            $scope.sensor = s;
          });
        });
      }
    ]);

  WaterSenseApplication.controller('DetailSensorCtrl',
    ['$scope', '$routeParams', 'SensorRepository', 'SensorSignalRepository', 'PeriodicMeasurementRepository', 'IQARepository', 'IQA', 'NgMap',
      function ($scope, $routeParams, SensorRepository, SensorSignalRepository, PeriodicMeasurementRepository, IQARepository, IQA, NgMap) {
        $scope.sensor = {};

        $scope.chartOptions = {
          height: 270,
          chartPadding: 15
        };

        $scope.extTempDataset = {};
        $scope.waterTempDataset = {};
        $scope.luminosityDataset = {};
        $scope.phDataset = {};
        $scope.dissolvedO2Dataset = {};
        $scope.fecalMatterDataset = {};
        $scope.dboDataset = {};
        $scope.fecalMatterDataset = {};
        $scope.nitrogenTotalDataset = {};
        $scope.phosphorusTotalDataset = {};
        $scope.turbidityDataset = {};
        $scope.totalSolidsDataset = {};
        
        $scope.mapLat = 0;
        $scope.mapLng = 0;

        $scope.formatCreateDate = function (date) {
          var d = new Date(date);

          return d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
        };
        
        $scope.formatValue = function (value) {
          return value ? value.toFixed(3) : "";
        };
        
        $scope.getCetesbIndex = IQA.cetesbIndex;
        $scope.getConamaIndex = IQA.conamaIndex;
        
        SensorRepository.find($routeParams.sensorId, function (data) {
          $scope.$apply(function () {
            $scope.sensor = data;

            $scope.mapLat = data.setup_position.latitude;
            $scope.mapLng = data.setup_position.longitude;

            SensorSignalRepository.daily_avg($routeParams.sensorId, 20, function (data) {
              $scope.$apply(function () {
                
                $scope.daily_avg = _.last(data);

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

            if ($scope.sensor.dissolved_o2_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "dissolved_o2", function (data) {
                $scope.$apply(function () {
                  
                  $scope.dissolvedO2Dataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.dissolvedO2Dataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
                          
            }
            
            if ($scope.sensor.fecal_matter_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "fecal_matter", function (data) {
                $scope.$apply(function () {
                  
                  $scope.fecalMatterDataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.fecalMatterDataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
                          
            }
            
            if ($scope.sensor.dbo_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "dbo", function (data) {
                $scope.$apply(function () {
                  
                  $scope.dboDataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.dboDataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
                          
            }
            
            if ($scope.sensor.total_nitrogen_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "total_nitrogen", function (data) {
                $scope.$apply(function () {
                  
                  $scope.nitrogenTotalDataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.nitrogenTotalDataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
            
            }
            
            if ($scope.sensor.phosphorus_total_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "total_phosphorus", function (data) {
                $scope.$apply(function () {
                  
                  $scope.phosphorusTotalDataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.phosphorusTotalDataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
            
            }
            
            if ($scope.sensor.turbidity_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "turbidity", function (data) {
                $scope.$apply(function () {
                  
                  $scope.turbidityDataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.turbidityDataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
            
            }
            
            if ($scope.sensor.total_solids_active) {
            
              PeriodicMeasurementRepository.last20($routeParams.sensorId, "total_solids", function (data) {
                $scope.$apply(function () {
                  
                  $scope.totalSolidsDataset.labels = _.map(data, function (e, key) {
                    if (data.length <= 6) return formatDateDaily(e.createdAt);
                    if (key % 3 == 0) {
                      return formatDateDaily(e.createdAt);
                    }
                    return '';
                  });
                  
                  $scope.totalSolidsDataset.series = [
                    _.map(data, function (e) {
                      return e.measurement;
                    })
                  ];
                  
                });
              });
            
            }
            
            IQARepository.daily($routeParams.sensorId, 1, function (data) {
              $scope.$apply(function () {
                $scope.iqa_last = data[0];
                
                console.log($scope.iqa_last);
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

        .when('/sensor/:sensorId/periodic/new', {
          templateUrl: url_view('/sensor_detail_periodic_new'),
          controller: 'PeriodicNewSensorCtrl'
        })

        .when('/sensor/:sensorId/ext_temp/control', {
          templateUrl: url_view('/sensor_detail_ext_temp_control'),
          controller: 'ExtTempSensorControlCtrl'
        })
        .when('/sensor/:sensorId/water_temp/control', {
          templateUrl: url_view('/sensor_detail_water_temp_control'),
          controller: 'WaterTempSensorControlCtrl'
        })
        .when('/sensor/:sensorId/luminosity/control', {
          templateUrl: url_view('/sensor_detail_luminosity_control'),
          controller: 'LuminositySensorControlCtrl'
        })
        .when('/sensor/:sensorId/ph/control', {
          templateUrl: url_view('/sensor_detail_ph_control'),
          controller: 'PHSensorControlCtrl'
        })
        
        .when('/sensor/:sensorId/iqa/control', {
          templateUrl: url_view('/sensor_detail_iqa_control'),
          controller: 'IQASensorControlCtrl'
        })
        
        .when('/sensor/:sensorId/subscriber/new', {
          templateUrl: url_view('/sensor_subscriber_new'),
          controller: 'SubscriberNewSensorCtrl'
        })

        .when('/sensor/:sensorId/report/weekely', {
          templateUrl: url_view('/sensor_report_weekly'),
          controller: 'ReportWeekelySensorDetail'
        })
        .when('/sensor/:sensorId/report/monthly', {
          templateUrl: url_view('/sensor_report_monthly'),
          controller: 'ReportWeekelySensorDetail'
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
        })
        .when('/sensor/:sensorId/dissolved_o2/info', {
          templateUrl: url_view('/sensor_detail_dissolved_o2_info'),
          controller: 'DissolvedO2SensorInfoCtrl'
        })
        .when('/sensor/:sensorId/fecal_matter/info', {
          templateUrl: url_view('/sensor_detail_fecal_matter_info'),
          controller: 'FecalMatterSensorInfoCtrl'
        })
        .when('/sensor/:sensorId/dbo/info', {
          templateUrl: url_view('/sensor_detail_dbo_info'),
          controller: 'DBOSensorInfoCtrl'
        })
        .when('/sensor/:sensorId/total_nitrogen/info', {
          templateUrl: url_view('/sensor_detail_total_nitrogen_info'),
          controller: 'TotalNitrogenSensorInfoCtrl'
        })
        .when('/sensor/:sensorId/phosphorus_total/info', {
          templateUrl: url_view('/sensor_detail_phosphorus_info'),
          controller: 'PhosphorusTotalSensorInfoCtrl'
        })
        .when('/sensor/:sensorId/turbidity/info', {
          templateUrl: url_view('/sensor_detail_turbidity_info'),
          controller: 'TurbiditySensorInfoCtrl'
        })
        .when('/sensor/:sensorId/total_solids/info', {
          templateUrl: url_view('/sensor_detail_total_solids_info'),
          controller: 'TotalSolidsSensorInfoCtrl'
        });
    }
  ]);

}).call(this, jQuery, angular, _);
