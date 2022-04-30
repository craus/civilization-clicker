tech = function(initialValue, id, name, params) {
  var result = variable(initialValue, id, params)
  result = Object.assign(result, {
    techName: name,
    requirements: [],
    require: function(t) {
      this.requirements.push(t)
    },
    paint: function() {
      $('.techs .'+id).toggle(this.requirements.every(r => r() > 0))
      $('.'+id+'Required').toggle(this.value == 1)
      $('.'+id+' .pick').toggle(this.value == 0)
      $('.'+id+' .picked').toggle(this.value == 1)
      $('.'+id+' .researchedAt').text(Format.time(this.researchedAt))
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
    }
  })
  
  $('.'+id+' .pick').click(() => {
    if (result.value != 1 && resources.tech.value >= 1) {
      resources.tech.value -= 1
      result.research()
    }
  })
  
  $('.'+id+' .name').text(result.techName)
  
  if (savedata[id] != undefined) {
    result = Object.assign(result, savedata[id])
  }
  
  if (result.value == 1) {
    console.log(result.techName, result.value)
    $('.techs .'+id).appendTo($('.researchedTechsList'))
  } else {
    console.log(result.techName, result.value)
  }
  
  return result
}  