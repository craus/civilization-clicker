tech = function(initialValue, id, name, params) {
  var result = variable(initialValue, id, params)
  result = Object.assign(result, {
    techName: name,
    requirements: [],
    require: function(t) {
      this.requirements.push(t)
    },
    available: function() {
      return this.requirements.every(r => r() > 0)
    },
    affordable: function() {
      return resources.tech.value >= 1;
    },
    researched: function() {
      return this.value == 1
    },
    paint: function() {
      $('.techs .'+id).toggle(
        this.available() && !this.researched() && show.availableTechs || 
        this.researched() && show.researchedTechs
      )
      $('.'+id+'Required').toggle(this.value == 1)
      $('.'+id+' .pick').toggle(this.value == 0)
      $('.'+id+' .picked').toggle(this.value == 1)
      $('.'+id+' .researchedAt').text(Format.time(this.researchedAt))
      $('.techs .'+id).toggleClass('available', result.value == 0)
      $('.techs .'+id).toggleClass('researched', result.value == 1)      
      $('.pick').prop('disabled', !this.affordable())
      $('.pick').toggleClass('nohover', !this.affordable())
    },
    save: function() {
      savedata[id] = {
        value: this.value,
        researchedAt: this.researchedAt
      }
    },
    createHistoryRow: function(index) {
      var row = instantiate("techHistoryRowSample")
      row.find('.researchedAt').text(Format.time(this.researchedAt))
      row.find('.name').text(this.techName)
      row.find('.index').text(index)
      setSortableValue(row.find('.researchedAt'), this.researchedAt)
      $('.techHistory').append(row)
    },
    research: function() {
      this.value = 1
      this.researchedAt = resources.time.value
      this.createHistoryRow(researchedTechsCount()) 
      $('.techs .'+id).appendTo($('.researchedTechs'))
    },
    buyResearch: function() {
      if (this.available() && this.affordable() && !this.researched()) {
        resources.tech.value -= 1
        this.research()
      }      
    }
  })
  
  $('.'+id+' .pick').click(() => {
    result.buyResearch()
  })
  
  $('.'+id+' .name').text(result.techName)
  
  if (savedata[id] != undefined) {
    result = Object.assign(result, savedata[id])
  }
  
  return result
}  

function createAllTechs() {
  techs = {
    minerals: tech(0, 'mineralsTech', 'Geology'),
    farms: tech(0, 'farmsTech', 'Agriculture'),
    mines: tech(0, 'minesTech', 'Mining'),
    marketplaces: tech(0, 'marketplacesTech', 'Economy'),
    labs: tech(0, 'labsTech', 'Centralized Studies'),
    military: tech(0, 'militaryTech', 'Military'),
    happiness: tech(0, 'happinessTech', 'Sociology'),
    minersGuild: tech(0, 'minersGuildTech', 'Miners Guild'),
    scientistsGuild: tech(0, 'scientistsGuildTech', 'Scientists Guild'),
    circuses: tech(0, 'circusesTech', 'Applied Entertainment'),
    //barracks: tech(0, 'barracksTech', 'Field Constructions'),
    win: tech(0, 'winTech', 'Interplanet Colonization')
  }
  
  techs.farms.require(techs.minerals)
  techs.mines.require(techs.minerals)
  techs.marketplaces.require(techs.minerals)
  techs.labs.require(techs.minerals)
  techs.circuses.require(techs.happiness)
  techs.circuses.require(techs.minerals)
  techs.circuses.require(techs.minerals)
  techs.minersGuild.require(techs.happiness)
  techs.minersGuild.require(techs.minerals)
  techs.scientistsGuild.require(techs.happiness)
  
  Object.values(techs).forEach(t => {if (t != techs.win) techs.win.require(t)})
  
  Object.values(techs).filter(t => t.value == 1).sort((a,b) => a.researchedAt - b.researchedAt).forEach((t, i) => t.createHistoryRow(i+1))
  
  techCostByTechCount = techCount => approx(1000 * Math.pow(10, 3.5*techCount + 0.1*Math.pow(techCount, 2)))
  techCost = () => techCostByTechCount(resources.totalTech())
  
  return techs
}