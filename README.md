dite
====

Process based shared web-hosting platform. Written in Node.js. CURRENTLY STILL ON WORKING, all PULL REQUEST will be rejected.

# Requirement

Do not use this thing for production. But for testing purpose, here you need to prepare :

* A full sandboxed Virtual Linux (Debian based recommended) OS with :
    * Working latest node.js ({{{node}}} command)
    * Latest git
    * nginx


# Running the server

* {{{node application.js}}} to run management server.
* {{{node daemon.js}}} to run all application node.

# How this thing works

Dite is actually served as usual web hosting server. But instead of hosting *.php or *.html file in some directory, it just run a process which server as web server socket. Every web server application is assigned with random unique port in which NGINX would take a part to forward a request which match the application CNAME domain.


