'use strict';

/*
 * Trigonometry constants
 */
const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;
const EARTH_RADIUS = 6371000;
const EARTH_PERIMETER = 2 * Math.PI * EARTH_RADIUS; // 40030173.592

// Load modules
const Code = require('code');
const Lab = require('lab');

const EarthPixel = require('../lib');

// Test shortcuts

const { describe, it } = (exports.lab = Lab.script());
const expect = Code.expect;

// Common methods and objects
const locations = {
	NaN: {
		latitude: {
			latitude: 'NaN',
			longitude: 2
		},
		longitude: {
			latitude: 34,
			longitude: 'NaN'
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
const testLocationErrors = fn => {
	it('throws an error when calling key with wrong location (string)', () => {
		const ep = new EarthPixel(500);
		expect(() => ep[fn]('34.6,2.7')).to.throw(Error);
	});

	it('throws an error when calling key with wrong location (type)', () => {
		const ep = new EarthPixel(500);
		expect(() => ep[fn](locations.NaN.latitude)).to.throw(Error);
		expect(() => ep[fn](locations.NaN.longitude)).to.throw(Error);
	});

	it('throws an error when calling key with wrong location (missing)', () => {
		const ep = new EarthPixel(500);
		expect(() => ep[fn](locations.missing.latitude)).to.throw(Error);
		expect(() => ep[fn](locations.missing.longitude)).to.throw(Error);
	});

	it('throws an error when calling key with wrong location (too large)', () => {
		const ep = new EarthPixel(500);
		expect(() => ep[fn](locations.too_large.latitude)).to.throw(Error);
		expect(() => ep[fn](locations.too_large.longitude)).to.throw(Error);
	});

	it('throws an error when calling key with wrong location (too small)', () => {
		const ep = new EarthPixel(500);
		expect(() => ep[fn](locations.too_small.latitude)).to.throw(Error);
		expect(() => ep[fn](locations.too_small.longitude)).to.throw(Error);
	});
};
const roundFloat = value => {
	return +value.toFixed(8);
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
		const fn = () => new EarthPixel('NaN');
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
		const fn = () => new EarthPixel(EARTH_PERIMETER / 2);
		expect(fn).to.throw(Error);
	});

    it('throws an error if created with unknown type', () => {
        const fn = () => new EarthPixel(200, 'wrong');
        expect(fn).to.throw(Error);
    });

	it('should be crated with a valid width (number)', () => {
		const ep = new EarthPixel(500);
		expect(ep).to.be.an.instanceof(EarthPixel);
	});

	it('should be crated with a valid width (string)', () => {
		const ep = new EarthPixel('250');
		expect(ep).to.be.an.instanceof(EarthPixel);
	});
});

describe('Usage - Key', () => {
	testLocationErrors('key');

	it('returns a string when calling key', () => {
		const ep = new EarthPixel(0.1, 'degrees');
		expect(ep.key(locations.valid)).to.be.a.string();
	});

    it('returns a valid value when calling key', () => {
        const ep = new EarthPixel(0.5, 'degrees');
        const location = {
            latitude: 0.3,
            longitude: 0
        };
        expect(ep.key(location)).to.equal(`${(360).toString(16)}-${(180).toString(16)}-${(360).toString(16)}`);
    });

    it('returns a valid value when calling key on edge', () => {
        const ep = new EarthPixel(0.5, 'degrees');
        const location = {
            latitude: 90,
            longitude: -180
        };
        expect(ep.key(location)).to.equal(`${(360).toString(16)}-${(359).toString(16)}-${(0).toString(16)}`);
    });
});

describe('Usage - Center', () => {
	testLocationErrors('center');

	it('returns a valid object when calling center', () => {
		const ep = new EarthPixel(0.1, 'degrees');
		const center = ep.center(locations.valid);
		expect(center).to.be.an.object();
		expect(center.latitude).to.be.a.number();
		expect(center.longitude).to.be.a.number();
	});

	it('returns a valid value when calling center', () => {
		const ep = new EarthPixel(0.5, 'degrees');
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
		const ep = new EarthPixel(0.1, 'degrees');
		const get = ep.get(locations.valid);
		expect(get).to.be.an.object();
		expect(get.latitude).to.be.a.number();
		expect(get.longitude).to.be.a.number();
		expect(get.key).to.be.a.string();
	});

	it('returns a valid value when calling get', () => {
		const ep = new EarthPixel(0.5, 'degrees');
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

describe('Config', () => {
	it('returns a valid object when calling debug', () => {
		const ep = new EarthPixel(0.1, 'degrees');
		const debug = ep.debug();
		expect(debug).to.be.an.object();
		expect(debug.width).to.be.a.number();
		expect(debug.divisions).to.be.a.number();
	});

	it('returns a valid value when calling debug', () => {
		const ep = new EarthPixel(0.5, 'degrees');
		expect(ep.debug()).to.equal({
			width: 0.5,
			divisions: 360
		});
	});

    it('returns a valid value when calling debug', () => {
        const ep = new EarthPixel(0.8047, 'degrees');
        expect(ep.debug()).to.equal({
            width: roundFloat(180 / 224), // 0.8035714286
            divisions: 224
        });
    });

    it('converts meters to degrees correctly', () => {
        const ep = new EarthPixel(560, 'meters');
        expect(ep.debug()).to.equal({
            width: 0.00503609,
            divisions: 35742
        });
    });
});

describe('Values', () => {
	it('increases longitude along latitude for first pixels', () => {
		const longitude = 0;
		const ep = new EarthPixel(45000, 'meters');
		const { width } = ep.debug();
		let lastLongitude = roundFloat(width / 2);

		for (let latitude = 0; latitude <= 90; latitude = roundFloat(latitude + width)) {
			const prefix = `Current latitude = ${latitude}`;
			const expectedLatitude = latitude >= 90.0 ? roundFloat(latitude - roundFloat(width / 2)) : roundFloat(latitude + roundFloat(width / 2));
			const center = ep.center({
				latitude,
				longitude
			});
			expect(center).to.be.an.object();
			expect(center.latitude, prefix).to.equal(expectedLatitude);
			expect(center.longitude, prefix).to.be.least(lastLongitude);
			lastLongitude = center.longitude;
		}

		lastLongitude = roundFloat(width / 2);
		for (let latitude = -width; latitude >= -90; latitude = roundFloat(latitude - width)) {
			const prefix = `Current latitude = ${latitude}`;
			const expectedLatitude = roundFloat(latitude + roundFloat(width / 2));
			const center = ep.center({
				latitude,
				longitude
			});
			expect(center).to.be.an.object();
			expect(center.latitude, prefix).to.equal(expectedLatitude);
			expect(center.longitude, prefix).to.be.least(lastLongitude);
			lastLongitude = center.longitude;
		}
	});
	
    it('ensure all point in a pixel ends to its center', () => {
		
        const ep = new EarthPixel(0.05, 'degrees');
        const { width } = ep.debug();
        const _cos = Math.cos(roundFloat(width*200,5) * DEGREES_TO_RADIANS);
        
        const minLatitude = roundFloat(width * 200);
        const maxLatitude = roundFloat(width * 201);
        const minLongitude = 0;
        const maxLongitude = roundFloat(width / _cos);
        
        const step = 0.0005;
        
        const expected = ep.get({
            latitude: roundFloat(width*200,5),
            longitude: roundFloat(width / _cos) / 2
        });
        
        let _lat = minLatitude + step;
        while (_lat < maxLatitude) {
            let _lon = minLongitude + step;
            while (_lon < maxLongitude) {
            	const result = ep.get({
                    latitude: _lat,
                    longitude: _lon
                });
                const prefix = `Current position = ${_lat},${_lon}`;
                expect(result, prefix).to.be.an.object();
                expect(result.latitude, prefix).to.equal(expected.latitude);
                expect(result.longitude, prefix).to.equal(expected.longitude);
                expect(result.key, prefix).to.equal(expected.key);
                _lon += step;
            }
            _lat += step;
		}
    });
});
