'use strict'

const distance = require('gps-distance')
const leven = require('leven')

const JOIN = 'join'

const _ = (n) => +n.toFixed(3)

const analyse = (s1, s2) => {
	// don't merge stops with stations
	if (s1.type !== s2.type) return null

	const c1 = s1.coordinates
	const c2 = s2.coordinates
	const km = distance(c1.latitude, c1.longitude, c2.latitude, c2.longitude)

	// cheap cutoff: stations more than 250m apart can be ignored
	if (km >= .25) return null

	const nameDifference = leven(s1.name, s2.name)

	if (nameDifference === 0) return JOIN
	if (nameDifference === 1 && km <= .15) {
		// todo: decide which direction to merge
		return JOIN
	}

	const sN = s1.name.length < s2.name.length ? s1.name : s2.name // short name
	const lN = s1.name.length < s2.name.length ? s2.name : s1.name // long name
	const nameSimilarity = sN.length / lN.length
	const haveSameStem = lN.slice(0, sN.length) === sN

	// find "U FooBar" & "U FooBar Baz", ignore "U Foostr." & "U Foostr./Barstr."
	if (haveSameStem && lN[sN.length] !== '/') {
		const score = km * 1000  / nameSimilarity // weigh distance & similarity
		console.error(sN, _(km) * 1000, _(nameSimilarity), _(score), lN)
		// todo
		return null
	}

	return null
}

module.exports = Object.assign(analyse, {JOIN})
