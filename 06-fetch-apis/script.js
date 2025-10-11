const mealNameElem = document.getElementById('meal-name');
const mealImageElem = document.getElementById('meal-image');
const ingredientsListElem = document.getElementById('ingredients-list');
const activityTextElem = document.getElementById('activity-text');
const generateBtn = document.getElementById('generate-btn');

function getRandomMeal() {
    return fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            return meal;
        });
}

function getRandomActivity() {
    return fetch('https://api.adviceslip.com/advice')
        .then(response => response.json())
        .then(data => data.slip.advice);
}


function displayMeal(meal) {
    mealNameElem.textContent = meal.strMeal;
    if (meal.strMealThumb) {
        mealImageElem.src = meal.strMealThumb;
        mealImageElem.style.display = 'block';
    } else {
        mealImageElem.style.display = 'none';
    }

    ingredientsListElem.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = `${measure} ${ingredient}`;
            ingredientsListElem.appendChild(li);
        }
    }
}

function displayActivity(activity) {
    activityTextElem.textContent = activity;
}

function generateDateIdea() {
    Promise.all([getRandomMeal(), getRandomActivity()])
        .then(([meal, activity]) => {
            displayMeal(meal);
            displayActivity(activity);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

generateBtn.addEventListener('click', () => {
    generateDateIdea();
});

generateDateIdea();
