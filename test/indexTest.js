process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
chai.use(chaiHttp)

describe("API BASE HOME", ()=> {
    it("GET HOME ENDPOINT", (done)=> {
        chai.request(app)
            .get('/')
            .send()
            .end((err, res) => {
                expect(res).to.be.an('object')
                done();
            })
    })
})