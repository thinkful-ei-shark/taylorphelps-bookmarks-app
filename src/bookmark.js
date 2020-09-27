/* *****HTML Generation Functions and Event Listeners***** */

// Imports
import $ from 'jquery';
import api from './api';
import store from './store';

// Generation Functions


/* 'x' is set as a variable and if the bookmark element expanded attribute is equal to false it will set 'x' to a string of 'hidden'.
  if not, it will set 'x' to 'shown'. 'x' is then passed into a template literal to set as a class for each element we want to expand and close.
  The 'hidden' class is set to 'display: none' in the CSS. A template literal is returned generating the html for the what the bookmark element
  will look like and contain.  */
const initialTemplate = bmark => {
  let x;

  if (bmark.expanded === false) {
    x = 'hidden';
  } else {
    x = 'shown';
  }
  return `
  <div class='bmark-container js-container' data-item-id='${bmark.id}'>
    
    <div class='${x} control-buttons'>
      <button class='visit-site ${x} bmark-panel-buttons'><a href=${bmark.url}> Visit Site</a> </button>
      <button class='delete ${x} bmark-panel-buttons'> Delete </button>
    </div>

    <div class='bmark-wrapper js-wrapper'>
      <div class="bmark-listing js-listing">
        <p id='title-dis'>${bmark.title}</p>
      <p id='desc' class='desc ${x}'>${bmark.desc}</p>
      <p class="listing-rating js-listing-rating">${bmark.rating}</p>  
      </div>
      </div>
    </div>`;
};

/* filters through the array of bookmarks and checks the 'rating' attribute of each bookmark against the value of the select element on the main page.
   Then we map over each bookmark in the array of bookmarks and pass each one to the initialTemplate so that each bookmark in the array of bookmarks is 
   rendered with that html template. */

const bookmarkStringTemplate = bookmarkList => {
  const bookmarks = bookmarkList
    .filter(bmark => bmark.rating >= store.filterRating)
    .map(bmark => initialTemplate(bmark));

  return bookmarks.join('');
};


/* This simply returns the HTML template of the page where the user can add a new bookmark. */
const addBookmarkTemplate = () => {
  return `
<form id='form-add-bookmark' class='js-form'>
    <div id='info-inputs' class='js-info'>

    <label for='link'> Add a Bookmark </label>
      <input name='url' type='text' id='link' class='inputs js-inputs'>

    <label for='title'> Add a Title</label>
      <input name='title' type='text' id='title' class='inputs js-inputs'>

    <label for='desc'> Add a description </label>
      <textarea name='desc' type='text' id='desc' class='desc inputs js-inputs'></textarea>
    </div>

  <ul id='rating-buttons'>
     <li> <input class='bmark-entry js-entry' id='rating-1' type='radio' name='rating' value='1' required> 
      <label for='rating-1'>1</label></li>

     <li> <input class='bmark-entry js-entry' id='rating-2' type='radio' name='rating' value='2'>
      <label for='rating-2'>2</label></li>

     <li> <input class='bmark-entry js-entry' id='rating-3' type='radio' name='rating' value='3'>
      <label for='rating-3'>3</label></li>

      <li> <input class='bmark-entry js-entry' id='rating-4' type='radio' name='rating' value='4'>
      <label for='rating-4'>4</label></li>

     <li> <input class='bmark-entry js-entry' id='rating-5' type='radio' name='rating' value='5'>
      <label for='rating-5'>5</label></li>
  </ul>
    
  <div id='finish-buttons' class='js-finish'>
      <button id='reset' class='create js-create'>Cancel</button>
      <button type='submit' class='create js-create'> Create </button>
      
  </div>

  
</form>`;
};

/* This function takes a parameter of 'message' which signifies the error message. We then return a template for what each error message should look like and pass in the message in the template. */
const generateError = message => {
  return `
      <section class="error-content js-error">
        <p>${message}</p>
        <button id="cancel-error">X</button>
      </section>
    `;
};



//Event Handlers

/* When the user clicks the 'New' button it sets the store.add variable to the opposite of whatever it was set to and we run the function that generates the add bookmark form.
   So it's essentially a toggle to go between the main page and the add page. */
const handleNewBookmarkClick = () => {
  $('#new-bookmark').on('click', () => {
    store.add = !store.add;
    addBookmarkTemplate();
    render();
  });
};

/* When the user clicks on an individual bookmark container it finds the id of what was clicked and sets the 'expanded' attribute to the opposite of the current state at the time of interaction.
   It's essentially a toggle to expand and close the bookmark to reveal or hide additional information. */
const handleExpandedBookmarkClick = () => {
  $('main').on('click', '.js-container', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    store.findById(id).expanded = !store.findById(id).expanded;
    render();
  });
};

/* When the user clicks on the 'Cancel' button the add bookmark page, it sets the add variable in the store to the opposite of the current state at the time of interaction. */
const resetPage = () => {
  $('main').on('click', '#reset', () => {
    store.add = !store.add;
  });
};

/* When a user clicks the container of a single bookmark it returns the id of that bookmark. This function is used in unision with some of the other functions that require a specific id
   of a single element. */
const getBookmarkIdFromElement = bmark => {
  return $(bmark).closest('.js-container').data('item-id');
};


/* When a user clicks the 'Delete' button on a bookmark element, the id is grabbed and then the 'deleteBookmark' function in api.js is run passing in the id of the element that was clicked.
  it returns a promise that will run the 'findAndDelete' function in store.js and update the state of the store. There is a catch underneath to catch the error and set it to the error message.*/
const deleteBookmark = () => {
  $('main').on('click', '.delete', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);

    api
      .deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        store.setError(error.message);
        render();
      });
  });
};


/* When a user clicks the 'submit' button on the form it sets the current target and serializes it, prevents the default behavior, sets the add variable in the store to the opposite of when it was interacted with
   then we run the 'createBookmarks' function in the API that adds a new bookmark to the API. Then it runs the 'addBookmark' function in the store to add it to the local store and updates the state. 
   It then catches the error underneath, if there is one, and sets it to the error message and then updates the state. */
const handleNewBookmarkSubmit = () => {
  $('main').on('submit', '.js-form', (event) => {
    const newBookmarkName = $(event.target).serializeJson();
    event.preventDefault();
    store.add = !store.add;
    api.createBookmarks(newBookmarkName)
      .then(newBookmark => {
        store.addBookmark(newBookmark);
        render();
      })
      .catch(error => {
        store.setError(error.message);
        render();
      });
  });
};

/* When a user changes the value of the select menu it sets the 'filterRating' variable in the store to that value and updates the state of the store.*/
const filterByRating = () => {
  $('#rating').on('change', () => {
    let ratingFilter = $('#rating option:selected').val();

    store.filterRating = ratingFilter;
    render();
  });
};

// Error Event Handlers

/* If there is an error then it will run the 'generateError' function and pass in that error. The .html method will render that error to the selected HTML element. If there is no error then that element will empty.*/
const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};


/* When the user clicks the button inside of the error display, it will close out the error and update the state. */
const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    render();
  });
};

// Render Functions

/* In this render function, an 'if' statement is used to check the state of the store an with the event handlers changing the state, it allows the user to navigate between the add pages and main page. At the top,
   we also run the 'renderError()' function  which will ONLY run if there is an error detected. */
const render = () => {
  renderError();
  let bookmarks = [...store.bookmarks];
  if (!store.bookmarkNum) {
    if (!store.add) {
      $('main').html(bookmarkStringTemplate(bookmarks));
    } else {
      $('main').html(addBookmarkTemplate());
    }
  } else {
    if (store.add) {
      $('main').html(addBookmarkTemplate());
    } else if (store.editing) {
      $('main').html(bookmarkStringTemplate(bookmarks));
    } else {
      $('main').html(bookmarkStringTemplate(bookmarks));
    }
  }
};

const bindEventListeners = () => {
  handleCloseError();
  handleNewBookmarkClick();
  handleNewBookmarkSubmit();
  handleExpandedBookmarkClick();
  filterByRating();
  deleteBookmark();
  resetPage();
};

// Exports
export default {
  render,
  bindEventListeners,
  initialTemplate,
  addBookmarkTemplate,
};
