var powerSlopes = [
  [],
  div([1,10]),
  div([1,3,10]),
  div([1,2,5,10]),
  div([1,2,3,5,10]),
  div([1,2,3,5,7,10]),
  div([10,15,20,30,50,70,100]),
]

var frac = ((x,y) => {
  var res = [1]
  var cur = 1
  var index = 0
  for (var i = 0; i < y; i++) {
    for (var j = 0; j < x; j++) {
      cur *= powerSlopes[y][index]
      index = (index+1)%y
    }
    res.push(cur)
  }
  return div(res)
})

array = ((a, k, z) => a[Math.min(z,a.length-1)]*Math.pow(k,Math.max(0, z-a.length+1)))
var prod = ((a) => {
  for (var i = 1; i < a.length; i++) {
    a[i] *= a[i-1]
  }
  return a
})
var div = ((a) => {
  var b = []
  for (var i = 1; i < a.length; i++) {
    b.push(a[i]/a[i-1])
  }
  return b
})