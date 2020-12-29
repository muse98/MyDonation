/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyDonationContract extends Contract {

    async myDonationExists(ctx, myDonationId) {
        const buffer = await ctx.stub.getState(myDonationId);
        return (!!buffer && buffer.length > 0);
    }

    async createMyDonation(ctx, myDonationId, value) {
        const exists = await this.myDonationExists(ctx, myDonationId);
        if (exists) {
            throw new Error(`The my donation ${myDonationId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myDonationId, buffer);
    }

    async readMyDonation(ctx, myDonationId) {
        const exists = await this.myDonationExists(ctx, myDonationId);
        if (!exists) {
            throw new Error(`The my donation ${myDonationId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myDonationId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMyDonation(ctx, myDonationId, newValue) {
        const exists = await this.myDonationExists(ctx, myDonationId);
        if (!exists) {
            throw new Error(`The my donation ${myDonationId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myDonationId, buffer);
    }

    async deleteMyDonation(ctx, myDonationId) {
        const exists = await this.myDonationExists(ctx, myDonationId);
        if (!exists) {
            throw new Error(`The my donation ${myDonationId} does not exist`);
        }
        await ctx.stub.deleteState(myDonationId);
    }

}

module.exports = MyDonationContract;
