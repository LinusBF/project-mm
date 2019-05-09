'use strict';

const axios = require('axios');
const rp = require('request-promise');
const cheerio = require('cheerio');


const scrapeRecipe = (ingredientList) => {
    return new Promise(((resolve, reject) => {
        getRecipeURLs(ingredientList)
            .then(urls => {
                const promiseList = [];
                urls.forEach(element => {
                    promiseList.push(scrapeURL(element));
                });
                Promise.all(promiseList)
                    .then(recipes => {
                        resolve({
                            headers: {"Content-Type": "application/json"},
                            status: 200,
                            body: JSON.stringify({data: recipes})
                        })
                    }).catch(error => {
                        console.log(error);
                })

            })
    }))
};

const getRecipeURLs = (ingredientList) => {
    return new Promise((resolve, reject) => {
        const ingredientsUrl = ingredientList.join(',');
        axios.get(`https://www.food2fork.com/api/search?key=8c4c0167f29a3056495f6d125a67eed4&q=${ingredientsUrl}&page=5`)
            .then(response => {
                const recipeURLs = [];
                response.data.recipes.forEach(element => {
                    recipeURLs.push(element.f2f_url)
                });
                resolve(recipeURLs);
            })
            .catch(error => {
                reject(console.log(error));
            });
    })
};

const scrapeURL = (url) => {
    return new Promise(((resolve, reject) => {
        rp(url)
            .then(html => {
                const $ = cheerio.load(html);
                const title = extractTitle($);
                const img = extractImage($);
                const ingredients = extractIngredients($);
                resolve({
                    title: title,
                    img: img,
                    ingredients: ingredients
                })
            })
            .catch(error => {
                reject(console.log(error));
            })
    }))
};

const extractTitle = ($) => {
    return $('.recipe-title').text();
};

const extractImage = ($) => {
    return $('.recipe-image').attr('src');
};

const extractIngredients = ($) => {
    const list = [];
    $('.about-container > ul').find('li')
        .each((index, element) => {
            list.push(cheerio(element).text());
        });
    return list;
};

const ingredientList = ['veal'];
scrapeRecipe(ingredientList).then(res => console.log(res));