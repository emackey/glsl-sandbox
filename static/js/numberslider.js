/* 
	@author zz85
	balloon toolbars and value sliders for numbers
	idea motivated by http://vimeo.com/36579366
*/



var div = document.createElement('div');

function createElementOfId(id) {
	var e = div.cloneNode(false);
	e.id = id;
	return e;
}

var bubble = createElementOfId('bubble');
var vtrack = createElementOfId('vtrack');
var track = createElementOfId('track');
var bubble = createElementOfId('bubble');
var lslider = createElementOfId('lslider');
var rslider = createElementOfId('rslider');
var isBalloonOpen = false;
var activated = false;

lslider.className = 'slider';
rslider.className = 'slider';
vtrack.appendChild(lslider);
vtrack.appendChild(rslider);
vtrack.appendChild(track);
bubble.appendChild(vtrack);

document.body.appendChild(bubble);

/*
The above creates something like
<div id="bubble" class="bubble">
  <div id="vtrack" class="vtrack">
    <div id="lslider" class="lslider"></div>
    <div id="rslider" class="rslider"></div>
    <div id="track" class="track"></div>
  </div>
</div>
*/

var trackWidth = parseInt(track.clientWidth, 0);
var halfWidth = trackWidth/2;

var target;
var current;
var isFloat;
var token;
var startPos;
var endPos;
var cursor;

function onMouseMove(e) {

  repositionBalloon();
  var x = e.clientX; // this might come in useful later for out of bubble drags
  var y = e.clientY;
  
  var offsetX = (e.offsetX!==undefined) ? e.offsetX : e.layerX;
  var offsetY = (e.offsetY!==undefined) ? e.offsetY : e.layerY;

  var val = offsetX - halfWidth;
  if (val > 0) {
    rslider.style.width = val + 'px';
    lslider.style.width = 0;
  } else {
    lslider.style.width = -val + 'px';
    rslider.style.width = 0;
  }
  
  var result;
  
  if (isFloat) {
    // result = current + val * 0.01;

    var sign = (val > 0) ? 1 : -1;
    var mag = Math.abs(val);
    result = current + sign * Math.pow(10.0, 0.02 * mag);
    result = result.toFixed(2);
  } else {
    result = current + Math.round(val);
  }
  
  //target.innerHTML = result;
  // console.log('result', result);

  var oldLength = endPos.ch - startPos.ch;
  var newLength = (result+"").length;

  code.replaceRange(result, startPos, endPos);
  endPos.ch += newLength - oldLength;
  // code.setCursor(cursor);
  //debug.innerHTML = '(' + offsetX + ',' + offsetY + ')';


  return false;

}

var selfDestructBalloon;
vtrack.onmousemove = onMouseMove;
vtrack.onclick = deactivateBalloon;
vtrack.onmouseout = function() {
	selfDestructBalloon = setTimeout(deactivateBalloon, 800 );
	bubble.className = 'animateBubble fadeBubble';
};

vtrack.onmouseover = function() {
	if (selfDestructBalloon) {
		clearTimeout(selfDestructBalloon);
		bubble.className = 'animateBubble showBubble';
	}
};

function deactivateBalloon() {
	isBalloonOpen = false;
	bubble.className = 'hideBubble';
	
}

function activateBalloon() {

		isBalloonOpen = true;
		bubble.className = 'showBubble animateBubble';

		current = token.string;
		
		lslider.style.width = 0;
		rslider.style.width = 0;

		startPos = {
			line: cursor.line,
			ch: token.start
		};
		
		endPos = {
			line: cursor.line,
			ch: token.end
		};

		repositionBalloon();

		if ( isFloat = current.indexOf('.')>-1 ) {
			current = parseFloat(current);
		} else {
			current = parseInt(current, 0);
		}
}

function repositionBalloon() {



		var startCoords = code.charCoords(startPos);
		var endCoords = code.charCoords(endPos);
		var atCoords =  {x: (startCoords.x + endCoords.x)/2, y: startCoords.y };
		
		// var atCoords = code.charCoords(cursor);

		// Position Bubble
		bubble.style.left = atCoords.x + 'px';
		bubble.style.top = atCoords.y - 2 + 'px';

		// console.log('token', token, 'startCoords',  current);


}

// we need to plug into codeMirror

code.setOption("onCursorActivity", cursorUpdate);
// code.setOption("onKeyEvent", function() {
// 	if (activated) {
// 		// activated by mouse
// 		activated = false;
// 	} else {
// 		if (isBalloonOpen)
// 			deactivateBalloon();
	
// 	}

// });

var s = code.getScrollerElement();
s.addEventListener('mousemove', function(e) {
		activated = true;

	var oldToken = token;

	cursor = code.coordsChar({x: e.clientX, y: e.clientY});
	token = code.getTokenAt(cursor);

	// Activated from Mouse click
	if (token.className === "number") {
		if (isBalloonOpen) {
			if (oldToken && (oldToken.start==token.start)) {
				return;
			}
		}
		activateBalloon();

	} else {

		deactivateBalloon();

	}

	// startPos = {
	// 	line: cursor.line,
	// 	ch: token.start
	// };
	
	// endPos = {
	// 	line: cursor.line,
	// 	ch: token.end
	// };

	// var a = code.markText(startPos, endPos, 'slide');
	
});



function cursorUpdate() {
	activated = true;

	var oldToken = token;

	cursor = code.getCursor();
	token = code.getTokenAt(cursor);

	if (token.className === "number") {
		if (isBalloonOpen) {
			if (oldToken && (oldToken.start==token.start)) {
				return;
			}
		}
		activateBalloon();

	} else {

		deactivateBalloon();

	}

}