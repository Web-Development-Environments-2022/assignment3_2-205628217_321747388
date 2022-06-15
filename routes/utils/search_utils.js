const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

async function searchForRecipes(search_params){
    console.log("in search for recipes");
    const response = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: search_params.query,
            cuisine: search_params.cuisine,
            diet: search_params.diet,
            intolerances: search_params.intolerances,
            instructionsRequired: search_params.instructionsRequired,
            number: search_params.number,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

exports.searchForRecipes = searchForRecipes;