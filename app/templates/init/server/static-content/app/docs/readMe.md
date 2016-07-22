create-server.js

  This is used to create this express app, initalize routes, connect to the db.


start-server.js

  When this app is deployed to a server it is started by calling:

  node ./server/app/start-server.js

  Start-server defaults to 'development' and port 3000 if the environment variables are not set.

  When this app is invoked by a test the method createServer in app.js is called directly from the test after the test sets 
  appropriate environment variables