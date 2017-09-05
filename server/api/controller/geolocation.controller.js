var geoMapper = require('../../config/redis.server.js').geoMapper;


module.exports = {
  geolocation: {
    //retrieve all latlng for specific favorite trail
    //requires trailId to be sent in params and userId in the body
    get: function (req, res) {
      let key = `${req.params.trailId}:${req.params.userId}`;
      // let key = 'shoreline-trails:45';
      geoMapper.zcountAsync(key, '-inf', 'inf')
        .then( (count) => {
          // console.log("this is the number of items in this key", key, count);
          var pins = [];
          for (var i = 0; i < count; i++) {
            pins.push(i);
          }
          return pins;
        })
        .then( (pins) => {
          return geoMapper.geoposAsync(key, ...pins)
        })
        .then( (geolocations) => {
          // console.log("this is the lat and long for ", geolocations);
          res.send(geolocations);
        })
        .catch( (err) => {
          console.log('Error GET request: this trail does not have any pins yet', err);
          res.sendStatus(404);
        });
    },
    //posts all latlng for a favorite map trail that hasn't been created
    //req.body should have each lat/long values stored in an array as tuples
    post: function (req, res) {
      //geoaddAsync
      let key = `${req.params.trailId}:${req.body.userId}`;
      // let key = 'shoreline-trails:45';
      let pins = []; //change to get the correct format
      for(var pin = 0; pin < req.body.pins.length; pin++) {
        pins.push(...req.body.pins[pin], pin);
      }
      geoMapper.geoaddAsync(key, ...pins)
        .then( (status) => {
          console.log('The new pins have been saved!', status);
          res.sendStatus(201);
        })
        .catch( (err) => {
          console.log('Error POST Request: The new pins have NOT been saved!', err);
          res.sendStatus(404);
        });
    },
    //removes all latlng points for specific favorite trail or removes trail
    delete: function(req, res) {
      //delAsync
      let key = `${req.params.trailId}:${req.body.userId}`;

      geoMapper.delAsync(key)
        .then( (status) => {
          console.log('Removed all pins from map', status);
          res.sendStatus(200);
        })
        .catch( (err) => {
          console.log('Error DELETE Request: removing pins from map', err);
          res.sendStatus(404);
        });
    },
    //updates (add or delete) latlng pins on specific favorite trail
    put: function(req, res) {
      let key = `${req.params.trailId}:${req.body.userId}`;
      //modify req.body.pins to get array of tuples unless it happens on client side
      // let key = 'shoreline-trails:45';
      let pins = []; //change to get the correct format
      for(var pin = 0; pin < req.body.pins.length; pin++) {
        pins.push(...req.body.pins[pin], pin);
      }
      geoMapper.delAsync(key)
        .then( (status) => {
          return geoMapper.geoaddAsync(key, ...pins); //if we get the format we want, then this is OK
        })
        .then( (status) => {
          console.log('Pins have been replaced!', status);
          res.sendStatus(200);
        })
        .catch( (err) => {
          console.log('Error PUT Request: Pins have not been saved or mapping points on this trail was not deleted!', err);
          res.sendStatus(404);
        });
    },
    getDistance: function(req, res) {
      let key = `${req.params.trailId}:${req.params.userId}`;
      geoMapper.zcountAsync(key, '-inf', 'inf')
        .then( (count) => {
          // console.log("this is the number of items in this key", key, count);
          let promises = [];
          for (var pin = 1; pin < count; pin++) {
            promises.push(geoMapper.geodistAsync(key, pin-1, pin, 'mi'));
          }

          return Promise.all(promises);
        })
        .then((data) => {
          let totalDistance = data.reduce((sum, distance) => {
            return sum + parseFloat(distance);
          }, 0);
          res.json(totalDistance);
        })
        .catch((err) => {
          console.log('Error GETDISTANCE request: getting distance data', err);
          res.sendStatus(404);
        });
    }
  },
};




