let Item = require('./../models/User');

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

// describe('Items', () => {
//     beforeEach((done) => {
//         Item.remove({}, (err) => {
//             done();
//         });
//     });
   

// });

describe('/GET item', () => {
    it('it should GET perticular item', (done) => {
        chai.request("http://localhost:5000")
            .get('/api/users/test')
            .end((err, res) => {
                res.body.should.have.property('msg')
                    // .which.is.an('object')
                    // .and.has.property('_id')
                done();
            });
    });
});