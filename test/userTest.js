process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const User = require('../models/userModel.js');
const faker = require('faker');
const jwt = require('jsonwebtoken');
chai.use(chaiHttp);

var randomName = faker.internet.userName();
var randomEmail = faker.internet.email();
var randomPwd = faker.internet.password();

const hashedPwd = User.generateHash(randomPwd)

var randomUser = {
    username: randomName,
    email: randomEmail,
    password: hashedPwd
}

// beforeEach(done => {
//     User.create(randomUser)
//         .then(data => {
//         console.log(data)
//         })
//         done();
// });

// beforeEach(done => {
//     User.deleteMany({})
//         .then(result => {
//         console.log(result)
//         })
//         done();
// });

// beforeEach(done => {
//     User.deleteMany({}, (err, result) => {
//         console.log(result)
//         done();
//     })
// })

beforeEach(done => {
    User.deleteMany({}, (err, result) => {
        console.log(result)
    })
    done();
})

describe('CREATE user path', () => {
    it('It should create an user', (done)=> {
        chai.request(app)
            .post('/api/user/create')
            .send(randomUser)
            .end((err, res)=> {
                expect(res.status).to.equal(201);
                done();
            });
    });
});

describe('LOGIN user path', ()=> {
    it('It should login user', ()=> {
        let pwd = User.generateHash('123456789')
        let testUser = {
            username: 'testuser',
            email: 'testuser@gmail.com',
            password: pwd
        }
        User.create(testUser, (data) => {
            User.findOne({username: data.username}, (result) => {
                User.login(data.password, result.password)
                chai.request(app)
                    .post('/api/user/login')
                    .send()
                    .end((err, res)=> {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
        });
    });
});

describe('SHOW user path', ()=> {
    it('It should get user details', ()=> {
        let pwd2 = User.generateHash('qwertyuiop')
        let test2User = {
            username: 'test2user',
            email: 'test2@gmail.com',
            password: pwd2
        }
        User.create(test2User, (data) => {
            User.findOne({username: data.username}, (result) => {
                User.login(data.password, result.password, ()=> {
                    let token = jwt.sign({_id: data._id}, process.env.DBLOGIN)
                    const spt = token.split(" ")
                    const verified = jwt.verify(spt[1], process.env.DBLOGIN);
                    chai.request(app)
                        .get('/api/user/show')
                        .set('authorization', `Bearer ${verified}`)
                        .send()
                        .end((err, res)=> {
                            expect(res.status).to.equal(200)
                            done();
                        });
                });
            });
        });
    });
});

describe('UPDATE user path', ()=> {
    it('It should update user details', ()=> {
        let pwd3 = User.generateHash('zxcvbnm')
        let test3user = {
            username: 'test3user',
            email: 'test3user.gmail.com',
            password: pwd3
        }
        User.create(test3user, (data)=> {
            User.findOne({username: data.username}, (result)=> {
                User.login(data.password, result.password, ()=> {
                    let token = jwt.sign({_id: data._id}, process.env.DBLOGIN)
                    const spt = token.split(" ")
                    const verified = jwt.verify(spt[1], process.env.DBLOGIN);
                    chai.request(app)
                        .get('/api/user/update')
                        .set('authorization', `Bearer ${verified}`)
                        .send({
                            username: 'test4user',
                            email: 'test4user@gmail.com',
                            password: "mnbvcxz"
                        })
                        .end((err, res)=> {
                            expect(res.status).to.equal(200)
                            done();
                        });
                })
            })
        })
    })
})

// describe('UPDATE user path', ()=> {
//     it('It should update user details', ()=> {
//         let pwd3 = User.generateHash('asdfghjkl')
//         let test3User = {
//             username: 'test3user',
//             email: 'test3@gmail.com',
//             password: pwd3
//         }
//         User.create(test3User, (data) => {
//             console.log(data)
//             User.findOne({username: data.username}, (result) => {
//                 User.login(data.password, result.password, ()=> {
//                     let token = jwt.sign({_id: data._id}, process.env.DBLOGIN)
//                     const spt = token.split(" ")
//                     const verified = jwt.verify(spt[1], process.env.DBLOGIN);
//                     chai.request(app)
//                         .put('/api/user/update')
//                         .set('authorization', `Bearer ${verified}`)
//                         .send({
//                             username: 'wlmchrstn',
//                             email: 'wlmchrstn@gmail.com',
//                             password: '123456789'
//                         })
//                         .end((err, res)=> {
//                             expect(res.status).to.equal(200)
//                             done();
//                         });
//                 });
//             });
//         });
//     });
// });
