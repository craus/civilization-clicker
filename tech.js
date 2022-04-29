tech = function(initialValue, id, params) {
  var result = variable(initialValue, id, params)
  result = Object.assign(result, {
    requirements: [],
    require: function(t) {
      this.requirements.push(t)
    },
    paint: function() {
      $('.'+id+'Unlocked').toggle(this.requirements.every(r => r() > 0))
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
    }
  })
  
  $('.'+id+' .pick').click(() => {
    if (result.value != 1 && resources.tech.value >= 1) {
      result.value = 1
      resources.tech.value -= 1
      result.researchedAt = resources.time.value
    }
  })
  
  if (savedata[id] != undefined) {
    result = Object.assign(result, savedata[id])
  }
  
  return result
}  