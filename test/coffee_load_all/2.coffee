expect = require('expect.js')

exports.$init = ($coffee1, next) ->
  this.register('coffee2').as.value('coffeeTwo')
  expect(this.can('coffee1')).to.be(true) #Test to see if next is called with dependencies

  next()