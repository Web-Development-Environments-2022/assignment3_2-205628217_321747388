const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favorites values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favorites where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsViewed(user_id, recipe_id){
    let v = [];
    v = await DButils.execQuery(`SELECT * FROM viewed WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`);
    if (v.length == 0){
        await DButils.execQuery(`insert into viewed values ('${user_id}','${recipe_id}', NOW())`);
    } else {
        await DButils.execQuery(`UPDATE viewed SET last_watched = NOW() WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`);
    }
}

async function getViewedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM viewed WHERE user_id='${user_id}' ORDER BY last_watched DESC limit 3`);
    return recipes_id;
}

async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select id from recipes where user_id='${user_id}'`);
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getViewedRecipes = getViewedRecipes;
exports.getMyRecipes = getMyRecipes;
