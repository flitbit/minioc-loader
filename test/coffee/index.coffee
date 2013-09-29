initialized = false

exports.call_count = 0

exports.$init = ($coffeeCb, next) ->
	if !initialized
		cb = $coffeeCb
		this.register('black').from.factory ($moreData) ->
			return cb $moreData
		initialized = true
	exports.call_count++


