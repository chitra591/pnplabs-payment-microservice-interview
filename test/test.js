var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("SAMPLE unit test",function(){
  it("should return user list",function(done){
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });
});

describe("Fetch User Data",function(){
  it("should return user object",function(done){
    server
    .get("/user/3")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.users[0].should.keys(
        'id', 'name', 'account_no', 'balance'
      );
      done();
    });
  });
});

describe("Fetch Balance",function(){
  it("should return balance",function(done){
    server
    .get("/check_balance/2")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.keys(
        'balance'
      );
      done();
    });
  });
});

describe("Withdraw Money",function(){
  it("should deduct money",function(done){
    server
    .put("/withdraw/")
    .send({
      "id": "2",
      "withdrawal_amount": "5000"
    })
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.serverResponse.should.keys(
        'type', 'message'
      );
      res.body.error.should.equal(false);
      done();
    });
  });
});

describe("Withdraw Money - amount greater than balance",function(){
  it("should return an error",function(done){
    server
    .put("/withdraw/")
    .send({
      "id": "2",
      "withdrawal_amount": "6000"
    })
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.serverResponse.should.keys(
        'type', 'message'
      );
      res.body.error.should.equal(true);
      done();
    });
  });
});
