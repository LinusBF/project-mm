'use strict';

//params.API_KEY;


const axios = require('axios');
const rp = require('request-promise');
const cheerio = require('cheerio');

const getRecipes = (params) => {
    return new Promise((resolve, reject) => {
        const ingredParams = params.ingredients.join[','];
        const API_QUERY = "https://api.edamam.com/search?q=" + ingredParams + "&app_id=" + API_ID + "&app_key=" + API_KEY + "&from=0&to=4";
        axios.get(API_QUERY)
            .then(response => {
                //console.log(response.data.hits[0]);
                const recipeList = extractList(response.data.hits);
                resolve(recipeList);
            })
            .catch(error => {
                reject(error)
            })
    })

};

const extractList = (list) => {
    const responseList = [];
    list.forEach(hits => {
        responseList.push({
            title: hits.recipe.label,
            img: hits.recipe.image,
            ingredients: hits.recipe.ingredientLines
        })
    })
    console.log(responseList);
}


exports.getRecipes = getrecipes;

