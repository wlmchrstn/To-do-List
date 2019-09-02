process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const User = require('../models/userModel.js');
chai.use(chaiHttp)

var usertest = {
    username: "prototype1",
    email: "prototype1@gmail.com",
    password: User.generateHash('prototype')
}

var login = {
    username: "prototype1",
    password: "prototype"
}

before(done => {
    User.deleteMany({})
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
})

beforeEach(done => {
    User.create(usertest)
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
});

after(done => {
    User.deleteMany({})
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
})

describe('USER OPERATION', ()=> {
    it('It should create an user', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "satuduatiga",
                email: "123@gmail.com",
                password: "satu23"
            })
            .end((err, res) => {
                expect(res.status).to.equal(201);
                done();
            });
    });

    it('It should login user', (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send(login)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done();
            });
        });
});

// For NEGATIVE CASE

describe('USER CREATE NEGATIVE CASE', ()=> {

    it("Username already taken", (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype1",
                email: "prototype3@gmail.com",
                password: User.generateHash('prototype')
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done();
            })
    })
    
    it("Email already taken", (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype3",
                email: "prototype1@gmail.com",
                password: User.generateHash('prototype')
            })
            .end((err, res)=> {
                expect(res.status).to.equal(400)
                done();
            })
    })

    it("Please fullfill requirement", (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "prototype3",
                password: User.generateHash('prototype')
            })
            .end((err, res) => {
                expect(res.status).to.equal(417)
                done();
            })
    })

    it("Unexpected Error", (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "1234",
                email: "1234@gmail.com",
                password: 1234
            })
            .end((err, res) => {
                expect(res.status).to.equal(500)
                done();
            })
    })
})

describe("USER LOGIN NEGATIVE CASE", ()=> {

    it("Incorrect Password", (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "prototype1",
                password: "incorrect"
            })
            .end((err, res) => {
                expect(res.status).to.equal(403)
                done();
            })
    })

    it("Please insert passsword", (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "prototype1"
            })
            .end((err, res) => {
                expect(res.status).to.equal(403)
                done();
            })
    })

    it("User not found", (done)=> {
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: "notfound",
                password: "prototype1"
            })
            .end((err, res) => {
                expect(res.status).to.equal(404)
                done();
            })
    })
})
