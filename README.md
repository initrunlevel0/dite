dite
====

Process based shared web-hosting platform. Written in Node.js. CURRENTLY STILL ON WORKING, all PULL REQUEST will be rejected.

# Requirement

Do not use this thing for production. But for testing purpose, here you need to prepare :

* A full sandboxed Virtual Linux (Debian based recommended) OS with :
    * Working latest node.js ({{node}} command)
    * Latest git
    * nginx


# Running the server

* {{node application.js}} to run management server.
* {{node daemon.js}} to run all application node.

# How this thing works

Dite is actually served just like web hosting server. But instead of hosting *.php or *.html file in some directory for each user, it runs a process for every application which serve as web server socket application.
Every process then assigned with random unique port in which NGINX would take a part to forward a request to the designated process which match the application CNAME domain.


