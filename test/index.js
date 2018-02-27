'use strict';

/*
 * Trigonometry constants
 */
const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;

// Load modules
const Code = require('code');
const Lab = require('lab');

const EarthPixel = require('../lib');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

// Common methods and objects
const locations = {
    NaN: {
        latitude: {
            latitude: "NaN",
            longitude: 2
        },
        longitude: {
            latitude: 34,
            longitude: "NaN"
        }
    },
    missing: {
        latitude: {
            longitude: 2
        },
        longitude: {
            latitude: 34
        }
    },
    too_large: {
        latitude: {
            latitude: 91,
            longitude: 2
        },
        longitude: {
            latitude: 34,
            longitude: 181
        }
    },
    too_small: {
        latitude: {
            latitude: -91,
            longitude: 2
        },
        longitude: {
            latitude: 34,
            longitude: -181
        }
    },
    valid: {
        latitude: 34,
        longitude: 2
    }
};
const testLocationErrors = (fn) => {

    it('throws an error when calling key with wrong location (string)', () => {

        const ep = new EarthPixel(0.1);
        expect(() => ep[fn]("34.6,2.7")).to.throw(Error);
    });

    it('throws an error when calling key with wrong location (type)', () => {

        const ep = new EarthPixel(0.1);
        expect(() => ep[fn](locations.NaN.latitude)).to.throw(Error);
        expect(() => ep[fn](locations.NaN.longitude)).to.throw(Error);
    });

    it('throws an error when calling key with wrong location (missing)', () => {

        const ep = new EarthPixel(0.1);
        expect(() => ep[fn](locations.missing.latitude)).to.throw(Error);
        expect(() => ep[fn](locations.missing.longitude)).to.throw(Error);
    });

    it('throws an error when calling key with wrong location (too large)', () => {

        const ep = new EarthPixel(0.1);
        expect(() => ep[fn](locations.too_large.latitude)).to.throw(Error);
        expect(() => ep[fn](locations.too_large.longitude)).to.throw(Error);
    });

    it('throws an error when calling key with wrong location (too small)', () => {

        const ep = new EarthPixel(0.1);
        expect(() => ep[fn](locations.too_small.latitude)).to.throw(Error);
        expect(() => ep[fn](locations.too_small.longitude)).to.throw(Error);
    });
};

describe('Creation', () => {

    it('throws an error if not created with new', () => {

        const fn = () => EarthPixel();
        expect(fn).to.throw(Error);
    });

    it('throws an error if created without width', () => {

        const fn = () => new EarthPixel(undefined);
        expect(fn).to.throw(Error);
    });

    it('throws an error if created with invalid width (text)', () => {

        const fn = () => new EarthPixel("NaN");
        expect(fn).to.throw(Error);
    });

    it('throws an error if created with invalid width (zero)', () => {

        const fn = () => new EarthPixel(0);
        expect(fn).to.throw(Error);
    });

    it('throws an error if created with invalid width (negative)', () => {

        const fn = () => new EarthPixel(-1);
        expect(fn).to.throw(Error);
    });

    it('throws an error if created with invalid width (too large)', () => {

        const fn = () => new EarthPixel(220);
        expect(fn).to.throw(Error);
    });

    it('should be crated with a valid width (number)', () => {

        const ep = new EarthPixel(0.1);
        expect(ep).to.be.an.instanceof(EarthPixel);
    });

    it('should be crated with a valid width (string)', () => {

        const ep = new EarthPixel("0.6");
        expect(ep).to.be.an.instanceof(EarthPixel);
    });

});

describe('Usage - Key', () => {

    testLocationErrors('key');

    it('returns a string when calling key', () => {

        const ep = new EarthPixel(0.1);
        expect(ep.key(locations.valid)).to.be.a.string();
    });

    it('returns a valid value when calling key', () => {

        const ep = new EarthPixel(0.5);
        const location = {
            latitude: 0.3,
            longitude: 0
        };
        expect(ep.key(location)).to.equal(`${(360).toString(16)}-${(180).toString(16)}-${(360).toString(16)}`);
    });

});

describe('Usage - Center', () => {

    testLocationErrors('center');

    it('returns a valid object when calling center', () => {

        const ep = new EarthPixel(0.1);
        const center = ep.center(locations.valid);
        expect(center).to.be.an.object();
        if (center) {
            expect(center.latitude).to.be.a.number();
            expect(center.longitude).to.be.a.number();
        }
    });

    it('returns a valid value when calling center', () => {

        const ep = new EarthPixel(0.5);
        const location = {
            latitude: 0.3,
            longitude: 34
        };
        expect(ep.center(location)).to.equal({
            latitude: 0.25,
            longitude: 34.25
        });
    });

});

describe('Usage - Get', () => {

    testLocationErrors('get');

    it('returns a valid object when calling get', () => {

        const ep = new EarthPixel(0.1);
        const get = ep.get(locations.valid);
        expect(get).to.be.an.object();
        if (get) {
            expect(get.latitude).to.be.a.number();
            expect(get.longitude).to.be.a.number();
            expect(get.key).to.be.a.string();
        }
    });

    it('returns a valid value when calling get', () => {

        const ep = new EarthPixel(0.5);
        const location = {
            latitude: 0.3,
            longitude: 23
        };
        expect(ep.get(location)).to.equal({
            latitude: 0.25,
            longitude: 23.25,
            key: `${(360).toString(16)}-${(180).toString(16)}-${(406).toString(16)}`
        });
    });

});
