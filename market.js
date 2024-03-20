function market(verb, id, generateDeal)
{
  var panel = instantiate("marketSample")
  $('.#{0}Marketplace'.i(id)).append(panel)
  var accept = panel.find('.accept')
  var decline = panel.find('.decline')
  
  var deal = generateDeal(0)
  
  var from = deal.resourceFrom
  var to = deal.resourceTo
  
  panel.find('.name').text(id.capitalize())
  panel.find('.from.name').text(deal.resourceFrom)
  panel.find('.to.name').text(id)
  panel.find('.from .name').text(deal.resourceFrom.capitalize())
  panel.find('.to .name').text(deal.resourceTo.capitalize())
  
  panel.find('.from').toggleClass(from, true)
  panel.find('.to').toggleClass(to, true)
  panel.find('.verb').text(verb)
  
  var result = $.extend({
    level: 0,
    maxLevel: 0,
    deal: null,
    accept: function() {
      if (!this.affordable()) {
        if (resources.timeSkip() < 1) {
          return 
        }
        civilization.tickTime(this.remainingTime())
        if (!this.affordable()) {
          civilization.afterAction()
          return
        }
      }
      Object.entries(this.deal.change).forEach(c => resources[c[0]].value += c[1])
      this.level += 1
      if (this.level > this.maxLevel) {
        this.maxLevel = this.level
        resources.commands.value += 1
      } 
      resources.commands.value -= 1
      resources.idleTime.value = 0
      this.generateNewDeal()
      civilization.afterAction()
    },
    decline: function() {
      if (!this.declinable()) return
      this.level -= 1
      this.generateNewDeal()
      civilization.afterAction()
    },
    generateNewDeal: function() {
      this.deal = generateDeal(this.level)
    },
    affordable: function() {
      return resources.commands() >= 1 && Object.entries(this.deal.change).every(c => resources[c[0]].value > -c[1] - eps)
    },
    declinable: function() {
      return this.level >= 1
    },
    affordableMomentCache: null,
    affordableMoment: function() {
      if (this.affordableMomentCache == null) {
        this.affordableMomentCache = timeWhen(() => resources[from]()+this.deal.change[from] > -eps && resources.commands() > 1-eps)
      }
      return this.affordableMomentCache
    },
    remainingTime: function() {
      return this.affordableMoment() - resources.time()
    },
    paint: function() {
      panel.find('.level').text(this.level)
      decline.toggleClass('disabled', !this.declinable())
      accept.toggleClass('disabled', !this.affordable() && resources.timeSkip() == 0)
      
      panel.find('.unavailable').toggle(!this.affordable())
      panel.find('.remainingTime').text(Format.time(this.remainingTime()))
      
      panel.find('.action').text(this.affordableMoment().result ? 'Accept' : 'Wait')
      
      panel.find('.from.change').text(large(-this.deal.change[from]))
      panel.find('.to.change').text(large(this.deal.change[to]))
    },
    save: function() {
      savedata.markets = savedata.markets || {}
      savedata.markets[id] = {
        level: this.level,
        deal: this.deal
      }
    },
    afterAction: function() {
      this.affordableMomentCache = null
    },
  }, {})
  
  accept.click(function() { result.accept() })
  decline.click(function() { result.decline() })
  
  savedata.markets = savedata.markets || {}
  
  var save = savedata.markets[id]
  
  if (save != undefined) {
    result.level = save.level
    result.deal = save.deal
  } else {
    result.generateNewDeal()
  }
  
  return result
}

function createAllMarkets() {
  return {
    scientists: market('Hire', 'scientists', z => rand.deal({
      resourceFrom: 'money',
      resourceTo: 'scientists',
      zoomFrom: 0.5 * z + 0.3,
      zoomTo: z => 0.813*Math.pow(z, 0.9),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    universities: market('Build', 'universities', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'universities',
      zoomFrom: 0.5 * z + 3,
      zoomTo: z => 0.813*Math.pow(z, 0.8) - 1,
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    labs: market('Build', 'labs', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'labs',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.574*Math.pow(z, 0.55),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    houses: market('Build', 'houses', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'population',
      zoomFrom: 0.5 * z + 0.5,
      zoomTo: z => 0.774*Math.pow(z, 0.8),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    farms: market('Build', 'farms', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'farms',
      zoomFrom: 0.5 * z + 3,
      zoomTo: z => 0.9*Math.pow(z, 0.8),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    mines: market('Build', 'mines', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'mines',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.574*Math.pow(z, 0.7),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    soldiers: market('Train', 'soldiers', z => rand.deal({
      resourceFrom: 'money',
      resourceTo: 'soldiers',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 2*Math.pow(z, 0.5),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    barracks: market('Build', 'barracks', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'barracks',
      zoomFrom: 0.5 * z + 2,
      zoomTo: z => 2.05*Math.pow(z, 0.48) - 1,
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    bunkers: market('Build', 'bunkers', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'bunkers',
      zoomFrom: 0.5 * z + 2,
      zoomTo: z => 2.05*Math.pow(z, 0.48) - 1,
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    celebrations: market('Organize', 'celebrations', z => rand.deal({
      resourceFrom: 'money',
      resourceTo: 'happiness',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.521*Math.pow(z, 0.75),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    circuses: market('Build', 'circuses', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'circuses',
      zoomFrom: 0.5 * z + 3,
      zoomTo: z => 0.574*Math.pow(z, 0.7),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    marketplaces: market('Build', 'marketplaces', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'marketplaces',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.574*Math.pow(z, 0.75),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
  }
}