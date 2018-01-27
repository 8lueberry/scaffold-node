const sinon = require('sinon');
const chai = require('chai');

chai.use(require('chai-http'));
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.use(require('dirty-chai'));

// export globally
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
