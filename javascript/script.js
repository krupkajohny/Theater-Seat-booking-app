/****** STRICT mode ON *******/
'use strict';

const movie = document.querySelector('#movie');
const container = document.querySelector('.container');
const availableSeats = container.querySelectorAll('.row .seat:not(.occupied)');
const selectedSeatsCountEl = document.querySelector('#count');
const totalPriceEl = document.querySelector('#total');

//////////////////////////////////////
// Functions

// Populate UI
populateUi();

/*
*********************************
SAVING DATA TO LOCAL STORAGE
*********************************
*/

const saveMovieIndexAndPrice = (movieIndex, ticketPrice) => {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', ticketPrice);
};

const saveSelectedSeatsCountAndPrice = (seatsCount) => {
  localStorage.setItem('countOfSelectedSeats', seatsCount);
};

const saveSelectedSeatsIndexes = () => {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  // [...selectedSeats] and [...availableSeats] => converting nodeLists to [ ]s
  const seatsIndexes = [...selectedSeats].map((seat) => [...availableSeats].indexOf(seat));

  // Converting data into json (before saving to local storage) because it is not primitive value = > it's a js [ ]
  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndexes));
};

/*
*********************************
SAVING DATA TO LOCAL STORAGE
*********************************
*/
const updateSelectedSeatsCounAndTotalPrice = () => {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const ticketPrice = +movie.value;

  selectedSeatsCountEl.textContent = selectedSeats.length;
  totalPriceEl.textContent = `$${selectedSeats.length * ticketPrice}`;
};

function populateUi() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
  const selectedMoviePrice = localStorage.getItem('selectedMoviePrice');
  const countsOfSeats = localStorage.getItem('countOfSelectedSeats');

  // Updating selected seats only if there is any data in local storage (using optional chaining?)
  selectedSeats?.forEach((selectedSeatIndex) => {
    availableSeats[selectedSeatIndex].classList.add('selected');
  });

  // Updating remaining data only if there is any in local storage (using ternary operator)
  movie.selectedIndex = selectedMovieIndex ? selectedMovieIndex : 0;
  selectedSeatsCountEl.textContent = countsOfSeats ? countsOfSeats : 0;
  totalPriceEl.textContent = countsOfSeats ? `$${selectedMoviePrice * countsOfSeats}` : `$0`;
}

//////////////////////////////////////
// Event listeners

container.addEventListener('click', (e) => {
  e.preventDefault();
  const isSeat = e.target.classList.contains('seat');
  const seatOccupied = e.target.classList.contains('occupied');

  // Processing code below the GUARD CLOSE only if:
  // isSeat => isSeat is true => clicked element contains class seat (seat was clicked)
  // or
  // !SeatOccupied => is false => clicked element does NOT contain class occupied (seat is not occupied)
  // Otherwise return(stop) the function (callback function called by event listener)
  if (!isSeat | seatOccupied) return;

  e.target.classList.toggle('selected');
  updateSelectedSeatsCounAndTotalPrice();

  // using slice method on 2nd argument to get rid of $ sign from total price
  saveSelectedSeatsCountAndPrice(selectedSeatsCountEl.textContent, totalPriceEl.textContent.slice(1));

  // Saving indexes of selected seats to LocalStorage
  saveSelectedSeatsIndexes();

  // Saving movie data to LocalStorage
  saveMovieIndexAndPrice(movie.selectedIndex, movie.value);
});

movie.addEventListener('change', (e) => {
  e.preventDefault();

  updateSelectedSeatsCounAndTotalPrice();

  // Saving movie data to LocalStorage
  saveMovieIndexAndPrice(e.target.selectedIndex, e.target.value);
});
