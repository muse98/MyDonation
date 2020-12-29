/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MyDonationContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MyDonationContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MyDonationContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my donation 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my donation 1002 value"}'));
    });

    describe('#myDonationExists', () => {

        it('should return true for a my donation', async () => {
            await contract.myDonationExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my donation that does not exist', async () => {
            await contract.myDonationExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMyDonation', () => {

        it('should create a my donation', async () => {
            await contract.createMyDonation(ctx, '1003', 'my donation 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my donation 1003 value"}'));
        });

        it('should throw an error for a my donation that already exists', async () => {
            await contract.createMyDonation(ctx, '1001', 'myvalue').should.be.rejectedWith(/The my donation 1001 already exists/);
        });

    });

    describe('#readMyDonation', () => {

        it('should return a my donation', async () => {
            await contract.readMyDonation(ctx, '1001').should.eventually.deep.equal({ value: 'my donation 1001 value' });
        });

        it('should throw an error for a my donation that does not exist', async () => {
            await contract.readMyDonation(ctx, '1003').should.be.rejectedWith(/The my donation 1003 does not exist/);
        });

    });

    describe('#updateMyDonation', () => {

        it('should update a my donation', async () => {
            await contract.updateMyDonation(ctx, '1001', 'my donation 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my donation 1001 new value"}'));
        });

        it('should throw an error for a my donation that does not exist', async () => {
            await contract.updateMyDonation(ctx, '1003', 'my donation 1003 new value').should.be.rejectedWith(/The my donation 1003 does not exist/);
        });

    });

    describe('#deleteMyDonation', () => {

        it('should delete a my donation', async () => {
            await contract.deleteMyDonation(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my donation that does not exist', async () => {
            await contract.deleteMyDonation(ctx, '1003').should.be.rejectedWith(/The my donation 1003 does not exist/);
        });

    });

});