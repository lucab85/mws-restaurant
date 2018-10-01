# Restaurant Review: Mobile Web Specialist Nanodegree project
---

In **Restaurant Reviews** project, I incrementally converted a static webpage to a mobile-ready web application. In **Stage One**, I took a static design that lacks accessibility and converted to be responsive on different sized displays and accessible for screen reader use. I also added a service worker to begin the process of creating a seamless offline experience for my users. In **Stage Two** I took the responsive, accessible design you built in Stage One and connect it to an external server. I used asynchronous JavaScript to request JSON data from the server. I stored data received from the server in an offline database using IndexedDB, which created an app shell architecture. In **Stage Three** I added a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. Finally, I optimized your site to meet Lighthouse benchmarks for Progressive Web App, Accessibility and Performance.

# Usage

1. Follow the instructions of [Getting Started](#getting-started) section
1. Open your browser on Develompent [localhost:1337](http://localhost:1337) or in Production [localhost:80](http://localhost:80).

# Architecture

* [index.html](index.html) - Homepage and full listing of restaurants
* [restaurant.html?id=1](restaurant.html?id=1) (id argument mandatory) - The details of each restaurant

# Getting Started

## How to start the server and the app

1. Install project dependencies

```
npm install
```

2. Build your app and start webserver to serve content

```
npm start
```

3. Open your browser on Develompent [localhost:1337](http://localhost:1337) or in Production [localhost:80](http://localhost:80).

# How to contribute
Refer to [CONTRIBUTING](CONTRIBUTING) file.

# License
Refer to [LICENSE](LICENSE) file.
