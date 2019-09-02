process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const User = require('../models/userModel.js');
chai.use(chaiHttp)

beforeEach(done => {
    User.deleteMany({})
        .then(result => {
            console.log('beforeEach Success')
            console.log(result)
            done();
        })
        .catch(err => {
            console.log('beforeEach Failed')
            console.log(err)
        })
});

afterEach(done => {
    User.deleteMany({})
        .then(result => {
            console.log('afterEach Success')
            console.log(result)
            done();
        })
        .catch(err => {
            console.log('afterEach Failed')
            console.log(err)
        })
})

describe('CREATE user', ()=> {
    it('It should create an user', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send({
                username: "wlmchrstn",
                email: "wlmchrstn@gmail.com",
                password: User.generateHash('123456789')
            })
            .end((err, res) => {
                console.log(res.body)
                expect(res.status).to.equal(201);
                done();
            });
    });
});

describe('LOGIN user', ()=> {
    it('It should login user', (done)=> {
        let pwd = User.generateHash('123456789')
        let testUser = {
            username: 'testuser',
            email: 'testuser@gmail.com',
            password: pwd
        }
        User.create(testUser)
        User.findOne({username: testUser.username})
        User.login(testUser.password, pwd)
        chai.request(app)
            .post('/api/user/login')
            .send({
                username: 'testuser',
                password: '123456789'
            })
            .end((err, res)=> {
            });
        });
});
