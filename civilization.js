function createCivilization(params) {
  
  // Rules common things
    
  var gameName = "civilization"
  var saveName = gameName+"SaveData"

  if (localStorage[saveName] != undefined) {
    savedata = JSON.parse(localStorage[saveName])
  } else {
    savedata = {
      realTime: new Date().getTime()
    }
  }
  console.log("loaded " + gameName + " save: ", savedata)
  
  var saveWiped = false
  
  var save = function(timestamp) {
    if (saveWiped) {
      return
    }
    savedata = {} 
    savedata.show = show
    Object.values(resources).forEach(function(resource) {
      savedata[resource.id] = resource.value
    })
    Object.values(commands).each('save')
    Object.values(markets).each('save')
    Object.values(techs).each('save')
    savedata.activeTab = $('.sections>.active>a').attr('href')
    savedata.activeTechTab = $('.techs>.active>a').attr('href')
    savedata.activeTechSubsetTab = $('.techSubsets>.active>a').attr('href')
    savedata.activeAreaTab = $('.areas>.active>a').attr('href')
    savedata.realTime = timestamp || Date.now()
    localStorage[saveName] = JSON.stringify(savedata)
  } 
  
  wipeSave = function() {
    saveWiped = true
    localStorage.removeItem(saveName)
    location.reload()
  }

  createAllResources()
  
  markets = createAllMarkets()
  
  commands = createAllCommands()
  
  bot = createBot()
  
  savedata.activeTab = savedata.activeTab || '#population'
  savedata.activeTechSubsetTab = savedata.activeTechSubsetTab || '#availableTechs'
  
  show = savedata.show || {
    availableTechs: true,
    researchedTechs: false
  }
  
  $('a[href="' + savedata.activeTab + '"]').tab('show')
  $('a[href="' + savedata.activeTechTab + '"]').tab('show')
  $('a[href="' + savedata.activeAreaTab + '"]').tab('show')
  $('a[href="' + savedata.activeTechSubsetTab + '"]').tab('show')
  
  $('a[href="#availableTechs"]').click(() => { 
    show.availableTechs = true
    show.researchedTechs = false
  })
  $('a[href="#researchedTechs"]').click(() => { 
    show.availableTechs = false
    show.researchedTechs = true
  }) 
  
  civilization = {
    paint: function() {
      debug.profile('paint')
      
      Object.values(resources).each('paint')
      Object.values(techs).each('paint')
      Object.values(commands).each('paint')
      Object.values(markets).each('paint')
      setFormattedText($('.populationIncome'), noZero(signed(0)))
      setFormattedText($('.techCost'), large(techCost()))
      setFormattedText($('.conquestPenalty'), large(conquestPenalty()))
      setFormattedText($('.sciencePercent'), '#{0}%'.i((resources.science() / techCost()*100).toFixed(2)))      
      setFormattedText($('.conquestPercent'), '#{0}%'.i((resources.warpower() / resources.conquestCost()*100).toFixed(2)))
      $('.populationTab').toggle(techs.minerals()>0)
      $('.happinessTab').toggle(techs.happiness()>0)
      $('.industryTab').toggle(techs.mines()>0)
      $('.economyTab').toggle(techs.marketplaces()>0)
      $('.militaryTab').toggle(techs.military()>0)
      $('.conquestsTab').toggle(techs.military()>0)
      $('.techTab').toggle(resources.totalTech()>0)
      $('.historyTab').toggle(researchedTechsCount()>0)

      debug.unprofile('paint')
    },
    tickTime: function(deltaTime) {
      Object.values(resources).each('tick', deltaTime)
      resources.commands.value += deltaTime * 0.1
      //resources.commands.value = Math.min(10, resources.commands.value)
      
      while (resources.science() > techCost()) {
        resources.science.value -= techCost()
        resources.totalTech.value += 1
        resources.tech.value += 1
      }
      while (resources.warpower() > resources.conquestCost()) {
        resources.warpower.value -= resources.conquestCost()
        resources.conquestCost.value *= conquestPenalty()
        resources.conquests.value += 1
      }      
    },
    tick: function() {
      if (resources.conquestCost.value < 100) resources.conquestCost.value = 100
      debug.profile('tick')
      var currentTime = Date.now()
      var deltaTime = (currentTime - savedata.realTime) / 1000

      if (input.contains('f')) {
        deltaTime *= 10   
        if (input.contains('Shift')) {
          deltaTime *= 10
        }
      }
      if (recentInput.contains('t')) {
        resources.totalTech.value += 1
        resources.tech.value += 1
      }
      
      this.tickTime(deltaTime)
      bot.tick(deltaTime)
      
      save(currentTime)
      debug.unprofile('tick')
    }
  }
  return civilization
}