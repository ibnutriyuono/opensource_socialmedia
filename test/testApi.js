const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('API Testing', () => {

    it('it should success to retrieve all data', (done) => {
        chai.request('localhost:5000')
            .get('/api/users/test')
            .end((err, res) => {
                expect(res.body).to.have.status(200);
                expect(res.body).to.have.property('msg');
            });
    done();
    });

});