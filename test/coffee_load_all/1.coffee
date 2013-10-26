exports.$init = (next) ->
  this.register('coffee1').as.value('coffeeOne')
  next()