var express = require('express');
var router = express.Router();

router.get('/find/:name', function (req,res){
    var db = req.db;
    var drinkName = req.params.name;
        res.render('drink', {name: drinkName});
});

router.get('/find/details/:name', function (req,res){
    var db = req.db;
    db.collection('recipes').findOne({name: req.params.name}, function (err, result) {
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

router.get('/getIngredients', function (req,res) {
    var db = req.db;
    db.collection('colors').find({},{_id: 0,color: 0}).toArray(function (err, items) {
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

router.get('/getDrinksByIngredients/:ingredients', function(req, res){
    var ingredientArray = req.params.ingredients.split(",");
    var db = req.db;
    db.collection('recipes').find({"ingredients.name": {$in: ingredientArray }}).toArray(function(err, items){
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

    var tempJSONString = '{"name": "';
    tempJSONString += req.body.name;
    tempJSONString += '","ingredients": [';
    
    if (req.body.ingr1 != '') {
        tempJSONString += '{"name":"';
        tempJSONString += req.body.ingr1;
        tempJSONString += '", "amount": ';
        tempJSONString += req.body.ingr1part;
        if (req.body.ingr2 != '') {
            tempJSONString +='}, '
        } else {
            tempJSONString +='}'
        }
    }
    if (req.body.ingr2 != '') {
        tempJSONString += '{"name":"';
        tempJSONString += req.body.ingr2;
        tempJSONString += '", "amount": ';
        tempJSONString += req.body.ingr2part;
        if (req.body.ingr3 != '') {
            tempJSONString +='}, '
        } else {
            tempJSONString +='}'
        }
    }
    if (req.body.ingr3 != '') {
        tempJSONString += '{"name":"';
        tempJSONString += req.body.ingr3;
        tempJSONString += '", "amount": ';
        tempJSONString += req.body.ingr3part;
        if (req.body.ingr4 != '') {
            tempJSONString +='}, '
        } else {
            tempJSONString +='}'
        }
    }
    if (req.body.ingr4 != '') {
        tempJSONString += '{"name":"';
        tempJSONString += req.body.ingr4;
        tempJSONString += '", "amount": ';
        tempJSONString += req.body.ingr4part;
        if (req.body.ingr5 != '') {
            tempJSONString +='}, '
        } else {
            tempJSONString +='}'
        }
    }
    if (req.body.ingr5 != '') {
        tempJSONString += '{"name":"';
        tempJSONString += req.body.ingr5;
        tempJSONString += '", "amount": ';
        tempJSONString += req.body.ingr5part;
        tempJSONString +='}'
    }

    tempJSONString += '], "garnish": ["'

    if (req.body.garnish1 != ''){
        tempJSONString += req.body.garnish1;
        if (req.body.garnish2 != '') {
            tempJSONString += '", "'
        }
    }
    if (req.body.garnish2 != ''){
        tempJSONString += req.body.garnish2;
    }
    tempJSONString += '"], "directions": "';
    tempJSONString += req.body.directions;
    tempJSONString += '", "glass": "';
    tempJSONString += req.body.glass;
    tempJSONString += '", "upvotes": 0, "downvotes": 0}';
    console.log(tempJSONString)
    var JSONObj = JSON.parse(tempJSONString);

    console.log(JSONObj);

    db.collection('recipes').insert(JSONObj, function (err, doc) {
        if (err) {
            // If it failed, return error
            console.log(err)
            res.send("Posting to DB failed");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("../../drinks/list");
            // And forward to success page
            res.redirect("../../drinks/list");
        }
    });

})

module.exports = router;