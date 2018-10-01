/*eslint-env es6*/

/*eslint-disable no-unused-vars*/
let restaurant;
let map;
/*eslint-enable no-unused-vars*/


/**
 * Initialize ServiceWorker
 */
/*eslint-disable no-unused-vars*/
document.addEventListener('DOMContentLoaded', (event) => {
  /*eslint-disable no-undef*/
  DBHelper.startServiceWorker();
  /*eslint-enable no-undef*/
});
/*eslint-enable no-unused-vars*/

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  this.fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new this.google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      this.fillBreadcrumb();
      /*eslint-disable no-undef*/
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
      /*eslint-enable no-undef*/
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
/*eslint-disable no-undef*/
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = this.getParameterByName('id');
  if (!id) { // no id found in URL
    let error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      this.fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.tabIndex = '0';

  this.fillRestaurantFavoriteHTML();

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.tabIndex = '0';

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('alt','Photo of the ' + restaurant.name + ' restaurant');

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.tabIndex = '0';

  // fill operating hours
  if (restaurant.operating_hours) {
    this.fillRestaurantHoursHTML();
  }
  // fill reviews
  this.fillReviewsHTML();
  // show review form
  buildReviewFormHTML();
};

/**
 * Create restaurant add or remove favorite
 */
fillRestaurantFavoriteHTML = (is_favorite = self.restaurant.is_favorite, id = self.restaurant.id) => {
  const favorite = document.getElementById('restaurant-favorite');
  console.log('favorite: ', is_favorite);

  let btn = document.createElement('button');
  btn.setAttribute('id', 'button-favorite');

  if (is_favorite == 'true') {
    btn.innerHTML = 'Remove from Favorite';
    btn.setAttribute('onclick',`DBHelper.toggleFavorite(${id}, false);`);
  } else {
    btn.innerHTML = 'Add to Favorite';
    btn.setAttribute('onclick',`DBHelper.toggleFavorite(${id}, true);`);
  }

  favorite.appendChild(btn);
};


/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  //for (let key in operatingHours) {
  for (key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    day.tabIndex = '0';
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.tabIndex = '0';
    row.appendChild(time);

    hours.appendChild(row);
    hours.tabIndex = '0';
  }
};


/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.tabIndex = '0';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    noReviews.tabIndex = '0';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(this.createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.tabIndex = '0';
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  date.tabIndex = '0';
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.tabIndex = '0';
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.tabIndex = '0';
  li.appendChild(comments);

  return li;
};


/**
 * Build review form
 */
buildReviewFormHTML = (id = self.restaurant.id) => {
  const formContainer = document.getElementById('review-form');

  const createform = document.createElement('form');
  createform.setAttribute('id', 'restoForm');
  createform.setAttribute('onsubmit', 'DBHelper.saveOfflineReview(event, this);');

  const heading = document.createElement('h2');
  heading.innerHTML = 'Restaurant Review Form ';
  createform.appendChild(heading);

  const line = document.createElement('hr');
  createform.appendChild(line);

  const linebreak = document.createElement('br');
  createform.appendChild(linebreak);

  const hiddenRestaurantId = document.createElement('input');
  hiddenRestaurantId.setAttribute('type', 'hidden');
  hiddenRestaurantId.setAttribute('name', 'id');
  hiddenRestaurantId.setAttribute('value', `${id}`);
  createform.appendChild(hiddenRestaurantId);

  const hiddenReviewDate = document.createElement('input');
  unixTime = Math.round(Date.now());
  hiddenReviewDate.setAttribute('type', 'hidden');
  hiddenReviewDate.setAttribute('name', 'ddate');
  hiddenReviewDate.setAttribute('value', `${unixTime}`);
  createform.appendChild(hiddenReviewDate);

  const hiddenFlag = document.createElement('input');
  hiddenFlag.setAttribute('type', 'hidden');
  hiddenFlag.setAttribute('name', 'dflag');
  hiddenFlag.setAttribute('value', 'unsynced');
  createform.appendChild(hiddenFlag);

  const namelabel = document.createElement('label');
  namelabel.innerHTML = 'Name: ';
  createform.appendChild(namelabel);

  const inputelement = document.createElement('input');
  inputelement.setAttribute('type', 'text');
  inputelement.setAttribute('name', 'dname');
  inputelement.setAttribute('placeholder', 'eg. James Bond');
  inputelement.setAttribute('aria-label', 'reviewer name');
  createform.appendChild(inputelement);

  createform.appendChild(linebreak);

  const ratinglabel = document.createElement('label');
  ratinglabel.innerHTML = 'Rating: ';
  createform.appendChild(ratinglabel);

  const ratingelement = document.createElement('input');
  ratingelement.setAttribute('type', 'text');
  ratingelement.setAttribute('name', 'drating');
  ratingelement.setAttribute('placeholder', 'Please enter a number between 1 to 5');
  ratingelement.setAttribute('aria-label', 'restaurant rating');
  createform.appendChild(ratingelement);

  const ratingbreak = document.createElement('br');
  createform.appendChild(ratingbreak);

  const reviewlabel = document.createElement('label');
  reviewlabel.innerHTML = 'Review: ';
  createform.appendChild(reviewlabel);

  const texareaelement = document.createElement('textarea');
  texareaelement.setAttribute('name', 'dreview');
  texareaelement.setAttribute('placeholder', 'Please write your review');
  texareaelement.setAttribute('aria-label', 'restaurant review');
  createform.appendChild(texareaelement);

  const reviewbreak = document.createElement('br');
  createform.appendChild(reviewbreak);

  const submitelement = document.createElement('input');
  submitelement.setAttribute('type', 'submit');
  submitelement.setAttribute('name', 'dsubmit');
  submitelement.setAttribute('value', 'Submit');
  createform.appendChild(submitelement);

  formContainer.appendChild(createform);
};


/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('aria-current', 'page');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};


/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
/*eslint-disable no-undef*/
