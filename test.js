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
const hirteStr2 = stations('900000180716')[0]
const yorckstrSbahn = stations('900000058103')[0]
const yorckstr = stations('900000057103')[0]
const karlshorst = stations('900000162001')[0]
const karlshorstWandlitzstr = stations('900000162501')[0]

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

test('should merge "Hirtestr." and "Hirtestr."', (t) => {
	const op = analyse(hirteStr2, hirteStr)
	t.ok(op, 'does not return a merge op')
	t.equal(op.op, analyse.MERGE)
	t.equal(op.src, hirteStr2)
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

// These are now run at subsequently by M17, 27 & 37.
test.skip('should merge "S Karlshorst /Wandlitzstr." as "Wandlitzstr." into "S Karlshorst"', (t) => {
	const op = analyse(karlshorstWandlitzstr, karlshorst)
	t.ok(op, 'does not return a merge op')
	t.equal(op.op, analyse.MERGE)
	t.equal(op.src, karlshorstWandlitzstr)
	t.equal(op.dest, karlshorst)
	t.equal(op.stopName, 'Wandlitzstr.')
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
