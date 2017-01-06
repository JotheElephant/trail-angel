var supertest = require("supertest");
var expect = require('chai').expect;
var db = require('../model/model.js');

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:4000");

describe("Users: ",function(){

  // after(function() {
  //   db.User.find({
  //     where: 'joh@jo.com'
  //   }).then( () => {
  //     db.User.destroy({
  //       where: 'joh@jo.com'
  //     });
  //   });
  // });

  it("should post favorite to users and return 201",function(done){

    server
    .post("/api/users/")
    .send({ user: 'joh@jo.com'})
    .expect(201)
    .end(function(err,res){
      expect(res.status).to.equal(201);
      expect(res.body.error).to.equal(undefined);
      done();
    });
  });

  it("should delete user from users and return 200",function(done){

    server
    .delete("/api/users/joh@jo.com")
    .expect(200)
    .end(function(err,res){
      expect(res.status).to.equal(200);
      expect(res.body.error).to.equal(undefined);
      done();
    });
  });


});