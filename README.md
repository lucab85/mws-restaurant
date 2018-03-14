# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, I incrementally converted a static webpage to a mobile-ready web application. In **Stage One**, I took a static design that lacks accessibility and converted the design to be responsive on different sized displays and accessible for screen reader use. I've  also added a service worker to begin the process of creating a seamless offline experience for my users.

## Evaluation points

### Responsive Design
* All content is responsive and displays on a range of display sizes.
  Content should make use of available screen real estate and should display correctly at all screen sizes.
  An image's associated title and text renders next to the image in all viewport sizes.

* Images in the site are sized appropriate to the viewport and do not crowd or overlap other elements in the browser, regardless of viewport size.

* On the main page, restaurants and images are displayed in all viewports. The detail page includes a map, hours and reviews in all viewports.

### Accessibility
* All content-related images include appropriate alternate text that clearly describes the content of the image.

* Focus is appropriately managed allowing users to noticeably tab through each of the important elements of the page. Modal or interstitial windows appropriately lock focus.

* Elements on the page use the appropriate semantic elements. For those elements in which a semantic element is not available, appropriate ARIA roles are defined.

### Offline Availability
* When available in the browser, the site uses a service worker to cache responses to requests for site assets. Visited pages are rendered when there is no network access.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code.
