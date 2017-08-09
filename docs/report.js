'use strict'

const keyMap = require('key-map')
const stations = require('vbb-stations/full.json')

const analyze = require('..')

const mapping = keyMap(Object.keys(stations))
const nrOfStationsBefore = Object.keys(stations).length

for (let id1 in stations) {
	const s1 = stations[mapping.get(id1)]
	for (let id2 in stations) {
		if (id1 === id2) continue
		const s2 = stations[mapping.get(id2)]

		const res = analyze(s1, s2)
		if (!res) continue
		const {src, dest} = res

		if (res.op === analyze.MERGE) {
			const stopName = res.stopName || '[stop name]'
			console.info(src.id, src.name, 'as', stopName, 'into', dest.id, dest.name)
			mapping.map(src.id, dest.id)
			delete stations[src.id]
		} else console.error('unsupported merge operation: ' + res.op)
	}
}
