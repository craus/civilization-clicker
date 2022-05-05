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
      params.zoomSpread = Math.clamp(params.zoomSpread, 0, params.zoomFrom/3)
      
      var result = Object.assign({}, params)
      
      result.baseZoomFrom = result.zoomFrom
      result.zoomFrom = result.baseZoomFrom + rand.normal() * result.zoomSpread
      
      result.baseZoomTo = params.zoomTo(Math.clamp(result.zoomFrom, 0))
      result.zoomTo = result.baseZoomTo + rand.normal() * result.qualitySpread
      
      result.change = {}
      result.change[params.resourceFrom] = () => -Math.clamp(approx(Math.pow(10, result.zoomFrom)), 1)
      result.change[params.resourceTo] = () => +Math.clamp(approx(Math.pow(10, result.zoomTo)), 1)
      
      console.log(result)
      return result
    }
  }
})()