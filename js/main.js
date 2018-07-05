/*eslint-env es6*/

/*eslint-disable no-unused-vars*/
let restaurants,
  neighborhoods,
  cuisines;
let map;
var markers = [];
/*eslint-enable no-unused-vars*/

/**
 * Initialize ServiceWorker, fetch neighborhoods and cuisines as soon 
 * as the page is loaded.
 */
/*eslint-disable no-unused-vars*/
/*eslint-disable no-undef*/
document.addEventListener('DOMContentLoaded', (event) => {
  DBHelper.startServiceWorker();
  IDBHelper.databaseExists(dbname=IDBHelper.IDB_DB, (res) => {
    console.log(IDBHelper.IDB_DB + ' exists? ' + res);
    if (!res) {
      IDBHelper.createNewDatabase();
      IDBHelper.populateDatabase(IDBHelper.dbPromise);
    }
  });
  setTimeout(function() {
    this.fetchNeighborhoods();
    this.fetchCuisines();
  }, 3000);
});
/*eslint-enable no-unused-vars*/

/**
 * Fetch all neighborhoods and set their HTML.
 */
/*eslint-disable no-undef*/
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      this.fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      this.fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new this.google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  this.updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');
  const fSelect = document.getElementById('favorites-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;
  const fIndex = fSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  const favorite = fSelect[fIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhoodAndFavorite(cuisine, neighborhood, favorite, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      this.resetRestaurants(restaurants);
      this.fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(this.createRestaurantHTML(restaurant));
  });
  this.addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('alt','Photo of the ' + restaurant.name + ' restaurant');
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    this.google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    this.markers.push(marker);
  });
};
/*eslint-disable no-undef*/
