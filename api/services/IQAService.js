var async = require('async');

// Pesos para equação do percentual de oxigênio dissolvido
var  O2_WEIGHT_A = 100.8;
var  O2_WEIGHT_B = -106;
var  O2_WEIGHT_C = -3745;

// Pesos para equação dos conliformes fecais
var  CF_WEIGHT_A = 98.03;
var  CF_WEIGHT_B = -36.45;
var  CF_WEIGHT_C = 3.138;
var  CF_WEIGHT_D = 0.06776;

// Pesos para equação do pH
var  PH_WEIGHT_A = 0.05421;
var  PH_WEIGHT_B = 1.23;
var  PH_WEIGHT_C = -0.09873;

// Pesos para equação do DBO (Demanda Bioquímica de Oxigênio)
var  DBO_WEIGHT_A = 102.6;
var  DBO_WEIGHT_B = -0.1101;

// Pesos para equação do fósforo total
var  FT_WEIGHT_A = 213.7;
var  FT_WEIGHT_B = -1.680;
var  FT_WEIGHT_C = 0.3325;

// Pesos para equação do nitrogênio total
var  NT_WEIGHT_A = 98.96;
var  NT_WEIGHT_B = -0.2232;
var  NT_WEIGHT_C = -0.006457;

// Pesos para equação da turbidez
var  TU_WEIGHT_A = 97.34;
var  TU_WEIGHT_B = -0.01139;
var  TU_WEIGHT_C = -0.04917;

// Pesos para equação da variação de temperatura
var  DT_WEIGHT_A = 0.0003869;
var  DT_WEIGHT_B = 0.1815;
var  DT_WEIGHT_C = 0.01081;

// Pesos para equação da sólidos totais
var  ST_WEIGHT_A = 80.26;
var  ST_WEIGHT_B = -0.00107;
var  ST_WEIGHT_C = 0.03009;
var  ST_WEIGHT_D = -0.1185;

// Pesos de cada parâmetro na equação IQA
var IQA_O2_WEIGHT  = 0.17;
var IQA_CF_WEIGHT  = 0.15;
var IQA_PH_WEIGHT  = 0.12;
var IQA_DBO_WEIGHT = 0.10;
var IQA_DT_WEIGHT  = 0.10;
var IQA_NT_WEIGHT  = 0.10;
var IQA_FT_WEIGHT  = 0.10;
var IQA_TU_WEIGHT  = 0.08;
var IQA_ST_WEIGHT  = 0.08;

module.exports = {
    
    qPH: function (value, callback) {
        if (value > 12) return callback(3.0);
        if (value < 2) return callback(2.0);
        
        var e = PH_WEIGHT_B * value + PH_WEIGHT_C * Math.pow(value, 2);
        
        return callback(PH_WEIGHT_A * Math.pow(value, e) + 5.213);
    },
    
    qDT: function (value, callback) {
        if (value > 15) return callback(0);
        
        return callback(1 / (DT_WEIGHT_A * Math.pow(value + DT_WEIGHT_B, 2)) + DT_WEIGHT_C);
    },
    
    qCF: function (value, callback) {
       if (value > 100000) return callback(3.0);
        
       var l10 = Math.log(value) / Math.LN10;
        
       var b = CF_WEIGHT_B * l10;
       var c = CF_WEIGHT_C * Math.pow(l10, 2);
       var d = CF_WEIGHT_D * Math.pow(l10, 3);
       
       return callback(CF_WEIGHT_A + b + c + d);
    },
    
    qO2: function (value, callback) {
        if (value == 140) return callback(47);
        
        var p = Math.pow(value + O2_WEIGHT_B, 2);
        
        return callback(O2_WEIGHT_A * Math.exp(p / O2_WEIGHT_C));
    },
    
    qDBO: function (value, callback) {
        if (value > 30) return callback(2.0);
        
        return callback(DBO_WEIGHT_A * Math.exp(DBO_WEIGHT_B * value));
    },
    
    qNT: function (value, callback) {
        if (value > 100) return callback(1.0);
    
        return callback(NT_WEIGHT_A * Math.pow(value, NT_WEIGHT_B + NT_WEIGHT_C * value));
    },
    
    qFT: function (value, callback) {
        if (value > 10) return callback(1.0);
        
        var e = FT_WEIGHT_B * Math.pow(value, FT_WEIGHT_C);
        
        return callback(NT_WEIGHT_A * Math.exp(e));
    },
    
    qST: function (value, callback) {
        if (value > 500) callback(32);
        
        var e = ST_WEIGHT_B * value + ST_WEIGHT_C * Math.sqrt(value);
        
        return callback(ST_WEIGHT_A * Math.exp(e) + ST_WEIGHT_D * value);
    },
    
    qTU: function (value, callback) {
        if (value > 100) return callback(5.0);
        
        var e = TU_WEIGHT_B * value + TU_WEIGHT_C * Math.sqrt(value);
        
        return callback(TU_WEIGHT_A * Math.exp(e));
    },
    
    IQA: function (bag, callback) {
        
        if (
            bag.o2_iqa  && bag.cf_iqa  && bag.ph_iqa  &&
            bag.dbo_iqa && bag.dt_iqa  && bag.nt_iqa  &&
            bag.ft_iqa  && bag.tu_iqa  && bag.st_iqa
        ) {
            return callback(
                Math.pow(bag.o2_iqa, IQA_O2_WEIGHT)     *
                Math.pow(bag.cf_iqa, IQA_CF_WEIGHT)     *
                Math.pow(bag.ph_iqa, IQA_PH_WEIGHT)     *
                Math.pow(bag.dbo_iqa, IQA_DBO_WEIGHT)   *
                Math.pow(bag.dt_iqa, IQA_DT_WEIGHT)     *
                Math.pow(bag.nt_iqa, IQA_NT_WEIGHT)     *
                Math.pow(bag.ft_iqa, IQA_FT_WEIGHT)     *
                Math.pow(bag.tu_iqa, IQA_TU_WEIGHT)     *
                Math.pow(bag.st_iqa, IQA_ST_WEIGHT)
            );
        }
        
        return callback(false);
    },
    
    calcIQA: function (bag, callback) {
        var result = {};
        
        result.DATA = bag.DATA;
        
        if (bag.water_temp) {
            this.qDT(25 - bag.water_temp, function (res) {
                result.dt_val = bag.water_temp;
                result.dt_iqa = res;
            });
        }
        
        if (bag.ph) {
            this.qPH(bag.ph, function (res) {
                result.ph_val = bag.ph;
                result.ph_iqa = res;
            });
        }
        
        if (bag.dissolved_o2) {
            this.qO2(bag.dissolved_o2, function (res) {
                result.o2_val = bag.dissolved_o2;
                result.o2_iqa = res;
            });
        }
        
        if (bag.dbo) {
            this.qDBO(bag.dbo, function (res) {
                result.dbo_val = bag.dbo;
                result.dbo_iqa = res;
            });
        }
        
        if (bag.total_phosphorus) {
            this.qFT(bag.total_phosphorus, function (res) {
                result.ft_val = bag.total_phosphorus;
                result.ft_iqa = res;
            });
        }
        
        if (bag.fecal_matter) {
            this.qCF(bag.fecal_matter, function (res) {
                result.cf_val = bag.fecal_matter;
                result.cf_iqa = res;
            });
        }
        
        if (bag.total_nitrogen) {
            this.qNT(bag.total_nitrogen, function (res) {
                result.nt_val = bag.total_nitrogen;
                result.nt_iqa = res;
            });
        }
        
        if (bag.turbidity) {
            this.qTU(bag.turbidity, function (res) {
                result.tu_val = bag.turbidity;
                result.tu_iqa = res;
            });
        }
        
        if (bag.total_solids) {
            this.qST(bag.total_solids, function (res) {
                result.st_val = bag.total_solids;
                result.st_iqa = res;
            });
        }
        
        this.IQA(result, function (iqa) {
            result.IQA = iqa;
        });
        
        return callback(result);
    }
    
};