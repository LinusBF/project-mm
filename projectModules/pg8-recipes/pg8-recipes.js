/* global Module */

/* Magic Mirror
 * Module: PG8Recipes
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */
Module.register("pg8-recipes", {
    stateActive: true,
    recipeIndex: 0,
    instructionIndex: 0,
    currentRecipes: [],

    getStyles: function () {
        return ["recipes.css"];
    },

    updateDom: function() {
        document.getElementById('container').appendChild(this.getDom());
    },

    getDom: function () {
        const recipeData = this.currentRecipes[this.recipeIndex];
        const html = this.generateHtml(recipeData);

        return html;
    },

    generateHtml: function (recipeData) {
        const ingredients = [];
        ingredients.push(`<ul>`);
        recipeData.ingredients.map(e => {ingredients.push(`<li>${e}</li>`)});
        ingredients.push(`</ul>`);
        const dummySteps = this.dummystepsHtml();

        const wrapper = document.createElement("div");
        wrapper.className = 'recipe-container';
        wrapper.innerHTML =
            `
            <div id="heading-ingredients">
                <div id="heading"><h4>${recipeData.title}</h4></div>
                <div id="ingredients">${ingredients.join("")}</div>
            </div>
            <div id="image-instructions">
                <div id="recipe-image" style="background-image: url(${recipeData.img});"></div>
                <div id="dummy-steps">${dummySteps}</div>
            </div>
            `;

        return wrapper;
    }
    ,
    dummystepsHtml: function (){
        const dummyArray = ['Season beef with a pinch of salt and black pepper. Heat vegetable oil in a heavy pot over high heat. Cook and stir beef in hot oil until browned, 5 to 8 minutes.', 'Stir garlic, vinegar, oregano, 1 1/2 teaspoons salt, thyme, rosemary, 1 teaspoon black pepper, bay leaf, and red pepper flakes into beef. Pour enough chicken broth into beef mixture to cover the meat by 1 inch and bring to a simmer.', 'Cover pot with a lid, reduce heat to low, and simmer until meat is fork-tender, 1 to 1 1/2 hours.', 'Transfer meat with a strainer or slotted spoon to a separate pot; pour about 1/4 cup of meat broth into pot. Use a wooden spoon to gently break meat into smaller chunks. Cover pot with a lid or aluminum foil and keep warm.', 'Skim excess grease from top of broth remaining in the first pot; season with salt and pepper to taste. Cover pot with a lid or aluminum foil and keep broth warm.' ];
        const wrapper = document.createElement('div');
        wrapper.className = 'instructions';
        const instructions = [];
        instructions.push(`<ol>`);

        // Always show 3 items or less. Starting at "Instruction index"
        const numOfItemsLeft = dummyArray.length-this.instructionIndex;
        const numToShow = (numOfItemsLeft < 3 ? numOfItemsLeft : 3);
        for (i = this.instructionIndex; i < numToShow; i++){
            instructions.push(`<li>${dummyArray[i]}</li>`);
        }
        instructions.push(`</ol>`);
        return instructions.join("");

    }
    ,

    notificationReceived: function (notification, payload) {
        if (notification === 'CLOUD_RESPONSE_SUCCESS' && payload.module === this.name) {
            if (payload.data.action === 'RECIPE_SHOW'){
                this.stateActive = true;
                payload.data.recipes.forEach(element => {this.currentRecipes.push(element)})
                this.updateDom();

            } else if(payload.data.action === 'INSTRUCTION_NEXT'){
                const root = document.querySelector('.recipe-container');
                root.parentNode.removeChild(root);
                this.instructionIndex++;
                this.updateDom();

            } else if(payload.data.action === 'RECIPE_NEXT'){
                const root = document.querySelector('.recipe-container');
                root.parentNode.removeChild(root);
                this.recipeIndex === 4 ? this.recipeIndex = 0 : this.recipeIndex++;
                this.instructionIndex = 0;
                this.updateDom();
            } else if (payload.data.action === 'RECIPE_CLOSE'){
                const root = document.querySelector('.recipe-container');
                root.parentNode.removeChild(root);

                this.stateActive = false;
            }
        }
    }
});
