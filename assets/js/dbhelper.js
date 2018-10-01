/*eslint-env es6*/
/**
 * Common database helper functions.
 */
/*eslint-disable no-unused-vars*/
class DBHelper {
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    /*eslint-disable no-undef*/
    IDBHelper.readAllIdbData(IDBHelper.dbPromise)
    /*eslint-enable no-undef*/
      .then(restaurants => {
        return callback(null, restaurants);
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by favorite value with proper error handling.
   */
  static fetchRestaurantByFavorites(favorite, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given favorite value
        const results = restaurants.filter(r => r.favorites == favorite);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhoodAndFavorite(cuisine, neighborhood, favorite, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        if (favorite === true) { // filter by favorites
          results = results.filter(r => r.is_favorite == 'true');
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (restaurant.photograph === undefined) ?
      'https://via.placeholder.com/800x600' :
      `img/${restaurant.photograph}.jpg`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    /*eslint-disable no-undef*/
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    /*eslint-enable no-undef*/
    return marker;
  }


  /**
   * Start ServiceWorker
   */
  static startServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js', {scope: '/'})
        .then(reg => {
          const restoForm = document.getElementById('restoForm');
          if ( restoForm ) {
            restoForm.addEventListener('submit', () => {
              reg.sync.register('review-sync')
                .then(() => console.log('Review sync registered'));
            });
          }
        })
        .catch(err => console.log('SW Registration failed with ' + err));
    }
  }

  /**
  * Add or Remove favorite flag.
  */
  static toggleFavorite(id, value) {
    fetch(`https://mws-restaurant-217808.appspot.com/restaurants/${id}/?is_favorite=${value}`, { method: 'POST' })
      .then(res => console.log(`updated API restaurant: ${id} favorite : ${value}`))
      /*eslint-disable no-undef*/
      .then(IDBHelper.idbToggleFavorite(id, value))
      /*eslint-enable no-undef*/
      .then(res => console.log(`updated IDB restaurant: ${id} favorite : ${value}`))
      .then(location.reload());
  }

  /**
   * Add or Remove is_favorite on the server
   */
  static saveOfflineReview(event, form) {
    event.preventDefault();
    const body = {
      'restaurant_id': parseInt(form.id.value),
      'name': form.dname.value,
      'rating': parseInt(form.drating.value),
      'comments': form.dreview.value,
      'updatedAt': parseInt(form.ddate.value),
      'flag': form.dflag.value,
    };
    /*eslint-disable no-undef*/
    IDBHelper.idbPostReview(form.id.value, body);
    /*eslint-enable no-undef*/
    location.reload();
  }

}
