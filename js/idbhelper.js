/*eslint-env es6*/
const IDB_DB = 'restaurant-db';
const IDB_OBJ = 'restaurants';
const IDB_VER = 1;
const IDB_RW = 'readwrite';

const API_PROTO = 'http';
const API_SERVER = 'localhost';
const API_PORT = '1337';
const URL_DATABASE = `${API_PROTO}://${API_SERVER}:${API_PORT}/restaurants`;
const URL_REVIEWS = `${API_PROTO}://${API_SERVER}:${API_PORT}/reviews/?restaurant_id=`;

/**
 * Common idb helper functions.
 */
/*eslint-disable no-unused-vars*/
class IDBHelper {
  static get dbPromise() {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
    /*eslint-disable no-undef*/
    const dbPromise = idb.open(IDB_DB, IDB_VER);
    /*eslint-enable no-undef*/
    return dbPromise;
  }

  /**
   * Check if idb restaurants index exists
   */
  static databaseExists(db = IDB_DB, callback) {
    var req = indexedDB.open(db);
    var existed = true;
    req.onsuccess = function () {
      req.result.close();
      if (!existed)
        indexedDB.deleteDatabase(db);
      callback(existed);
    };
    req.onupgradeneeded = function () {
      existed = false;
    };
  }

  /**
   * Delete idb restaurants index if exists
   */
  static deleteOldDatabase() {
    let DBDeleteRequest = window.indexedDB.deleteDatabase(IDB_DB);
    DBDeleteRequest.onerror = function () {
      console.log('Error deleting database ' + IDB_DB);
    };
    DBDeleteRequest.onsuccess = function () {
      console.log('Old db successfully deleted!');
    };
  }

  /**
   * Create new IDB restaurant index
   */
  static createNewDatabase() {
    /*eslint-disable no-undef*/
    idb.open(IDB_DB, IDB_VER, function (upgradeDb) {
    /*eslint-enable no-undef*/
      if (!upgradeDb.objectStoreNames.contains(IDB_OBJ)) {
        upgradeDb.createObjectStore(IDB_OBJ, {keypath: 'id', autoIncrement: true});
      }
      console.log(IDB_DB + ' has been created!');
    });
  }

  /**
   * Initialize data population
   */
  static populateDatabase(dbPromise) {
    /*eslint-disable no-undef*/
    fetch(URL_DATABASE)
    /*eslint-enable no-undef*/
      .then(res => res.json())
      .then(json => {
        json.map(restaurant => IDBHelper.populateRestaurantsWithReviews(restaurant, dbPromise));
      });
  }

  /**
   * Populate restaurants data including reviews
   */
  static populateRestaurantsWithReviews(restaurant, dbPromise) {
    let id = restaurant.id;
    fetch(URL_REVIEWS + id)
      .then(res => res.json())
      .then(reviews => dbPromise.then(
        db => {
          const tx = db.transaction(IDB_OBJ, IDB_RW);
          const store = tx.objectStore(IDB_OBJ);
          let item = restaurant;
          item.reviews = reviews;
          store.put(item);
          tx.complete;
        })
      );
  }

  /**
   * Read all data from idb restaurants index
   */
  static readAllIdbData(dbPromise) {
    return dbPromise.then(db => {
      return db.transaction(IDB_OBJ)
        .objectStore(IDB_OBJ).getAll();
    });
  }

  /**
   * Update favorite IDB
   */
  static idbToggleFavorite(id, value) {
    IDBHelper.dbPromise.then(db => {
      const tx = db.transaction(IDB_OBJ, IDB_RW);
      const store = tx.objectStore(IDB_OBJ);
      let val = store.get(id) || 0;
      val.is_favorite = String(value);
      store.put(val, id);
      return tx.complete;
    });
  }
}