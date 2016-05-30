
module.exports = {
    
    getLast: function (sensor, idx, callback) {
        var query = "SELECT * FROM periodicmeasurement "             +
                    "WHERE sensor = " + sensor + " AND variable = '" + idx + "' "  +
                    "ORDER BY createdAt DESC "                                   +               
                    "LIMIT 0, 1";
        
        PeriodicMeasurement.query(query, function (err, records) {
            if (err) console.log(err);
            
            return callback(records ? records[0] : null);    
        });
    }
        
}