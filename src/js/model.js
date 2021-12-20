import { async } from 'regenerator-runtime';

import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

const state = {
  recipe: {
    id: '',
    title: '',
    publisher: '',
    sourceUrl: '',
    image: '',
    servings: null,
    cookingTime: null,
    ingredients: [],
    bookmarked: false
  },
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1
  },
  bookmarks: []
};

const createRecipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    ...(recipe.source_url && { sourceUrl: recipe.source_url }),
    ...(recipe.servings && { servings: +recipe.servings }),
    ...(recipe.cooking_time && { cookingTime: +recipe.cooking_time }),
    ...(recipe.ingredients && { ingredients: recipe.ingredients }),
    ...(recipe.bookmarked && { bookmarked: recipe.bookmarked }),
    ...(recipe.key && { key: recipe.key })
  };
};

const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?${API_KEY}`);

    const { recipe } = data.data;

    state.recipe = createRecipeObject(recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(rec =>
      createRecipeObject(rec)
    );
  } catch (err) {
    throw err;
  }
};

const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // if page = 4, start = 30 and end = 40 (30 ~ 39)
  // if page = 1, start = 0 and end = 10 (0 ~ 9)

  return state.search.results.slice(start, end);
};

const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarks = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};

const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// add할 때와는 다르게 delete할 때는 id만 가지고 필터링 하는게 편하다
const deleteBookmark = function (id) {
  state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

//  첫 렌더링시 필요한 데이터를 가져와서 저장한다.
const init = function () {
  loadBookmarks();
};

init();

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  addBookmark,
  deleteBookmark,
  uploadRecipe
};
