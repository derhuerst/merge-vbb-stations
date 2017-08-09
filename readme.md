# merge-vbb-stations

**Heuristic to find [VBB](https://en.wikipedia.org/wiki/Verkehrsverbund_Berlin-Brandenburg) stations & stops that should be one.** Check out [the automatic report](https://derhuerst.github.io/merge-vbb-stations/)!

[![npm version](https://img.shields.io/npm/v/merge-vbb-stations.svg)](https://www.npmjs.com/package/merge-vbb-stations)
[![build status](https://img.shields.io/travis/derhuerst/merge-vbb-stations.svg)](https://travis-ci.org/derhuerst/merge-vbb-stations)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/merge-vbb-stations.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install merge-vbb-stations
```


## Usage

```js
const analyze = require('merge-vbb-stations')

const s1 = {
	type: 'station',
	id: '900000003174',
	name: 'U Turmstr. (Berlin) [Bus Turmstr.]',
	coordinates: {latitude: 52.5263, longitude: 13.341988},
	weight: 5533.75,
	stops: [
		{
			type: 'stop',
			id: '070101000700',
			name: 'U Turmstr. (Berlin) [Bus Turmstr.]',
			station: '900000003174',
			coordinates: {latitude: 52.5263, longitude: 13.341988}
		}
		// …
	]
}

const s2 = {
	type: 'station',
	id: '900000003104',
	name: 'U Turmstr. (Berlin)',
	coordinates: {latitude: 52.525938, longitude: 13.341417},
	weight: 2408,
	stops: [
		{
			type: 'stop',
			id: '070201092701',
			name: 'U Turmstr. (Berlin)',
			station: '900000003104',
			coordinates: {latitude: 52.525938, longitude: 13.341417}
		}
	]
}

analyze(s1, s2)
```

```js
{
	op: 'merge',
	src: /* s1 */,
	dest: /* s2 */,
	stopName: 'Bus Turmstr.'
}
```

## API

`analyze(station1, station2)` will return either `null` (don't merge) or an object. The object looks like this:

- `op`: right now, this can only be `analyze.MERGE`
- `src`: station to merge from
- `dest`: station to merge into
- `stopName`: which name to use for the stops of `src`; if `null`, use the stops's original name

todo: `s1.coordinates` & `s2.coordinates`


## Contributing

If you have a question or have difficulties using `merge-vbb-stations`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/merge-vbb-stations/issues).
