'use strict'

const keyMap = require('key-map')
const stations = require('vbb-stations/full.json')

const analyze = require('..')

const applyToAll = () => {
	const mapping = keyMap(Object.keys(stations))
	const instructions = []

	for (let id1 in stations) {
		const s1 = stations[mapping.get(id1)]
		for (let id2 in stations) {
			if (id1 === id2) continue
			const s2 = stations[mapping.get(id2)]

			const res = analyze(s1, s2)
			if (!res) continue
			const {src, dest} = res

			if (res.op === analyze.MERGE) {
				mapping.map(src.id, dest.id)
				delete stations[src.id]
				instructions.push({op: res.op, src, stopName: res.stopName, dest})
			} else throw new Error('unsupported merge operation: ' + res.op)
		}
	}

	return {mapping, instructions}
}

module.exports = applyToAll
