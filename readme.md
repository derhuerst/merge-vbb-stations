# merge-vbb-stations

[![Greenkeeper badge](https://badges.greenkeeper.io/derhuerst/merge-vbb-stations.svg)](https://greenkeeper.io/)

**Heuristic to find [VBB](https://en.wikipedia.org/wiki/Verkehrsverbund_Berlin-Brandenburg) stations & stops that should be one.**

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
	id: '900000009202',
	name: 'U Osloer Str.',
	coordinates: {latitude: 52.556938, longitude: 13.373284},
	stops: [
		{
			type: 'stop',
			id: '070101000950',
			name: 'U Osloer Str.',
			coordinates: {latitude: 52.556938, longitude: 13.373284},
			station: '900000009202'
		}
		// …
	]
}

const s2 = {
	type: 'station',
	id: '900000009272', // different id
	name: 'U Osloer  Str.', // two spaces!
	coordinates: {latitude: 52.558016, longitude: 13.372492}, // different coords
	stops: [
		{
			type: 'stop',
			id: '070101001584',
			name: 'U Osloer  Str.',
			coordinates: {latitude: 52.558016, longitude: 13.372492},
			station: '900000009272'
		}
		// …
	]
}

analyze(s1, s2)
```

`analyze` will return either `null` (don't merge) or an array. The array my look like this:

- `[analyze.MERGE]`: merge the stops of `s1` and `s2`, keep the stop names, todo: `s1.coordinates` & `s2.coordinates`
- `[analyze.MERGE_AS_STOP, src, dest]`: add all stops of `src` to `dest`, use `dest.name` as stop name


## Contributing

If you have a question or have difficulties using `merge-vbb-stations`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/merge-vbb-stations/issues).
