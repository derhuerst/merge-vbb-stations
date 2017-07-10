'use strict'

const stations = require('vbb-stations')
const test = require('tape')

const analyse = require('.')

const turmstrBus = stations('900000003174')[0]
const turmstr = stations('900000003104')[0]
const chorinDorf = stations('900000350316')[0]
const chorinBhf = stations('900000350125')[0]
const gulow1 = stations('900000215367')[0]
const gulow2 = stations('900000215366')[0]
const krausenStr = stations('900000100018')[0]
const leipzigerStr = stations('900000100528')[0]

test('should not merge if too far', (t) => {
	const a = {
		type: 'station', id: 'a', name: 'a',
		coordinates: {latitude: 52.5, longitude: 13.5}
	}
	const b = {
		type: 'station', id: 'b', name: 'b',
		coordinates: {latitude: 52.6, longitude: 13.6}
	}

	t.equal(analyse(a, b), null)
	t.end()
})

test('should merge "U Turmstr. [Bus Turmstr.]" into "U Turmstr."', (t) => {
	t.deepEqual(analyse(turmstrBus, turmstr), {
		op: analyse.MERGE, src: turmstrBus, dest: turmstr, useStationName: true
	})
	t.end()
})

test('should not merge "Chorin, Dorf" and "Chorin, Bhf"', (t) => {
	t.equal(analyse(chorinDorf, chorinBhf), null, 'returns a merge op')
	t.end()
})

test('should not merge "Gulow I" and "Gulow II"', (t) => {
	t.equal(analyse(gulow1, gulow2), null, 'returns a merge op')
	t.end()
})

test('should not merge "U Stadtmitte/Krausenstr." and "U Stadtmitte/Leipziger Str."', (t) => {
	t.equal(analyse(krausenStr, leipzigerStr), null, 'returns a merge op')
	t.end()
})
