'use strict'

const linesAt = require('vbb-lines-at')
const distance = require('gps-distance')
const shorten = require('vbb-short-station-name')
const leven = require('leven')

const MERGE = 'merge'

const analyse = (s1, s2) => {
	if (s1.id === s2.id) return null // they seem to be the same

	// don't merge stops with stations
	if (s1.type !== s2.type) return null

	const c1 = s1.coordinates
	const c2 = s2.coordinates
	const km = distance(c1.latitude, c1.longitude, c2.latitude, c2.longitude)

	// cheap cutoff: stations more than 250m apart can be ignored
	if (km >= .25) return null

	const n1 = shorten(s1.name)
	const n2 = shorten(s2.name)
	const sS = n1.length < n2.length ? s1 : s2 // station with shorter name
	const sL = n1.length < n2.length ? s2 : s1 // station with longer name

	const linesAt1 = linesAt[s1.id].map((l) => l.id)
	const linesAt2 = linesAt[s2.id].map((l) => l.id)

	if (n1 === n2) {
		const withMoreLines = linesAt1.length > linesAt2.length ? s1 : s2
		const withLessLines = linesAt1.length > linesAt2.length ? s2 : s1
		return {
			op: MERGE,
			src: withLessLines, dest: withMoreLines,
			useStationName: false
		}
	}

	const commonLines = linesAt1.some((l) => linesAt2.includes(l))
	if (commonLines) return null // more likely to be subsequent stations

	const sN = n1.length < n2.length ? n1 : n2 // short name
	const lN = n1.length < n2.length ? n2 : n1 // long name
	const haveSameStem = lN.slice(0, sN.length) === sN

	// find "U FooBar" & "U FooBar Baz", ignore "U Foostr." & "U Foostr./Barstr."
	if (haveSameStem && lN[sN.length] !== '/') {
		// always merge into the station with the shorter name
		return {op: MERGE, src: sL, dest: sS, useStationName: true}
	}

	const nameDifference = leven(n1, n2)
	if (nameDifference === 1 && km <= .15) {
		// todo: find a better heuristic
		// always merge into the station with the shorter name
		return {op: MERGE, src: sL, dest: sS, useStationName: true}
	}

	return null
}

module.exports = Object.assign(analyse, {MERGE})
