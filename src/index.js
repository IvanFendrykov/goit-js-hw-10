import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let inputCountry = e.target.value.trim();

  if (inputCountry) {
    return fetchCountries(inputCountry)
      .then(data => {
        choseMarkup(data);
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }

  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function choseMarkup(countryArray) {
  if (countryArray.length === 1) {
    refs.countryList.innerHTML = '';
    return markupCountry(countryArray);
  }
  if (countryArray.length >= 2 && countryArray.length <= 10) {
    refs.countryInfo.innerHTML = '';
    return markupCountryList(countryArray);
  }
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupCountryList(data) {
  const markup = data
    .map(el => {
      return `<li class="country">
            <img src="${el.flags.svg}" alt="${el.name.official}" width="40" height="30" /> 
            <p>${el.name.official}</p>
            </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function markupCountry(data) {
  const markup = data
    .map(el => {
      return `<h1>
       <img src="${el.flags.svg}" alt="${
        el.name.official
      }" width="40" height="40" /> 
            
        ${el.name.official}
      </h1>
      <ul class="country-info-list">
        <li class="country-info-item">
          <h2>Capital:</h2>
          <p>${el.capital}</p>
        </li>
        <li class="country-info-item">
          <h2>Population:</h2>
          <p>${el.population}</p>
        </li>
        <li class="country-info-item">
          <h2>Languages:</h2>
          <p>${Object.values(el.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  refs.countryInfo.innerHTML = markup;
}
