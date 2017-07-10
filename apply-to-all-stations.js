'use strict'

const keyMap = require('key-map')
const stations = require('vbb-stations/full.json')

const analyze = require('.')

const mapping = keyMap(Object.keys(stations))
const nrOfStationsBefore = Object.keys(stations).length

for (let id1 in stations) {
	const s1 = stations[mapping.get(id1)]
	for (let id2 in stations) {
		if (id1 === id2) continue
		const s2 = stations[mapping.get(id2)]

		const res = analyze(s1, s2)
		if (!res) continue

		if (res.op === analyze.MERGE) {
			console.info('merge', res.src.id, res.src.name, 'into', res.dest.id, res.dest.name, 'use station name?', res.useStationName)
			mapping.map(res.src.id, res.dest.id)
			delete stations[res.src.id]
		} else console.error('unsupported merge operation: ' + res.op)
	}
}
