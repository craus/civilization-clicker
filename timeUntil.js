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
  
  for (let i = 0; i < 1e4; i++) {
    civilization.tickTime(0.1)
    if (predicate()) {
      break
    }
  }
  var targetTime = resources.time()
  civilization.restore()
  return targetTime
}