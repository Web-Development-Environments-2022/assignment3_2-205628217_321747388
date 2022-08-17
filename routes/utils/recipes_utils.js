const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRandomRecipes() {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number : 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

function extractPreviewRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })  
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, vegan, vegetarian, glutenFree, extendedIngredients, analyzedInstructions, instructions, aggregateLikes } = recipe_info.data;
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        analyzedInstructions: analyzedInstructions,
        instructions: instructions,
        aggregateLikes: aggregateLikes
    }
}

async function getMyRecipeDetails(recipe_id) {
    const recipe_info = await DButils.execQuery(`SELECT * FROM recipes WHERE id='${recipe_id}'`);
    console.log(recipe_info);
    return recipe_info[0];
}

async function getRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    return extractPreviewRecipeDetails(info_res);
}

async function getMyRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getMyRecipeDetails(id));
    });
    let info_res = await Promise.all(promises);
    return info_res;
}

async function getRandomThreeRecipes() {
    let random_pool = await getRandomRecipes();
    let filterd_randompool = random_pool.data.recipes.filter((random) => random.instructions != "") 
    if (filterd_randompool.length < 3) {
        return getRandomThreeRecipes();
    }
    return extractPreviewRecipeDetails([filterd_randompool[0], filterd_randompool[1], filterd_randompool[2]]);
}   

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomThreeRecipes =getRandomThreeRecipes;
exports.getMyRecipeDetails = getMyRecipeDetails;
exports.getMyRecipesPreview = getMyRecipesPreview;
