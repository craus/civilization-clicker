 

window.onload = function() {
  var time = new Date().getTime()
  console.log("time = " + time)
 
  if(typeof(Storage) !== "undefined") {
    console.log("have storage")
    var data = JSON.parse(localStorage.tempSavedData)
    console.log("data loaded: ")
    console.log(data)
    localStorage.tempSavedData = JSON.stringify({
      x: 42, 
      emptyObject: {},
      array: [3,2,9,2,7,2],
      time: time
    })
      // Code for localStorage/sessionStorage.
  } else {
    console.log("have no storage")
      // Sorry! No Web Storage support..
  } 
 
  eps = 1e-2
  game = createAscender()
  
  space = createSpace({speed: 1})
  
  bounds = createBounds($('#display-div')[0].offsetWidth, $('#display-div')[0].offsetHeight)
  var xc = (bounds.left + bounds.right)/2
  var yc = (bounds.top + bounds.bottom)/2
 
  units = [game]
  
  space.setIntervals()
  
  realTime = 0
  var secondTime = 0
  
  setInterval(function() {
    realTime += 0.1
    secondTime += 1
    
    $('#realTime').text("real time: " + realTime)
    
    if (secondTime == 10) {
      $('#fps').text("fps: " + space.frameCount)
      space.frameCount = 0
      secondTime = 0
    }
    
    $('#debugInfo').text(JSON.stringify(debugInfo))
    $('#frameCount').text("frames: " + space.frameCount)
    $('#tickCount').text("ticks: " + space.tickCount)
  }, 100)
  
  window.onkeydown = function(e) {
    console.log(e)
  }
  
  var display = $('#display')[0]
  display.addEventListener('click', function(event) {
    var x = event.pageX - display.offsetLeft
    var y = event.pageY - display.offsetTop
    space.click(x,y)
  })
}