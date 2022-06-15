const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

function extractQueryParams(query, search_params){

}

async function searchForRecipes(search_params){

    console.log("in search for recipes");
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

exports.extractQueryParams = extractQueryParams;
exports.searchForRecipes = searchForRecipes;