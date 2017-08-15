'use strict'

const h = require('hyperscript')
const shorten = require('vbb-short-station-name')
const fs = require('fs')
const path = require('path')

const applyToAll = require('./lib/apply-to-all')

const renderInstruction = ({op, src, dest, stopName}) => {
	const id = [op, src.id, dest.id].join('-')
	const anchor = h('a', {href: '#' + id}, '#')
	const htmlStopName = stopName
		? h('code', {}, stopName)
		: h('i', {}, 'keep original one')

	return h('tr', {id}, [
		h('td', {class: 'link'}, anchor),
		h('td', {class: 'src-name'}, shorten(src.name)),
		h('td', {class: 'src-id'}, h('code', {}, src.id)),
		h('td', {class: 'dest-id'}, h('code', {}, dest.id)),
		h('td', {class: 'dest-name'}, shorten(dest.name)),
		h('td', {class: 'stop-name'}, htmlStopName)
	])
}

const instructions = applyToAll()
console.error(`computed ${instructions.length} instructions`)
const rows = instructions.map(renderInstruction)

const report = h('table', {}, [
	h('thead', {}, [
		h('tr', {}, [
			h('th', {class: 'link'}, '#'),
			h('th', {class: 'src-name'}, 'station name'),
			h('th', {class: 'src-id'}, 'station ID'),
			h('th', {class: 'dest-id'}, 'dest. ID'),
			h('th', {class: 'dest-name'}, 'dest. name'),
			h('th', {class: 'stop-name'}, `name for station's stops`)
		])
	]),
	h('tbody', {}, rows)
])

const reportDE = h('table', {}, [
	h('thead', {}, [
		h('tr', {}, [
			h('th', {class: 'link'}, '#'),
			h('th', {class: 'src-name'}, 'Stationsname'),
			h('th', {class: 'src-id'}, 'Stations-ID'),
			h('th', {class: 'dest-id'}, 'Ziel-ID'),
			h('th', {class: 'dest-name'}, 'Zielname'),
			h('th', {class: 'stop-name'}, `Name f. d. Haltest. der St.`)
		])
	]),
	h('tbody', {}, rows)
])

const f = (p) => path.join(__dirname, 'docs', p)

const skeleton = fs.readFileSync(f('report.html'), {encoding: 'utf8'})
const rendered = skeleton.replace('{{table}}', report.outerHTML)
fs.writeFileSync(f('index.html'), rendered)

const skeletonDE = fs.readFileSync(f('report.de.html'), {encoding: 'utf8'})
const renderedDE = skeletonDE.replace('{{table}}', reportDE.outerHTML)
fs.writeFileSync(f('index.de.html'), renderedDE)
