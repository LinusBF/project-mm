'use strict';

const axios = require('axios');

const getRecipes = (params) => {
    return new Promise((resolve, reject) => {
        const ingredientParams = params.data.ingredients.join(',');
        const API_QUERY = "https://api.edamam.com/search?" +
                          "q=" + ingredientParams +
                          "&app_id=" + params.API_ID +
                          "&app_key=" + params.API_KEY +
                          "&from=0&to=5";

        axios.get(API_QUERY)
            .then(response => {
                const recipeList = extractList(response.data.hits);
                resolve({
                    headers: {"Content-Type": "application/json"},
                    status: 200,
                    body: JSON.stringify({data: recipeList})
                })
            })
            .catch(error => {
                reject(error);
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
    });
    return responseList;
};

exports.getRecipes = getRecipes;

