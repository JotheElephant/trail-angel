//users controller

'use strict';

const db = require('../model/model.js');

module.exports = {
  //create a user to link with trails (creates user instance in users table)
  post: function (req, res) {
    db.User.findOrCreate({
      where: {
        user: req.body.user
      }
    })
    .then( (user) => {
      res.sendStatus(201);
    })
    .catch( (err) => {
      console.error('Error POST request: user does not exist or cannot be created');
      res.sendStatus(404);
    });
  },
  //delete user account (removes instance from users table)
  delete: function(req, res) {
    db.User.find({
      where: {
        user: req.params.id
      }
    })
    .then( (userID) => {
      if(userID === 0) {
        console.error('Error DELETE request: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.UsersFavorites.destroy({
        where: {
          userId: userID.dataValues.id
        }
      });
    })
    .then( (userfavorite) => {
      if (userfavorite === 0) {
        return;
      }
      return db.User.destroy({
        where: {
          user: req.params.id
        }
      });
    })
    .then( (user) => {
      console.log('user destroyed');
      res.sendStatus(200);
    })
    .catch( (err) => {
      console.error('Error deleting user');
      res.sendStatus(404);
    });
  }
};
