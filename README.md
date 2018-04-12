# Restaurant Review: Mobile Web Specialist Nanodegree project
---

In **Restaurant Reviews** project, I incrementally converted a static webpage to a mobile-ready web application. In **Stage One**, I took a static design that lacks accessibility and converted to be responsive on different sized displays and accessible for screen reader use. I also added a service worker to begin the process of creating a seamless offline experience for my users. In **Stage Two** I took the responsive, accessible design you built in Stage One and connect it to an external server. I used asynchronous JavaScript to request JSON data from the server. I stored data received from the server in an offline database using IndexedDB, which created an app shell architecture. Finally, I optimized your site to meet Lighthouse benchmarks for Progressive Web App, Accessibility and Performance.

# Usage

1. Follow the instructions of [Getting Started](#getting-started) section
1. Open your browser on [localhost:8000](http://localhost:8000).

# Architecture

* [index.html](index.html) - Homepage and full listing of restaurants
* [restaurant.html?id=1](restaurant.html?id=1) (id argument mandatory) - The details of each restaurant

# Getting Started

## How to start the server
Refer to [mws-restaurant-api](https://github.com/lucab85/mws-restaurant-api) project.

## How to start the app

1. Install glup
```
npm install gulp-cli -g
```

2. Install project dependencies

```
npm install
```

3. Buil your app to `dist` directory

```
gulp dist
```

4. Start webserver to serve content

```
gulp webserver
```

5. Open your browser on [localhost:8000](http://localhost:8000).

# How to contribute
Refer to [CONTRIBUTING](CONTRIBUTING) file.

# License
Refer to [LICENSE](LICENSE) file.