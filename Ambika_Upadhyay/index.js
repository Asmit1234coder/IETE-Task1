const searchApiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
const randomApiUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;
const lookUpApiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`;

const searchBar = document.querySelector(`.searchBar`);
const searchInput = document.getElementById(`recipeName`);
const resultGrid = document.querySelector(`#resultGrid`);
const messageArea = document.querySelector(`.messageArea`);
const randomRecipeBtn = document.getElementById(`randomRecipeBtn`);
const recipeModal = document.getElementById(`recipeModal`); 
const modalContent = document.querySelector(`#recipeDetailsContent`);
const modalCloseBtn = document.getElementById(`modalCloseBtn`);


searchBar.addEventListener(`submit`, e =>{
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    console.log(`search term:` ,searchTerm);

    if (searchTerm){
        searchRecipes(searchTerm);
    } else{
        showMessage(`Please enter a search term!`, true);
    }
});

async function searchRecipes(query){
    showMessage(`Searching for "${query}"...`, false, true);
    resultGrid.innerHTML = '';

    try{ 
        const response = await fetch(`${searchApiUrl}${query}`);
        if(!response.ok) throw new Error(`Network Error!`);

        const data = await response.json();
        clearMessage();
        console.log(`data: `, data);

        if(data.meals){
            displayRecipe(data.meals);
        } else {
            showMessage(`No recipes found for "${query}"`);
        }
    }
    catch(error){
        showMessage(`Something went wrong. Please try again!`, true);
    }
}

function showMessage(message, isError = false, isLoading = false){
    messageArea.textContent = message;

    if(isError) messageArea.classList.add(`error`)
    if(isLoading) messageArea.classList.add(`loading`)   
}

function clearMessage(){
    messageArea.textContent = ``;
    messageArea.className = `messageArea`;
}

function displayRecipe(recipes){
    if(!recipes || recipes.length === 0){
        showMessage(`No recipes found!`);
        return;
    }

    recipes.forEach(recipe=>{
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.innerHTML = `
        <img src = "${recipe.strMealThumb}" alt="${recipe.strMeal}" loading = "lazy">
        <h3 class = "recipeTitle">${recipe.strMeal}</h3>
        `;

        resultGrid.appendChild(recipeDiv)
    })
}

randomRecipeBtn.addEventListener("click", getRandomRecipe);

async function getRandomRecipe(){
    showMessage(`Fetching a random recipe...`, false, true);
    resultGrid.innerHTML = '';

    try{
        const response = await fetch(randomApiUrl);
        if(!response.ok) throw new Error(`Something went wrong!`);
        const data = await response.json();

        clearMessage();

        if(data.meals && data.meals.length>0){
            displayRecipe(data.meals);
        } else {
            showMessage(`Could not fetch a random recipe. Please try again!`, true);
        }
    }
    catch(error){
        showMessage(`Could not fetch a random recipe. Please try again!`, true);
    }
}

function showModel(){
    recipeModal.classList.remove(`hidden`);
    document.body.style.overflow = `hidden`;
}

function closeModel(){
    recipeModal.classList.add(`hidden`);
    document.body.style.overflow = ``;
}

resultGrid.addEventListener(`click`, (e)=>{
    const card = e.target.closest(".recipe");

    if(card) {
        const recipeId = card.dataset.id;
        getRecipeDetails(recipeId);
    }
});

async function getRecipeDetails(id){
    modalContent.innerHTML = `<p class= "messageArea loading"> Loading details...</p>`;
    showModel();

    try {
        const response = await fetch(`${lookUpApiUrl}${id}`);
        if(!response.ok) throw new Error (`Failed to fetch recipe details`);
        const data = await response.json();
        
        if (data.meals && data.meals.length>0) {
            displayRecipeDetails(data.meals[0]);
        } else {
            modalContent.innerHTML = `<p class = "messageArea error"> Could not load recipe details.</p>`;
        }



    } catch(error) {
        modalContent.innerHTML = '<p class = "messageArea error"> Failed to load recipe details. Please try again!</p>';
    }
}

modalCloseBtn.addEventListener("click", closeModel);

recipeModal.addEventListener("click", e=> {
    if(e.target === recipeModal) {
        closeModel();
    }
});

function displayRecipeDetails(recipe){
    const ingredients = [];

    for (let i = 1; i<=20; i++){
        const ingredient = recipe[`strIngredients${i}`]?.trim();
        const measure = recipe[`strMeasure${i}`]?.trim();

        if(ingredient) {
           ingredients.push(`<li>${measure ? `${measure}` : ""}${ingredient}</li>`); 
        } else {
            break;
        }
    }

    const categoryHTML = recipe.strCategory ? `<h3>Category: ${recipe.strCategory}</h3>` : "";

    const areaHTML = recipe.strArea ? `<h3>Area: ${recipe.strArea}</h3>` : "";
    const ingredientsHTML = ingredients.length ? `<h3>Ingredients</h3><ul>${ingredients.join("")}</ul>` : "";
    const instructionsHTML = `<h3>Instructions</h3><p>${recipe.strInstructions ? recipe.strInstructions.replace(/\r?\n/g, "<br>") : "Instructions not available"}</p>`;

    const youtubeHTML = recipe.strYoutube ? `<h3>Video Recipe</h3><div class = "videoWrapper"><a href="${recipe.strYoutube}" target = "_blank">Watch on YouTube</a></div>` : "";

    const sourceHTML = recipe.strSource ? `<div class = "sourceWrapper"><a href="${recipe.strSource}" target="_blank">View Original Source</a></div>` : "";

    modalContent.innerHTML = `<h2>${recipe.strMeal}</h2>
    <img src = "${recipe.strMealThumb}" alt="${recipe.strMeal}">
    ${categoryHTML}
    ${areaHTML}
    ${ingredientsHTML}
    ${instructionsHTML}
    ${youtubeHTML}
    ${sourceHTML}    
    `;
}