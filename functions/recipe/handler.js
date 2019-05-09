'use strict';

const axios = require('axios');
const rp = require('request-promise');
const cheerio = require('cheerio');


const scrapeRecipe = () => {
    return new Promise(((resolve, reject) => {
        getRecipeURL()
            .then(scrapeURL)
            .then(recipe => {
                resolve({
                    headers: {"Content-Type": "application/json"},
                    status: 200,
                    body: JSON.stringify({data: recipe})
                });

            })
            .catch(error => {
                reject({
                    headers: {"Content-Type": "application/json"},
                    status: 500,
                    body: JSON.stringify({data: error})
                });
            });
    }))
};

const getRecipeURL = () => {
    return new Promise((resolve, reject) => {

        axios.get('https://www.food2fork.com/api/search?key=8c4c0167f29a3056495f6d125a67eed4&q=pork')
            .then(response => {
                //console.log(response.data.recipes[0].f2f_url);
                resolve(response.data.recipes[0].f2f_url);
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
                const ingr = extractIngredients($);
                resolve({
                    title: title,
                    img: img,
                    ingr: ingr
                })
            })
            .catch(error => {
                reject(console.log(error));
            })
    }))
};

const extractTitle = ($) => {
    return $('.recipe-title').text();
}

const extractImage = ($) => {
    return $('.recipe-image').attr('src');
}

const extractIngredients = ($) => {
    const list = [];
    const ul = $('.about-container > ul').find('li')
        .each((index, element) => {
            list.push(cheerio(element).text());
        });
    return list;
}


scrapeRecipe().then(res => console.log(res));