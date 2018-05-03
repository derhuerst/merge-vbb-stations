'use strict'

const stations = require('vbb-stations')
const test = require('tape')

const analyse = require('.')

// merge
const turmstrBus = stations('900000003174')[0]
const turmstr = stations('900000003104')[0]
const straussbergTram = stations('900000320010')[0]
const straussberg = stations('900000320004')[0]
const hirteStr = stations('900000180016')[0]
const hirteStrasse = stations('900000180716')[0]
const yorckstrSbahn = stations('900000058103')[0]
const yorckstr = stations('900000057103')[0]
const stadtmitte = stations('900000100011')[0]
const stadtmitteU2 = stations('900000100701')[0]

// don't merge
const chorinDorf = stations('900000350316')[0]
const chorinBhf = stations('900000350125')[0]
const gulow3 = stations('900000215367')[0]
const gulow2 = stations('900000215366')[0]
const krausenStr = stations('900000100018')[0]
const leipzigerStr = stations('900000100528')[0]

test('should not merge if too far', (t) => {
	const a = {
		type: 'station',
		id: 'a',
		name: 'a',
		location: {
			type: 'location',
			latitude: 52.5,
			longitude: 13.5
		}
	}
	const b = {
		type: 'station',
		id: 'b',
		name: 'b',
		location: {
			type: 'location',
			latitude: 52.6,
			longitude: 13.6
		}
	}

	t.equal(analyse(a, b), null)
	t.end()
})

test('should merge "U Turmstr. [Bus Turmstr.]" as "Bus Turmstr." into "U Turmstr."', (t) => {
	const op = analyse(turmstrBus, turmstr)
	t.ok(op, 'does not return a merge op')
	t.equal(op.op, analyse.MERGE)
	t.equal(op.src, turmstrBus)
	t.equal(op.dest, turmstr)
	t.equal(op.stopName, 'Bus Turmstr.')
	t.end()
})

test('should merge "Hirtestr." and "Hirtestraße"', (t) => {
	const op = analyse(hirteStr, hirteStrasse)
	t.ok(op, 'does not return a merge op')
	t.equal(op.op, analyse.MERGE)
	t.equal(op.src, hirteStrasse)
	t.equal(op.dest, hirteStr)
	t.equal(op.stopName, null) // use stop's original name
	t.end()
})

test('should merge "S Strausberg [Tram]" as "Tram" into "S Strausberg Bhf"', (t) => {
	const op = analyse(straussbergTram, straussberg)
	t.ok(op, 'does not return a merge op')
	t.equal(op.op, analyse.MERGE)
	t.equal(op.src, straussbergTram)
	t.equal(op.dest, straussberg)
	t.equal(op.stopName, 'Tram')
	t.end()
})

test('should merge "Berlin, U Stadtmitte U2" as into "U Stadtmitte"', (t) => {
	const op = analyse(stadtmitteU2, stadtmitte)
	t.ok(op, 'does not return a merge op')
	t.equal(op.op, analyse.MERGE)
	t.equal(op.src, stadtmitteU2)
	t.equal(op.dest, stadtmitte)
	t.equal(op.stopName, 'U2')
	t.end()
})

test('should merge with trimmed stop name', (t) => {
	const op = analyse(yorckstrSbahn, yorckstr)
	t.ok(op, 'does not return a merge op')
	t.equal(op.stopName, op.stopName.trim())
	t.end()
})

test('should not merge "Chorin, Dorf" and "Chorin, Bhf"', (t) => {
	t.equal(analyse(chorinDorf, chorinBhf), null, 'returns a merge op')
	t.end()
})

test('should not merge "Gulow I" and "Gulow II"', (t) => {
	t.equal(analyse(gulow3, gulow2), null, 'returns a merge op')
	t.end()
})

test('should not merge "U Stadtmitte/Krausenstr." and "U Stadtmitte/Leipziger Str."', (t) => {
	t.equal(analyse(krausenStr, leipzigerStr), null, 'returns a merge op')
	t.end()
})
