var express = require('express');
var router = express.Router();

/*GET drink recipe*/
router.get('/find/:name', function (req,res){
    var db = req.db;
    var drinkName = req.params.name;
    db.collection('recipes').findOne({name: drinkName}, function (err, result) {
    	res.send(result);
    });
});

/*GET array of colors*/
router.get('/getColors', function (req,res){
    var db = req.db;
    db.collection('colors').find().toArray(function(err, items) {
    	res.json(items);
    });
});

/*GET array of drinks*/
router.get('/getDrinkNames', function (req,res){
    var db = req.db;
    db.collection('recipes').find({},{_id: 0, ingredients: 0, directions: 0, garnish: 0}).toArray(function(err, items) {
    	res.json(items);
    });
});

module.exports = router;