var createBot = function() {
  var binarySearch = function(min, max, good) {
    step = 1
    while (step < max-min) step <<= 1
    cur = min
    while (step > 0) {
      if (good(cur+step)) {
        cur += step
      }
      step >>= 1
    }
    return cur
  }
  
  var useMax = function(command) {
    var z = binarySearch(0, 100, z => command.check(z))
    if (command.check(z)) {
      command.zoom = z
      command.use()
    }
  }
  
  var research = function() {
    var techsList = [
      techs.minerals,
      techs.farms,
      techs.mines,
      techs.marketplaces,
      techs.labs,
      techs.military,
      techs.happiness,
      techs.circuses,
      techs.win
    ]
    var t = techsList.find(t => t.available() && t.affordable() && !t.researched())
    if (!!t) t.buyResearch()
  }
  
  return {
    tick: function(t) {
      return // disable bot
      useMax(commands.buildHouses)
      useMax(commands.hireScientists)
      research()
    }
  }
}