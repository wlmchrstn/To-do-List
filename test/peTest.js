process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const User = require('../models/userModel.js');
chai.use(chaiHttp)

var usertest = {
    username: "prototype2",
    email: "prototype2@gmail.com",
    password: User.generateHash('prototype')
}
var login = {
    username: "prototype2",
    password: 'prototype'
}
var todotest = {
    title: "integration testing",
    status: false,
    dueDate: "besok",
    body: "harus siap"
}

beforeEach(done => {
    User.create(usertest)
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
            done();
        })
});

beforeEach(done => {
    chai.request(app)
        .post('/api/user/login')
        .send(login)
        .end((err, res) => {
            expect(res.status).to.equal(200)
            token = `Bearer ${res.body.result}`
            done();
        })
})
beforeEach(done => {
    chai.request(app)
        .post('/api/user/todo/create')
        .set('authorization', token)
        .send(todotest)
        .end((err, res) => {
            expect(res.status).to.equal(201)
            todoId = res.body.result._id
            done();
        })
})
afterEach(done => {
    User.deleteMany({})
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
})

describe("USER'S PROTECTED ENDPOINT TEST", ()=> {

    it("It should get user's details", (done)=> {
        chai.request(app)
            .get('/api/user/show')
            .set('authorization', token)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                done();
            })
        })
    
    it("It should create user's todo list", (done) => {

        chai.request(app)
            .post('/api/user/todo/create')
            .set('authorization', token)
            .send({
                title: "TEST123",
                status: true,
                dueDate: "TEST123",
                body: "TEST123"
            })
            .end((err, res) => {
                expect(res.status).to.equal(201)
                done();
            })
    })

    it("It should get all user's todo list", (done) => {
        chai.request(app)
            .get('/api/user/todo/show')
            .set('authorization', token)
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(200)
                done();
            })
    })

    it("It should get user's todo list details", (done) => {
        chai.request(app)
            .get(`/api/user/todo/show/${todoId}`)
            .set('authorization', token)
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(200)
                done();
            })
    })

    it("It should update user's todo list", (done) => {
        chai.request(app)
            .put(`/api/user/todo/update/${todoId}`)
            .set('authorization', token)
            .send({
                status: true
            })
            .end((err, res) => {
                expect(res.status).to.equal(200)
                done();
            })
    })
    
    it("It should delete user's todo list", (done) => {
        chai.request(app)
            .delete(`/api/user/todo/delete/${todoId}`)
            .set('authorization', token)
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(200)
                done();
            })
    })
})

describe("USER'S AUTHENTICATION NEGATIVE CASE", ()=> {

    it("Please insert token", (done) => {
        chai.request(app)
            .get('/api/user/show')
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(401)
                done();
            })
    })
    
    it("Invalid token", (done) => {
        chai.request(app)
            .get('/api/user/show')
            .set('authorization', 'Bearer token')
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(403)
                done();
            })
    })
})

describe("TODO NEGATIVE CASE", () => {
    
    it("Unexpected error", (done) => {
        chai.request(app)
            .post('/api/user/todo/create')
            .set('authorization', token)
            .send({
                contoh: "salah"
            })
            .end((err, res) => {
                expect(res.status).to.equal(422)
                done();
            })
    })

    it("Failed to update because to do list not found", (done) => {
        chai.request(app)
            .put('/api/user/todo/update/asdfghjkl')
            .set('authorization', token)
            .send({
                contoh: "salah"
            })
            .end((err, res) => {
                expect(res.status).to.equal(404)
                done();
            })
    })
})
