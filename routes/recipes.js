var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns 3 random preview recipes
 */
 router.get("/random", async (req, res, next) => {
  try {
    let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    res. send(random_3_recipes);
  } catch (error) {
    next(error);
  }
}); 

/**
 * Serach for recipes by a search query.
 * Will return resuslts from spoonacular API, according to number param, which can be filtered by Cusine, diet, intolerance.
 * Result will be preview recipes.
 */
router.get("/search/query/:searchQuery/amount/:num", async (req, res, next) => {
  const {searchQuery, num} = req.params;
  // set search params
  search_params = {};
  search_params.query = searchQuery;
  search_params.number = num;
  search_params.instructionsRequired = true;
  search_params.apiKey = process.env.spooncular_apiKey; 

  //gives a defult num
  if (num != 5 && num != 10 && num != 15) {
    search_params.number = 5;
  }
  //check if query params exists (cuisine / diet / intolerances) and add them to search_params
  search_util.extractQueryParams(req.query, search_params);
  search_util.searchForRecipes(search_params)
  .then((recipes) => res.send(recipes))
  .catch((err) => {
    next(err);
  })
});

module.exports = router;
