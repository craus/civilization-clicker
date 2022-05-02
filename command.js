runChange = function(change, multiplier = 1) {
  Object.entries(change).forEach(c => resources[c[0]].value += c[1] * multiplier)
}

function command(id, change)
{
  var buttonGroup = $('.'+id)
  var less = buttonGroup.find('.less')
  var more = buttonGroup.find('.more')
  var buy = buttonGroup.find('.buy')



  var result = $.extend({
    zoom: 0,
    onZoomChanged: function(){},
    alwaysTop: false,
    run: function(zoom) {
      runChange(change(zoom))
    },
    check: function(zoom){
      return Object.entries(change(zoom)).every(c => resources[c[0]].value >= -c[1])
    },
    use: function() {
      if (!this.canUse()) {
        return
      }
      this.run(this.zoom)
    },
    canUse: function() {
      return this.check(this.zoom)
    },
    canZoomUp: function() {
      return true//this.check(this.zoom+1)
    },
    canZoomDown: function() {
      return this.zoom > 0
    },
    zoomUp: function() {
      if (this.canZoomUp()) {
        this.zoom += 1
        this.onZoomChanged()
      }
    },
    zoomDown: function() {
      if (this.canZoomDown()) {
        this.zoom -= 1
        this.onZoomChanged()
      }
    },
    adjust: function() {
      this.onZoomChanged()
      while (this.canZoomDown() && !this.canUse()) {
        this.zoom -= 1
      }
      if (this.alwaysTop) {
        while (this.canZoomUp()) {
          this.zoom += 1
        }
      }
    },
    switchAlwaysTop: function() {
      this.alwaysTop = !this.alwaysTop
    },
    cost: function(resource) {
      return -change(this.zoom)[resource]
    },
    reward: function() {
      return Object.values(change(this.zoom)).find(x => x > 0)
    },
    paint: function() {
      enable(less, this.canZoomDown())
      enable(more, this.canZoomUp())
      enable(buy, this.canUse())
      Object.entries(change(this.zoom)).forEach(c => {
        setFormattedText(buttonGroup.find('.#{0}'.i(c[0])), large(Math.abs(c[1])))
      })
    },
    save: function() {
      savedata[id] = {
        zoom: this.zoom
      }
    }
  }, {})
  
  buy.click(function() { result.use() })
  more.click(function() { result.zoomUp() })
  less.click(function() { result.zoomDown() })
  
  if (savedata[id] != undefined) {
    result.zoom = savedata[id].zoom
  }
  
  return result
}

function createAllCommands() {
  return {
    hireScientists: command('hireScientists', z => ({
      commands: -1,
      money: -Math.pow(10, z),
      scientists: +approx(Math.pow(10, 0.813*Math.pow(z, 0.9)))
    })),
    hireSoldiers: command('hireSoldiers', z => ({
      commands: -1,
      money: -Math.pow(10, z),
      soldiers: +arc(2*Math.pow(z, 0.5))
    })),
    buildHouses: command('buildHouses', z => ({
      commands: -1,
      minerals: -10*Math.pow(10, z),
      population: +arc(0.774*Math.pow(z, 0.8))
    })),
    buildFarms: command('buildFarms', z => ({
      commands: -1,
      minerals: -1e3*Math.pow(10, z),
      farms: +arc(0.87*Math.pow(z, 0.8))
    })),
    organizeCelebrations: command('organizeCelebrations', z => ({
      commands: -1,
      money: -10*Math.pow(10, z),
      happiness: +arc(0.521*Math.pow(z, 0.7))
    })),
    buildCircuses: command('buildCircuses', z => ({
      commands: -1,
      minerals: -10*Math.pow(10, z),
      circuses: +Math.floor(arc(0.583*Math.pow(z, 0.6)))
    })),
    buildMines: command('buildMines', z => ({
      commands: -1,
      minerals: -10*Math.pow(10, z),
      mines: +arc(0.574*Math.pow(z, 0.7))
    })),
    buildMarketplaces: command('buildMarketplaces', z => ({
      commands: -1,
      minerals: -10*Math.pow(10, z),
      marketplaces: +arc(0.574*Math.pow(z, 0.75))
    })),
    buildLabs: command('buildLabs', z => ({
      commands: -1,
      minerals: -10*Math.pow(10, z),
      labs: +arc(0.574*Math.pow(z, 0.6))
    }))
  }
}