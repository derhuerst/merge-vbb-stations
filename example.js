'use strict'

const stations = require('vbb-stations')
const analyse = require('.')

const karlshorst = stations('900000162001')[0]
const karlshorstWandlitzstr = stations('900000162501')[0]

console.error(analyse(karlshorstWandlitzstr, karlshorst))
