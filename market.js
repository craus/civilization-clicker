

function market(id, generateDeal)
{
  var panel = $('.market.'+id)
  var accept = panel.find('.accept')
  var decline = panel.find('.decline')
  
  var result = $.extend({
    level: 1,
    deal: null,
    accept: function() {
      if (!this.affordable()) return
      Object.entries(this.deal).forEach(c => resources[c[0]].value += c[1])
      this.level += 1
      resources.commands.value -= 1
      this.generateNewDeal()
    },
    decline: function() {
      if (!this.declinable()) return
      this.level -= 1
      resources.commands.value -= 1
      this.generateNewDeal()
    },
    generateNewDeal: function() {
      this.deal = generateDeal(this.level)
    },
    affordable: function() {
      return resources.commands() >= 1 && Object.entries(this.deal).every(c => resources[c[0]].value >= -c[1])
    },
    declinable: function() {
      return resources.commands() >= 1 && this.level >= 1
    },
    paint: function() {
      panel.find('.level').text(this.level)
      decline.toggleClass('disabled', !this.declinable())
      accept.toggleClass('disabled', !this.affordable())
      Object.entries(this.deal).forEach(c => {
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