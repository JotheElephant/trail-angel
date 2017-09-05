'use strict';

var db = require('../model/model.js');

module.exports = {
  //get trailfaves for specific user (return all specific user's trail ids in usersfavorites table then obtain all trail names)
  get: function(req, res) {
    db.User.find({
      where: {
        user: req.params.id
      }
    })
    .then( (userID) => {
      if(userID === null) {
        console.error('Error GET request trailfaves: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.UsersFavorites.findAll({
        where: {
          userId: userID.dataValues.id
        }
      });
    })
    .then( (favorites) => {
      if (favorites.length === 0) {
        return [];
      } else {
        var ids = [];
        favorites.forEach( (favoriteID) => {
          ids.push(favoriteID.dataValues.favoriteId);
        });
        return db.Favorite.findAll({
          where: {
            id: {
              $or: ids
            }
          }
        });
      }
    })
    .then( (favoriteNames) => {
      if (favoriteNames.length === 0) {
        res.json([]);
      } else {
        var trailNames = [];
        favoriteNames.forEach( (favoriteName) => {
          trailNames.push(favoriteName.dataValues.favorite);
        });
        res.json(trailNames);
      }
    })
    .catch( (err) => {
      console.error('Error GET request trailfaves', err);
      res.sendStatus(404);
    });
  },
  //save trail as a favorite for specific user (create instance to usersfavorites)
  post: function(req, res) {
    db.User.find({
      where: {
        user: req.body.userId
      }
    })
    .then( (userID) => {
      if(userID === null) {
        console.error('Error POST request trailfaves: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.Favorite.findOrCreate({
        where: {
          favorite: req.params.id
        }
      })
    })
    .then( (favoriteID) => {
      return db.UsersFavorites.findOrCreate({
        where: {
          userId: userID.dataValues.id,
          favoriteId: favoriteID[0].dataValues.id
        }
      });
    })
    .then( (results) => {
      res.sendStatus(201);    // json('Created'); <-- this seems to generate some
                              // errors related to headers being sent again
    })
    .catch( (err) => {
      console.error('Error POST request trailfaves under favorite', err);
      res.sendStatus(404);
    });
  },
  //removes favorite for specific user (removes user-trail relation)
  delete: function(req, res) {
    db.User.find({
      where: {
        user: req.body.userId
      }
    })
    .then( (userID) => {
      if(userID === null) {
        console.error('Error DELETE request trailfaves: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.Favorite.find({
        where: {
          favorite: req.params.id
        }
      })
    })
    .then( (favoriteID) => {
      return db.UsersFavorites.destroy({
        where: {
          userId: userID.dataValues.id,
          favoriteId: favoriteID.dataValues.id
        }
      });
    })
    .then( (userfavorite) => {
      res.sendStatus(200);
    })
    .catch( (err) => {
      console.error('Error DELETE request trailfaves under favorite', err);
      res.sendStatus(404);
    })
    .catch( (err) => {
      console.error('Error DELETE request trailfaves under user', err);
      res.sendStatus(404);
    });
  }
};
