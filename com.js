const eps = 1e-4

toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

log = function(x, y) {
  return Math.log(x) / Math.log(y)
}

round = function(x, s) {
  s = s || 1
  var p = Math.pow(10, Math.floor(log(x, 10))-s+1)
  
  return Math.round(x/p)*p
}

function normAng(ang)
{
  while (ang >= Math.PI) ang -= 2 * Math.PI;
  while (ang < -Math.PI) ang += 2 * Math.PI;
  return ang;
}

function sqr(x) {
  return x*x
}

function dist(x1, y1, x2, y2) {
  x2 = x2 || 0
  y2 = y2 || 0
  return Math.sqrt(sqr(x1-x2)+sqr(y1-y2))
}

function rnd(min, max) {
  return min + Math.random()*(max-min)
}
function chances(p, q) {
  return p/(p+q)
}
function rndEvent(p,q=1-p) {
  return Math.random() < chances(p, q)
}
function rndSplit(x, n) {
  var splitters = [0,x]
  for (var i = 0; i < n-1; i++) {
    splitters.push(rnd(0,x))
  }
  splitters.sort((a,b)=>a-b)
  var result = []
  for (var i = 0; i < n; i++) {
    result.push(splitters[i+1]-splitters[i])
  }
  return result
}

identityMatrix = [1,0,0,1,0,0]
function transform(old, x,y,z,ang) {
  var a = z * Math.cos(ang)
  var b = z * Math.sin(ang)
  var c = - z * Math.sin(ang)
  var d = z * Math.cos(ang)
  var e = x
  var f = y
  return [
    old[0]*a+old[2]*b,
    old[1]*a+old[3]*b,
    old[0]*c+old[2]*d,
    old[1]*c+old[3]*d,
    old[0]*e+old[2]*f+old[4],
    old[1]*e+old[3]*f+old[5]
  ]
}

function mirrorTransform(old, mirror) {
  if (mirror == false) return old
  return transformByMatrix(old, [
    -1, 0, 0, 1, 0, 0
  ])
}

function transformByMatrix(old, mx) {
  return [
    old[0]*mx[0]+old[2]*mx[1],
    old[1]*mx[0]+old[3]*mx[1],
    old[0]*mx[2]+old[2]*mx[3],
    old[1]*mx[2]+old[3]*mx[3],
    old[0]*mx[4]+old[2]*mx[5]+old[4],
    old[1]*mx[4]+old[3]*mx[5]+old[5]
  ]
}

function inverseMatrix(old) {
  var a = old[0]*1.0
  var b = old[1]*1.0
  var c = old[2]*1.0
  var d = old[3]*1.0
  var e = old[4]*1.0
  var f = old[5]*1.0
  var D = a*d-b*c
  return [
    d/D,
    -b/D,
    -c/D,
    a/D,
    (c*f-d*e)/D,
    (b*e-a*f)/D
  ]
}

function matrixPow(old, k) {
  return [
    old[0] * k + identityMatrix[0] * (1-k),
    old[1] * k + identityMatrix[1] * (1-k),
    old[2] * k + identityMatrix[2] * (1-k),
    old[3] * k + identityMatrix[3] * (1-k),
    old[4] * k + identityMatrix[4] * (1-k),
    old[5] * k + identityMatrix[5] * (1-k),
  ]
}

function closeMatrices(a,b) {
    for(var i = a.length; i--;) {
      if (Math.abs(a[i]-b[i]) > 1e-10)
        return false;
    }
    return true;
  }

singleCommandTransform = {
  u: 'r', 
  r: 'd',
  d: 'l',
  l: 'u'
}

mirrorCommandTransform = {
  u: 'u', 
  r: 'l',
  d: 'd',
  l: 'r'
}

function transformMap(old, delta) {
  result = {}
  Object.keys(old).forEach(function(key) {
    result[key] = old[delta[key]]
  })
  return result
}

function next(a, x, d) {
  return a[(a.indexOf(x)+(d || 1)+a.length) % a.length]
}

function enable(el, on) {
  el.prop('disabled', !on)
  if (!on) {
    el.tooltip('hide')
  }
}
  
arc = function(p) {
  return Math.floor(round(Math.pow(10, p), 2))
}

approx = p => Math.floor(round(p, 2))

sign = function(x) { 
  if (x == null) return null
  if (x > 0) return "+";
  return "";
}
signed = function(x) {
  if (x == null) return null
  return sign(x) + x
}
large = function(x) {
  if (x == null) return null
  if (x == 0) return 0
  if (Math.abs(x) > 1e4*(1+eps) || Math.abs(x) < 1-eps) return x.toPrecision(4).replace('+','')
  if (Math.abs(x - Math.floor(x+eps)) < eps) return Math.floor(x+eps)
  return x.toPrecision(4).replace('+','') 
}
precision = function(x, p = 4) {
  if (x == null) return null
  if (x == 0) return 0
  return x.toPrecision(p).replace('+','') 
}
noZero = function(x, func = x => x) {
  return x == 0 || x == null ? "" : func(x)
}
noSmall = function(x) {
  return Math.abs(x) < eps ? 0 : x
}
const Format = {
  round: function(x, s) {
    s = s || 0
    p = Math.pow(10, s)
    return Math.round(x*p)/p
  },
  time: function(x) {
    if (x >= Number.POSITIVE_INFINITY) {
      return '#{0}&nbsp;s'.i(large(x))
    }
    return moment.duration(x+eps,'s').format("d [days] hh:mm:ss", { trim: true, precision: 1 })
  },
  percent: function(x) {
    return '#{0}%'.i(Math.round(x*100))
  }
}


setTitle = function(el, title) {
  el.attr('data-original-title', title)
}
formatText = function(el, text, text1) {
  var format = el.attr('data-text')
  if (format == undefined) {
    format = "#{0}"
  }
  return format.replace('#{0}', text).replace('#{1}', text1)
}
setFormattedText = function(el, text, text1) {
  var t = formatText(el, text, text1)
  if (el.length > 0 && el.text() != t) {
    //console.log("setting text", el, "was: ", el.text(), "is: ", t)
    el.html(t)
  }
}
needResort = false
setSortableValue = function(el, value) {
  var old = el.attr('data-value')
  if (old != value) {
    el.attr('data-value', value)
    needResort = true
  }
}
instantiate = function(name) {
  return $("." + name + ":first").clone().removeClass("hidden " + name)
}

