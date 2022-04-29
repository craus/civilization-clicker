tech = function(initialValue, id, params) {
  var result = variable(initialValue, id, params)
  return Object.assign(result, {
    requirements: [],
    require: function(t) {
      this.requirements.push(t)
    },
    paint: function() {
      $('.'+id+'Unlocked').toggle(this.requirements.every(r => r() > 0))
      $('.'+id+'Required').toggle(this.value == 1)
      $('.'+id+' .pick').toggle(this.value == 0)
      $('.'+id+' .picked').toggle(this.value == 1)
    }
  })
}  