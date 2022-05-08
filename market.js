

function market(id, generateDeal)
{
  var panel = $('.market.'+id)
  var accept = panel.find('.accept')
  var decline = panel.find('.decline')
  
  var result = $.extend({
    level: 0,
    maxLevel: 0,
    deal: null,
    accept: function() {
      if (!this.affordable()) return
      Object.entries(this.deal.change).forEach(c => resources[c[0]].value += c[1])
      this.level += 1
      if (this.level > this.maxLevel) {
        this.maxLevel = this.level
        resources.commands.value += 1
      } 
      resources.commands.value -= 1
      resources.idleTime.value = 0
      this.generateNewDeal()
    },
    decline: function() {
      if (!this.declinable()) return
      this.level -= 1
      this.generateNewDeal()
    },
    generateNewDeal: function() {
      this.deal = generateDeal(this.level)
    },
    affordable: function() {
      return resources.commands() >= 1 && Object.entries(this.deal.change).every(c => resources[c[0]].value >= -c[1])
    },
    declinable: function() {
      return this.level >= 1
    },
    paint: function() {
      panel.find('.level').text(this.level)
      decline.toggleClass('disabled', !this.declinable())
      accept.toggleClass('disabled', !this.affordable())
      Object.entries(this.deal.change).forEach(c => {
        setFormattedText(panel.find('.#{0}'.i(c[0])), large(Math.abs(c[1])))
      })
    },
    save: function() {
      savedata.markets = savedata.markets || {}
      savedata.markets[id] = {
        level: this.level,
        deal: this.deal
      }
    }
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
    scientists: market('scientists', z => rand.deal({
      resourceFrom: 'money',
      resourceTo: 'scientists',
      zoomFrom: 0.5 * z + 0.3,
      zoomTo: z => 0.813*Math.pow(z, 0.9),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    houses: market('houses', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'population',
      zoomFrom: 0.5 * z + 0.5,
      zoomTo: z => 0.774*Math.pow(z, 0.8),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    mines: market('mines', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'mines',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.574*Math.pow(z, 0.7),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    soldiers: market('soldiers', z => rand.deal({
      resourceFrom: 'money',
      resourceTo: 'soldiers',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 2*Math.pow(z, 0.5),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    farms: market('farms', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'farms',
      zoomFrom: 0.5 * z + 3,
      zoomTo: z => 0.9*Math.pow(z, 0.8),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    celebrations: market('celebrations', z => rand.deal({
      resourceFrom: 'money',
      resourceTo: 'happiness',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.521*Math.pow(z, 0.75),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    circuses: market('circuses', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'circuses',
      zoomFrom: 0.5 * z + 3,
      zoomTo: z => 0.574*Math.pow(z, 0.7),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    marketplaces: market('marketplaces', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'marketplaces',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.574*Math.pow(z, 0.75),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    })),
    labs: market('labs', z => rand.deal({
      resourceFrom: 'minerals',
      resourceTo: 'labs',
      zoomFrom: 0.5 * z + 1,
      zoomTo: z => 0.574*Math.pow(z, 0.55),
      qualitySpread: 0.5,
      zoomSpread: 0.5
    }))
  }
}