const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    //console.log("in recipes utils random before await");
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRandomRecipes() {
    console.log("in recipes utils random before if");
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
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getMyRecipeDetails(recipe_id) {
    const recipe_info = await DButils.execQuery(`SELECT * FROM recipes WHERE id='${recipe_id}'`);
    //let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    console.log(recipe_info);
    return recipe_info[0];
    // return {
    //     id: recipe_info.id,
    //     title: recipe_info.title,
    //     readyInMinutes: recipe_info.readyInMinutes,
    //     image: recipe_info.image,
    //     popularity: recipe_info.aggregateLikes,
    //     vegan: recipe_info.vegan,
    //     vegetarian: recipe_info.vegetarian,
    //     glutenFree: recipe_info.glutenFree,
    // }
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
    //console.log(info_res);
    let info_res = await Promise.all(promises);
    return info_res;
    //let info_res = await Promise.all(promises);
    //return extractPreviewRecipeDetails(recipes_ids_list);
    // return recipes_info.map((recipe_info) => {
    //     //check the data type so it can work with diffrent types of data
    //     let data = recipe_info;
    //     if (recipe_info.data) {
    //         data = recipe_info.data;
    //     }
    //     const {
    //         id,
    //         title,
    //         readyInMinutes,
    //         image,
    //         aggregateLikes,
    //         vegan,
    //         vegetarian,
    //         glutenFree,
    //     } = data;
    //     return {
    //         id: id,
    //         title: title,
    //         image: image,
    //         readyInMinutes: readyInMinutes,
    //         popularity: aggregateLikes,
    //         vegan: vegan,
    //         vegetarian: vegetarian,
    //         glutenFree: glutenFree 
    //     }
    // })  
}

// async function getRandomThreeRecipes(){
//     console.log("in recipes utils random 3 before get random");
//     let random_pool = await getRandomRecipes();
//     console.log(random_pool);
//     let filterd_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image && random.title
//          && random.readyInMinutes && random.servings && random.extendedIngredients && random.servings && random.aggregateLikes
//          && random.vegan && random.vegetarian && random.glutenFree));
//     // let filterd_random_pool = [];
//     // for (let i = 0; i < random_pool.length; i++) {
//     //     filterd_random_pool.push(random_pool.data.recipes[i]);
//     //   }
//     console.log("in recipes utils random before if");
//     if(filterd_random_pool.length < 3){
//         return getRandomThreeRecipes();
//     }
//     console.log("in recipes utils random after if");
//     return extractPreviewRecipeDetails([filterd_random_pool[0],filterd_random_pool[1],filterd_random_pool[2]]);
// }  

async function getRandomThreeRecipes() {
    let random_pool = await getRandomRecipes();
    let filterd_randompool = random_pool.data.recipes.filter((random) => random.instructions != "") //&& (random.image && )
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
