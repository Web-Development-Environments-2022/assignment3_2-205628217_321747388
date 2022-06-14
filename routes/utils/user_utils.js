const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favorites values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favorites where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsViewed(user_id, recipe_id){
    await DButils.execQuery(`insert into viewed values ('${user_id}',${recipe_id})`);
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
