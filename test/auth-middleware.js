const expect = require('chai').expect;
const sinon = require('sinon');

const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', () => {
    it('should throw an error if no authorization header is present', () => {
        const req = {
            get: function () {
                return null;
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw(
            'Not authenticated.'
        );
    });

    it('should yield userId', () => {
        const req = {
            get: function () {
                return 'Bear abcdef';
            }
        }
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        authMiddleware(req, {}, () => { });
        expect(req).to.have.property('userId', 'abc');
        jwt.verify.restore();
    });
});

