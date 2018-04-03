# Mobile Web Specialist Nanodegree project
---

For the **Restaurant Reviews** projects, I incrementally converted a static webpage to a mobile-ready web application. In **Stage One**, I took a static design that lacks accessibility and converted the design to be responsive on different sized displays and accessible for screen reader use. I've  also added a service worker to begin the process of creating a seamless offline experience for my users. . In **Stage Two**, I took the responsive, accessible design you built in Stage One and connect it to an external server. I used asynchronous JavaScript to request JSON data from the server. I stored data received from the server in an offline database using IndexedDB, which created an app shell architecture. Finally, I optimized your site to meet performance benchmarks, tested with Lighthouse.

# Usage

1. Follow the instructions of [Getting Started](#getting-started) section
1. Open your browser to [localhost:8000](http://localhost:8000).

# Architecture

The full listing of restaurant is available in the homepage of the app ([index.html](index.html)).
The details of each restaurant is loaded by the restaurant [restaurant.html?id=1](restaurant.html?id=1) (mandatory the id argument).

# Getting Started

## How to setup server
Refer to [mws-restaurant-api](https://github.com/lucab85/mws-restaurant-api) project.

## How to setup app

1. Install dependencies

```
npm install
```

1. Buil your app to `dist` directory

```
gulp dist
```

1. Start webserver to serve content

```
gulp webserver
```

1. Open your browser to [localhost:8000](http://localhost:8000).

# How to contribute
Refer to [CONTRIBUTING](CONTRIBUTING) file.


# License
Refer to [LICENSE](LICENSE) file.