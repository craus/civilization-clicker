timeUntil = function(predicate) {
  civilization.backup()
  for (let i = 0; i < 1e6; i++) {
    civilization.tickTime(0.1)
    if (predicate()) {
      break
    }
  }
  var targetTime = resources.time()
  civilization.restore()
  return targetTime - resources.time()
}