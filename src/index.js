// Main file that everything routes to
import $ from 'jquery';
import './styles.css';
import 'normalize.css';
import bookmarks from './bookmark';
import api from './api';
import store from './store';
import bookmark from './bookmark';


/* This function is the main function that sets the stage for what the user will see when he/she first loads in. It will run the render function and the bindEventListeners function and go to the
   API to grab the bookmarks data in the API to render the information immeditately on the page.  */
function main() {
  bookmark.render();
  bookmarks.bindEventListeners();

  api.getBookmarks().then(bookmarks => {
    bookmarks.forEach(bookmark => {store.addBookmark(bookmark);});
    bookmark.render();
  });

  bookmark.render();

}

$(main);
