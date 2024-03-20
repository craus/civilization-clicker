timeWhen = function(predicate) {
  civilization.backup()
  
  for (let i = 0; i < 100; i++) {
    civilization.tickTime(1e10)
  }
  
  if (!predicate()) {
    civilization.restore()
    return Number.POSITIVE_INFINITY
  }
  
  civilization.restore()
  
  var result = false
  
  for (let i = 0; i < 36000; i++) {
    civilization.tickTime(0.1)
    if (predicate()) {
      result = true
      break
    }
  }
  var targetTime = resources.time()
  targetTime = Object.assign(targetTime, {result: result})
  civilization.restore()
  return targetTime
}
