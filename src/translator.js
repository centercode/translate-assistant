var globalVar = {
  start: 0,
  end: 0,
  str: [],
  cur_high: null,
  click_time: 0
};
window.onbeforeunload = function () {
  "use strict";
  return "亲，记得保存了吗？";
};

function hotkey(event) {
  if (event.altKey && event.keyCode == 38) { //up
    moveSelect('up');
  } else if (event.altKey && event.keyCode == 40) { //down
    moveSelect('down');
  }
}

function highLight(obj) {
  "use strict";
  var i;
  if (globalVar.cur_high !== null) {
    globalVar.cur_high.setAttribute("class", "");
  }
  obj.setAttribute("class", "highlight");
  globalVar.cur_high = obj;
}

function removeAllChilds(div) {
  "use strict";
  while (div.hasChildNodes()) {
    //当div下还存在子节点时 循环继续
    div.removeChild(div.firstChild);
  }
}

function splitStr(str) {
  "use strict";
  var b;
  //  str = str.replace(/([^\.\!\?\n])\n/g, '$1 ');
  b = str.match(/[^\.\!\?\n]+[\.\!\?\n](\n)?/g);
  return b;
}

function handleFileSelect(event) { //loading file
  "use strict";
  var i,
    j,
    len,
    brNode,
    spanNodes = [],
    reader = new FileReader(),
    files = event.target.files,
    read_result,
    source_div = document.getElementById('source_text'); // FileList object  

  reader.readAsText(files[0]);
  reader.onload = function () {
    removeAllChilds(source_div);
    read_result = reader.result;
    globalVar.str = splitStr(read_result);
    console.log(globalVar.str);
    spanNodes = new Array(globalVar.str.length);
    for (i = 0, j = 0, len = spanNodes.length; j < len; j++) {
      spanNodes[i] = document.createElement("span");
      spanNodes[i].innerHTML = globalVar.str[i];
      source_div.appendChild(spanNodes[i]);
      spanNodes[i].addEventListener('click', function () {
        highLight(this);
      }, false);
      if (i === 0) {
        highLight(spanNodes[i]);
      }
      if (globalVar.str[i].slice(-1) == "\n") {
        brNode = document.createElement("br");
        source_div.appendChild(brNode);
      }
      i += 1;
    }

  };
}


function moveSelect(str) {
  "use strict";
  //if: not no one selected 
  var next;
  if (globalVar.cur_high === null) {
    return;
  }
  if (str === "down") {
    next = globalVar.cur_high.nextSibling;
    if (next != null && next.tagName == "BR") {
      next = next.nextSibling;
    }
  } else { //str == "up"
    if (document.getElementById("source_text").firstChild === globalVar.cur_high) {
      next = null;
    } else {
      next = globalVar.cur_high.previousSibling;
      if (next != null && next.tagName == "BR") {
        next = next.previousSibling;
      }
    }
  }

  if (next !== null) {
    highLight(next);
  }

}

function chFont(dx) {
  "use strict";
  var fnt_org = parseFloat($('#dest_text').css("fontSize"), 10);
  console.log();
  $('#dest_text').css("fontSize", fnt_org + dx);
  //  textarea.style("font-size",)

}

function changeTheme() {
  "use strict";
  var i,
    len_btns,
    body = document.getElementsByTagName('body')[0],
    source_div = document.getElementById('source_text'),
    textarea = document.getElementById('dest_text'),
    spans = document.getElementsByTagName('span'),
    btns = document.getElementsByTagName("input");

  globalVar.click_time += 1;
  len_btns = btns.length;
  if (globalVar.click_time % 2 === 1) {
    //night mode
    body.className = "night";
    source_div.className = "night";
    textarea.className = "night";
    for (i = 0; i < len_btns; i++) {
      btns[i].className += " night";
    }

  } else {
    body.className = "day";
    source_div.className = "day";
    textarea.className = "day";
    for (i = 0; i < len_btns; i++) {
      btns[i].className = btns[i].className.slice(0, -6);
    }
  }


}


/////////////////////////
function doSave() {
  var blob,
    time = new Date(),
    value = document.getElementById('dest_text').value,
    type = "text/latex",
    name = "translation-" + time.getTime() + ".txt";
  if (typeof window.Blob == "function") {
    blob = new Blob([value], {
      type: type
    });
  } else {
    var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
    var bb = new BlobBuilder();
    bb.append(value);
    blob = bb.getBlob(type);
  }
  var URL = window.URL || window.webkitURL,
    bloburl = URL.createObjectURL(blob),
    anchor = document.createElement("a");
  if ('download' in anchor) {
    anchor.style.visibility = "hidden";
    anchor.href = bloburl;
    anchor.download = name;
    document.body.appendChild(anchor);
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, true);
    anchor.dispatchEvent(evt);
    document.body.removeChild(anchor);
  } else if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, name);
  } else {
    location.href = bloburl;
  }
}

function copyToClipboard() {
  "use strict";
  var d = document.all("dest_text").value;
  window.clipboardData.setData('text', d);
}