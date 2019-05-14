/* global Module */

/* Magic Mirror
 * Module: PG8Recipes
 *
 * By ProjektGrupp8
 * MIT Licensed.
 */
Module.register("pg8-recipes", {
    stateActive: false,
    recipeIndex: 0,
    instructionIndex: 0,
    currentRecipes: [],
    dummySteps: [],

    start: function() {
        console.log("Starting module " + this.name);
        this.dummySteps = ['Season beef with a pinch of salt and black pepper. Heat vegetable oil in a heavy pot over high heat. Cook and stir beef in hot oil until browned, 5 to 8 minutes.', 'Stir garlic, vinegar, oregano, 1 1/2 teaspoons salt, thyme, rosemary, 1 teaspoon black pepper, bay leaf, and red pepper flakes into beef. Pour enough chicken broth into beef mixture to cover the meat by 1 inch and bring to a simmer.', 'Cover pot with a lid, reduce heat to low, and simmer until meat is fork-tender, 1 to 1 1/2 hours.', 'Transfer meat with a strainer or slotted spoon to a separate pot; pour about 1/4 cup of meat broth into pot. Use a wooden spoon to gently break meat into smaller chunks. Cover pot with a lid or aluminum foil and keep warm.', 'Skim excess grease from top of broth remaining in the first pot; season with salt and pepper to taste. Cover pot with a lid or aluminum foil and keep broth warm.' ];
        this.stateActive = false;
    },

    getStyles: function () {
        return ["recipes.css"];
    },

    getDom: function () {
        if(!this.stateActive || this.currentRecipes.length < 1) return "";
        const recipeData = this.currentRecipes[this.recipeIndex];
        if(recipeData.length < 1) return `<div>Couldn't find any recipes with those ingredients, sorry!</div>`;
        return this.generateHtml(recipeData);
    },

    generateHtml: function (recipeData) {
        const ingredients = [];
        const ingredientsToShow = recipeData.ingredients.slice(0, 10);
        ingredients.push(`<ul>`);
        ingredientsToShow.map(e => {ingredients.push(`<li>${e}</li>`)});
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
    },

    dummystepsHtml: function (){
        const wrapper = document.createElement('div');
        wrapper.className = 'instructions';
        const instructions = [];
        instructions.push(`<ol>`);

        // Always show 3 items or less. Starting at "Instruction index"
        const numOfItemsLeft = this.dummySteps.length - this.instructionIndex;
        const numToShow = (numOfItemsLeft < 3 ? numOfItemsLeft : 3);
        for (let i = this.instructionIndex; i < (numToShow + this.instructionIndex); i++){
            instructions.push(`<li>${this.dummySteps[i]}</li>`);
        }
        instructions.push(`</ol>`);
        return instructions.join("");

    },

    changeActiveState: function(newState) {
        if(newState !== this.stateActive){
            this.stateActive = newState;
            this.notifyStateChange(newState);
        }
    },

    notifyStateChange: function(newState) {
        const message = (newState ? "RECIPE_OPENED" : "RECIPE_CLOSED");
        this.sendNotification(message);
    },

    changeRecipe: function(change){
        if(change === "NEXT"){
            this.recipeIndex === this.currentRecipes.length - 1 ? this.recipeIndex = 0 : this.recipeIndex++;
            this.instructionIndex = 0;
        } else if(change === "PREVIOUS"){
            this.recipeIndex === 0 ? this.recipeIndex = this.currentRecipes.length - 1 : this.recipeIndex--;
            this.instructionIndex = 0;
        }

    },

    changeInstruction: function(change){
        if(change === "NEXT"){
            this.instructionIndex === this.dummySteps.length - 1 ? this.instructionIndex = 0 : this.instructionIndex++;
        } else if(change === "PREVIOUS"){

            this.instructionIndex === 0 ? this.instructionIndex = this.dummySteps.length - 1 : this.instructionIndex--;
        }

    },

    notificationReceived: function (notification, payload) {
        if (notification === 'CLOUD_RESPONSE_SUCCESS' && payload.module === this.name) {
            const data = payload.data.message;
            if (data.action === 'RECIPE_SHOW'){
                this.currentRecipes = [];
                data.recipes.forEach(element => {this.currentRecipes.push(element)});
                this.changeActiveState(true);
                this.updateDom();

            } else if(data.action === 'INSTRUCTION_CHANGE'){
                this.changeInstruction(data.change);
                this.updateDom();

            } else if(data.action === 'RECIPE_CHANGE'){
                this.changeRecipe(data.change);
                this.updateDom();
            } else if (data.action === 'RECIPE_CLOSE'){
                this.changeActiveState(false);
                this.updateDom();
            }
        }
    }
});
