dite
====

Process based shared web-hosting platform. Written in Node.js. CURRENTLY STILL ON WORKING, all PULL REQUEST will be rejected.

# Requirement

Do not use this thing for production. But for testing purpose, here you need to prepare :

* A full sandboxed Virtual Linux (Debian based recommended) OS with :
    * Working latest node.js (`node` command)
    * MongoDB database
    * Latest git
    * nginx


# Running the server

* `node application.js` to run management server.
* `node daemon.js` to run all application node.

# How this thing works

Dite is actually served just like web hosting server. But instead of hosting *.php or *.html file in some directory for each user, it runs a process for every application which serve as web server socket application.
Every process then assigned with random unique port in which NGINX would take a part to forward a request to the designated process which match the application CNAME domain.

# Test

* `git clone` this repository
* From clone directory
    * Run `node tes.js user.create` to create a new user called "wira".
    * Run `sudo node tes.js node.appCreate` to create node application called wira.pertamax with domain pertamax.wirama.web.id.
    * Insert `127.0.0.1 pertamax.wirama.web.id` in your `/etc/hosts` file.
    * Run `sudo node daemon.js`.
    * Open `http://pertamax.wirama.web.id` from your browser.
    * `Hello World`
