/*eslint-env es6*/
const IDB_DB = 'restaurantDb';
const IDB_OBJ = 'restaurantObj';
/**
 * Common database helper functions.
 */
/*eslint-disable no-unused-vars*/
class DBHelper {
  /**
   * Database URL from API server
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    const server = 'localhost';
    return `http://${server}:${port}/restaurants`;
    //return 'data/restaurants.json';
  }

  /*
   * Open connection with IDB database
   */
  static idbOpen() {
    // Check Browser support
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
    /*eslint-disable no-undef*/
    return idb.open(IDB_DB, 1, function(upgradeDb){
      var store = upgradeDb.createObjectStore(IDB_OBJ, {
        keyPath: 'id'
      });
      store.createIndex('by-id', 'id');
    });
    /*eslint-enable no-undef*/
  }

  /*
   * Save data to IDB database
   */
  static idbSave(data){
    return DBHelper.idbOpen().then(function(db){
      if(!db)
        return;

      var tx = db.transaction(IDB_OBJ, 'readwrite');
      var store = tx.objectStore(IDB_OBJ);
      data.forEach(function(restaurant){
        store.put(restaurant);
      });
      return tx.complete;
    });
  }

  /*
   * Fetch data from API and save to IDB
   */
  static fetchRestaurantsFromAPI(){
    return fetch(DBHelper.DATABASE_URL)
      .then(function(response){
        return response.json();
      }).then(restaurants => {
        DBHelper.idbSave(restaurants);
        return restaurants;
      });
  }

  /*
   * Get data from IDB
   */
  static getCachedRestaurants() {
    return DBHelper.idbOpen().then(function(db){
      if(!db)
        return;
      var store = db.transaction(IDB_OBJ).objectStore(IDB_OBJ);
      return store.getAll();
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    return DBHelper.getCachedRestaurants().then(restaurants => {
      if(restaurants.length) {
        return Promise.resolve(restaurants);
      } else {
        return DBHelper.fetchRestaurantsFromAPI();
      }
    }).then(restaurants=> {
      callback(null, restaurants);
    }).catch(error => {
      callback(error, null);
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
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
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
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('SW Registration successful. Scope is ' + reg.scope);
        }).catch((error) => {
          console.log('SW Registration failed with ' + error);
        });
    }
  }

}
