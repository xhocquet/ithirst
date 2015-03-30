# iThirst
Get your drink fix using what you have in your liquor cabinet!

##Stack
Backend: <a href="https://nodejs.org/">NodeJS</a> <a href="http://expressjs.com/">ExpressJS</a>, <br />
Frontend : <a href="http://jade-lang.com/">Jade</a>, CSS, JS <br />
DB: <a href="https://www.mongodb.org/">MongoDB</a> + <a href="https://github.com/kissjs/node-mongoskin">Mongoskin</a> <br />

##Database Structure
db.recipes
```
{
	name		:	"Drink Name",
	ingredients : [
		{"name": "Ingredient One", "amount": numParts},
		{"name": "Ingredient Two", "amount": numParts},
		{"name": "Ingredient Two", "amount": numParts},
		...
	],
	granish		: ["Garnish One", "Garnish Two"],
	directions	: "Mix the drink and do stuff to it.",
	glass		: "glassType",
	type		: "drinkType",
	upvotes		: 0,
	downvotes	: 0
}
```
db.colors
```
{
	name	: "Ingredient One",
	color	: "#xxxxxx"
}
```
