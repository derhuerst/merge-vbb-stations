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
	h('tbody', {}, instructions.map(renderInstruction))
])

const src = path.join(__dirname, 'docs/report.html')
const dest = path.join(__dirname, 'docs/index.html')
const skeleton = fs.readFileSync(src, {encoding: 'utf8'})

const rendered = skeleton.replace('{{table}}', report.outerHTML)
process.stdout.write(rendered + '\n')
