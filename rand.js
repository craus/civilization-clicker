(() => {
  var spareRandom = null;
  rand = {
    normal: function() {
      var val, u, v, s, mul;
      if(spareRandom !== null)
      {
        val = spareRandom;
        spareRandom = null;
      }
      else
      {
        do
        {
          u = Math.random()*2-1;
          v = Math.random()*2-1;

          s = u*u+v*v;
        } while(s === 0 || s >= 1);

        mul = Math.sqrt(-2 * Math.log(s) / s);

        val = u * mul;
        spareRandom = v * mul;
      }
      return val
    },

    deal: function(params) {
      params.zoomSpread ??= 0
      params.qualitySpread ??= 0
      var zoomFrom = params.zoomFrom + rand.normal() * params.zoomSpread
      var zoomTo = params.zoomTo(Math.clamp(zoomFrom, 0)) + rand.normal() * params.qualitySpread
      console.log(zoomFrom, zoomTo)
      result = {}
      result[params.resourceFrom] = -approx(Math.pow(10, zoomFrom))
      result[params.resourceTo] = +approx(Math.pow(10, zoomTo))
      return result
    }
  }
})()