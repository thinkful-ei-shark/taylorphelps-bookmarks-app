// Everything related to the HTTP Calls
const bookmarks = [];

// Variables 
let filterRating = 0;
let mainView = true;
let add = false;


// State Functions



/* This runs in an event handler toggle the add variable between true and false to go between the main view and the add bookmark view. */
const toggleAdd = function() {
  this.add = !add;
};

/* This runs in an event handler to toggle the mainView variable between true and false to go between the add page and the main page. */
const toggleMainView = function() {
  this.mainView = !mainView;
};


// User Action Functions

/* This runs the '.find' method to check for the id of each bookmark that is clicked. It used in multiple event handlers to find a specific bookmark. */
const findById = function(id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};


/* This uses the '.filter' method to delete a bookmark with a specific id in the list. */
const findAndDelete = function(id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

/* This takes a parameter of a single bookmark and sets the .expanded property to false and then pushes the new bookmark to the bookmarks array in the store. */
const addBookmark = function(bookmark) {
  bookmark.expanded = false;
  bookmarks.push(bookmark);
};



// Error Function

const setError = function(error) {
  this.error = error;
};



// Export Functions
export default {
  // Variable Exports
  add,
  bookmarks,
  filterRating,

  // State Exports
  mainView,
  toggleMainView,
  toggleAdd,

  // User Action Exports
  addBookmark,
  setError,
  findById,
  findAndDelete
};