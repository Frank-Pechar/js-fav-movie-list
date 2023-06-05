// sample image https://upload.wikimedia.org/wikipedia/en/8/85/Terminator2poster.jpg

'use strict';
// Select global dom objects using various methods
const addMovieModal = document.getElementById('add-modal');
// const addMovieModal = document.querySelector('#add-modal');
// const addMovieModal = document.body.children[3];
const startAddMovieButton = document.querySelector('header button');
// const startAddMovieButton = document.querySelector('header').lastElementChild;
const backdrop = document.getElementById('backdrop');
// const backdrop = document.body.children[2];
const cancelAddMovieButton = addMovieModal.querySelector('.btn--passive');
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll('input');
// const userInputs = addMovieModal.getElementsByTagName('input');
const entryTextSection = document.getElementById('entry-text');
const movieDeletionDescriptor = document.getElementById('delete-descriptor');
const deleteMovieModal = document.getElementById('delete-modal');

// movie list array
const movies = [];

// modal greyed out background
const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

// update UI with or without movie list
const updateUI = () => {
  if (movies.length === 0) {
    entryTextSection.style.display = 'block';
    movieDeletionDescriptor.style.display = 'none';
  } else {
    entryTextSection.style.display = 'none';
    movieDeletionDescriptor.style.display = 'block';
  }
};

// remove delete movie modal after deleting or canceling delete
const closeMovieDeletionModal = () => {
  toggleBackdrop();
  deleteMovieModal.classList.remove('visible');
};

// remove movie from array and from the dom list
const deleteMovieHandler = (movieId) => {
  let movieIndex = 0;
  for (const movie of movies) {
    if (movie.id === movieId) {
      break;
    }
    movieIndex++;
  }
  movies.splice(movieIndex, 1);
  const listRoot = document.getElementById('movie-list');
  listRoot.children[movieIndex].remove();
  closeMovieDeletionModal();
  updateUI();
};

// display confirm movie deletion modal
const startDeleteMovieHandler = (movieId) => {
  deleteMovieModal.classList.add('visible');
  toggleBackdrop();

  // create pointers to model buttons
  const cancelDeletionButton = deleteMovieModal.querySelector('.btn--passive');
  let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

  // remove old event listener if it exists
  cancelDeletionButton.removeEventListener('click', closeMovieDeletionModal);

  // remove old event listener if it exists for element that has an event listener bound handler function by:
  // 1) recreate DOM button element contents by creating a copy using a deep clone of the element
  // 2) replaceWith will replace DOM button element contents with cloned button element
  // 3) recreate pointer to the new cloned copied DOM element for new event listener to be attached
  confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
  confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

  // add new event listeners to delete movie modal buttons
  cancelDeletionButton.addEventListener('click', closeMovieDeletionModal);
  confirmDeletionButton.addEventListener(
    'click',
    deleteMovieHandler.bind(null, movieId)
  );
};

// render new movie to UI list
const renderNewMovieElement = (id, title, imageUrl, rating) => {
  // create new li element for the new movie
  const newMovieElement = document.createElement('li');
  newMovieElement.className = 'movie-element';
  newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
      <h2>${title}</h2>
      <p>${rating}/5 stars</p>
    </div>
  `;
  // add delete movie event listener handler and pass id argument
  newMovieElement.addEventListener(
    'click',
    startDeleteMovieHandler.bind(null, id)
  );
  // add new movie li element to ul list
  const listRoot = document.getElementById('movie-list');
  listRoot.append(newMovieElement);
};

const closeMovieModal = () => {
  addMovieModal.classList.remove('visible');
};

const showMovieModal = () => {
  addMovieModal.classList.add('visible');
  toggleBackdrop();
};

const clearMovieInput = () => {
  for (const usrInput of userInputs) {
    usrInput.value = '';
  }
};

const cancelAddMovieHandler = () => {
  closeMovieModal();
  toggleBackdrop();
  clearMovieInput();
};

// add new movie to array and call functions to render to UI
const addMovieHandler = () => {
  const titleValue = userInputs[0].value;
  const imageUrlValue = userInputs[1].value;
  const ratingValue = userInputs[2].value;

  // validate input
  if (
    titleValue.trim() === '' ||
    imageUrlValue.trim() === '' ||
    ratingValue.trim() === '' ||
    +ratingValue < 1 ||
    +ratingValue > 5
  ) {
    alert('Please enter valid non-blank values also rating between 1 and 5.');
    return;
  }

  // create movie object
  const newMovie = {
    id: Math.random().toString(),
    title: titleValue,
    image: imageUrlValue,
    rating: ratingValue,
  };

  // add movie object to movie list array
  movies.push(newMovie);
  closeMovieModal();
  toggleBackdrop();
  clearMovieInput();
  // call function to render new movie to list
  renderNewMovieElement(
    newMovie.id,
    newMovie.title,
    newMovie.image,
    newMovie.rating
  );
  updateUI();
};

const backdropClickHandler = () => {
  closeMovieModal();
  closeMovieDeletionModal();
  clearMovieInput();
};

// Initialization routine - adding event listener handlers to buttons
startAddMovieButton.addEventListener('click', showMovieModal);
backdrop.addEventListener('click', backdropClickHandler);
cancelAddMovieButton.addEventListener('click', cancelAddMovieHandler);
confirmAddMovieButton.addEventListener('click', addMovieHandler);
