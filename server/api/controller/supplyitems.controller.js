'use strict';

const db = require('../model/model.js');

module.exports = {
  //get suppply items for specific user (return all specific user's supplyitem id and item name
  get: function(req, res) {
    db.User.find({
      where: {
        user: req.params.id
      }
    })
    .then( (user) => {
      if(user === null) {
        console.error('Error GET request supplyitems: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.SupplyItem.findAll({
        where: {
          userId: user.dataValues.id
        }
      });
    })
    .then( (supplyitems) => {
      if (supplyitems.length === 0) {
        return [];
      } else {
        var supplylist = [];
        supplyitems.forEach( (item) => {
          supplylist.push({
            name: item.dataValues.itemName,
            isChecked: item.dataValues.isChecked
          });
        });
        res.json(supplylist);
      }
    })
    .catch( (err) => {
      console.error('Error GET request supplyitems', err);
      res.sendStatus(404);
    });
  },
  //save trail as a favorite for specific user (create instance to usersfavorites)
  post: function(req, res) {
    db.User.findOne({
      where: {
        user: req.body.userId
      }
    })
    .then( (user) => {
      if(user === null) {
        console.error('Error POST request supplyitems: user does not exist');
        res.sendStatus(404);
        return;
      }
      // The Users table 'id' field is foreign key in Supplyitems (not the auth0 long id string)
      // so we asign 'user.dataValues.id' to 'userId' in Supplyitems
      return db.SupplyItem.findOrCreate({
        where: {
          userId: user.dataValues.id,
          itemName: req.params.name
        }
      })
    })
    .then( (results) => {
      res.sendStatus(201);    // json('Created'); <-- this seems to generate some
                              // errors related to headers being sent again
    })
    .catch( (err) => {
      console.error('Error POST request to supply items', err);
      res.sendStatus(404);
    });
  },
  update: function(req, res) {
    db.User.find({
      where: {
        user: req.body.userId
      }
    })
    .then( (user) => {
      if(user === null) {
        console.error('Error UPDATE request supplyitems: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.SupplyItem.find({
        where: {
          userId: user.dataValues.id,
          itemName: req.params.name
        }
      })
      .then( (supplyitem) => {
        return db.SupplyItem.update({
          isChecked: req.body.isChecked
        }, {
          where: {
            id: supplyitem.dataValues.id
          }
        })
      })
      .then( (supplyitem) => {
        console.log('This is after an item is updated and this is the parameter: ', supplyitem);
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log('Error updating item in SupplyItem table', err);
      });
    })
    .catch((err) => {
      console.log('Error on UPDATE request in User table', err);
    });
  },
  //removes supply list item for specific user
  delete: function(req, res) {
    db.User.find({
      where: {
        user: req.body.userId
      }
    })
    .then( (user) => {
      if(user === null) {
        console.error('Error DELETE request supplyitems: user does not exist');
        res.sendStatus(404);
        return;
      }
      return db.SupplyItem.find({
        where: {
          userId: user.dataValues.id,
          itemName: req.params.name
        }
      })
      .then( (supplyitem) => {
        return db.SupplyItem.destroy({
          where: {
            id: supplyitem.dataValues.id
          }
        });
      })
      .then( (supplyitem) => {
        console.log('This is after an item is deleted and this is the parameter: ', supplyitem);
        res.sendStatus(200);
      })
      .catch( (err) => {
        console.error('Error DELETE request supplyitems', err);
        res.sendStatus(404);
      });
    })
    .catch( (err) => {
      console.error('Error DELETE request of supplyitem in user table', err);
      res.sendStatus(404);
    });
  }
};
