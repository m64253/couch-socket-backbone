Playing with syncing BackboneJS Model's & Collection's from CouchDB using NodeJS + SocketIO

### Download and install CouchDB >= 1.2
http://couchdb.apache.org/#download

### Install NodeJS dependencies
```
npm install
```

### Upload the design document to your couch server
```
./node_modules/.bin/couchapp push design.js http://admin:admin@127.0.0.1:5984/test1
```

### Run server
```
node index.js
```

### Check out in your browser
http://127.0.0.1:3000/public