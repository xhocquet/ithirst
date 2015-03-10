var express = require('express');
var router = express.Router();

/*GET drink recipe*/
router.get('/findDrink/:name', function (req,res){
    var db = req.db;
    db.collection('recipes').find(req.params.name).toArray(function (err, items){
        res.json(items);
    });
});

module.exports = router;
