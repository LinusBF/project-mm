'use strict';

const axios = require('axios');
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');

function getURL() {
    axios.get('https://www.food2fork.com/api/search?key=8c4c0167f29a3056495f6d125a67eed4&q=pork')
        .then(response => {
            //console.log(response.data.recipes[0].f2f_url);
            const url = response.data.recipes[0].f2f_url;
            return url;
        })
        .catch(error => {
            console.log(error);
        });
}


async function getRecipe() {
    const url = 'http://food2fork.com/view/46946' //await getURL();
    const html = await rp(url);
    const title = cheerio('h1.recipe-title', html).text();
    console.log(title);
    return;
}

getRecipe();