var express = require('express');
var router = express.Router();

router.get('/find/:name', function (req,res){
    var db = req.db;
    var drinkName = req.params.name;
        res.render('drink', {name: drinkName});
});

router.get('/find/details/:name', function (req,res){
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
    db.collection('recipes').find({},{_id: 0, ingredients: 0, directions: 0, garnish: 0}).sort({name: 1}).toArray(function(err, items) {
    	res.json(items);
    });
});

/*GET array of drinks*/
router.get('/list', function (req,res){
    var db = req.db;
    res.render('drinklist');
});

/*GET add drink page*/
router.get('/add', function (req, res) {
    res.render('adddrink');
});

/*POST add new drink*/
router.post('/add', function (req, res) {
    var db = req.db;

    var jsonstring = '{"name": "';

    jsonstring += req.body.name;
    jsonstring += '","ingredients": {"';
    jsonstring += req.body.ingr1;
    jsonstring += '" : ';
    jsonstring += req.body.ingr1part;
    jsonstring += '},"garnish" : [], "directions" : "shake and strain","upvotes":0,"downvotes":0}'

    db.collection('recipes').insert(jsonstring, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("drinks/list");
            // And forward to success page
            res.redirect("drinks/list");
        }
    })

})

module.exports = router;