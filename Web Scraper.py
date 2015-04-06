import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import pymongo
import ast
import re

client = MongoClient('mongodb://localhost:27017/')
db = client.ithirst
recipes = db.recipes
colors = db.colors

def cutit(s,n):
   return s[n:]

def populate():
	recipeString = '['
	colorString = '['

	for x in range(1,50):
		request = requests.get("http://www.barmeister.com/drinks/recipe/"+str(x)+"/")
		soup = BeautifulSoup(request.text)

		drinkName = soup.find('span', class_='title_text').text

		print('#'+str(x)+' ====== '+drinkName+' =======')

		if len(drinkName) > 17:
			recipeString += '{"name":"'
			recipeString += cutit(drinkName,17).lower().strip()
			recipeString += '","ingredients":['

			tables = soup.find_all('table')
			ingredientTable = tables[4]
			descTable = tables[3]
			rows = ingredientTable.findChildren(['tr'])
			rows2 = descTable.findChildren(['tr'])
			cells2 = rows2[0].findChildren('td')
			desc = cells2[0].findChildren('br')

			info = soup.find_all(text="Glass:")[0]
			glassType = info.find_next().text

			drink = soup.find_all(text="Category:")[0]
			drinkType = drink.find_next().text

			for row in rows:
				cells = row.findChildren('td')
				recipeString += '{"name":"'
				recipeString += str(cells[1].text).lower().strip()

				colorString += '{"name":"'
				colorString += str(cells[1].text).lower().strip()
				colorString += '","color":"#123456"},'

				recipeString += '","amount":"'

				amountString = str(cells[0].text).lower().strip()
				if amountString.endswith('(s)'):
					amountString = amountString[:-3]
				if amountString.endswith('(es)'):
					amountString = amountString[:-4]

				amountMatch = re.match('(\d+[\/\d. ]*|\d)', amountString)
				if amountMatch:
					curAmount = amountMatch.group(0).strip()
					curMeasure = amountString[len(curAmount):].strip()
				else:
					curAmount = amountString.strip()
					curMeasure = ''

				recipeString += curAmount
				recipeString += '","measure":"'
				recipeString += re.sub("[^a-zA-Z]","", curMeasure)
				recipeString += '"},'

			recipeString += '],"directions":"'
			recipeString += desc[0].text.strip()
			recipeString += '","glass":"'
			recipeString += glassType.lower().strip()
			recipeString += '","type":"'
			recipeString += drinkType.lower().strip()
			recipeString += '","upvotes":0,"downvotes":0},'

	recipeString += ']'
	colorString += ']'

	recipeJsonObject = ast.literal_eval(recipeString)
	colorJsonObject = ast.literal_eval(colorString)
	print('Completed scan')

	try:
		recipes.insert(recipeJsonObject,continue_on_error=True)
	except pymongo.errors.DuplicateKeyError:
		pass
	try:
		colors.insert(colorJsonObject,continue_on_error=True)
	except pymongo.errors.DuplicateKeyError:
		pass
	print('Added to DB')


populate()
