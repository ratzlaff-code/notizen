function qS(s) {
  return document.querySelector(s);
}

var myApp = {
  selectedNote: null,
  editor: qS('#editor'),
  editorNote: qS('#editorNote'),
  aNote: qS('.aNote'),
  stack: qS('#stack'),
  myConf: qS('#myConf'),
  myInfo: qS('#myInfo'),
  colPalette: qS('#colPalette'),
  colPaletteArr: ["#FFFFFF", "#EF9A9A", "#FFCC80", "#CE93D8", "#FFF59D", "#A5D6A7", "#81D4FA", "#F48FB1"],
  bgrLogo: qS('#bgrLogo'),

  router: function() {
    var myHash = location.hash.split('-');
    
    if (myHash[0] === '') {
     myApp.editor.style.display = '';
     myApp.colPalette.style.display = '';
     myApp.myConf.style.display = '';
     myApp.myInfo.style.display = '';
    }
    else if (myHash[0] == '#info') {
      myApp.myInfo.style.display = "block";
    }
    else if (myHash[0] == '#add') {
      myApp.editorNote.innerHTML = "";
      myApp.editor.style.display = "block";
    }
    else if (myHash[0] == '#edit') {
      myApp.selectedNote = document.getElementById(myHash[1]);
      
      if (myApp.selectedNote !== null) {
        myApp.editorNote.innerHTML = myApp.selectedNote.innerHTML;
        myApp.colPalette.dataset.color = myApp.selectedNote.style.backgroundColor;
        myApp.editor.style.display = "block";
      }
      else {
        location.hash = 'add';
      }
    }
  }
};

//------------------------------------------------------------------------------

function chCheck(ev, el) {
  if (ev.clientX < el.getBoundingClientRect().left) {
    el.dataset.check = (el.dataset.check == "check_box_outline_blank") ? "check_box" : "check_box_outline_blank";
  }
}

function chColor(el) {
  myApp.colPalette.dataset.color = el.style.backgroundColor;
}


function chStack() {
  if (myApp.stack.innerHTML) {
       myApp.stack.style.display = 'block';
       myApp.bgrLogo.style.display = 'none';
     }
  else {
    myApp.stack.style.display = 'none';
    myApp.bgrLogo.style.display = 'block';
  }
}

//------------------------------------------------------------------------------

window.addEventListener('load', function() {
  myApp.router();
});

window.addEventListener('hashchange', function() {
  myApp.router();
});

qS('#showInfo').addEventListener('click', function() {
  location.hash = 'info';
});

qS('#add').addEventListener('click', function() {
  location.hash = 'add';
});

qS('#save').addEventListener('click', function() {
  if (!myApp.editorNote.innerHTML) {
      history.back();
      return;
  }
  
  if (location.hash == "#add") {
    var newNote = myApp.aNote.cloneNode(true);
    newNote.innerHTML = myApp.editorNote.innerHTML;
    newNote.id = new Date().getTime();

    var randColor = myApp.colPaletteArr[Math.round(Math.random() * 7)];
    newNote.style.backgroundColor = randColor;
    newNote.style.display = "block";

    myApp.stack.appendChild(newNote);
  }
  else if (location.hash.search('#edit') === 0) {
    myApp.selectedNote.innerHTML = myApp.editorNote.innerHTML;
    myApp.selectedNote.style.backgroundColor = myApp.colPalette.dataset.color;
  }

  localStorage.setItem("myStack", myApp.stack.innerHTML);
  history.back();
  
  chStack();
});


qS('#formBold').addEventListener('click', function() {document.execCommand('bold');});
qS('#formItalic').addEventListener('click', function() {document.execCommand('italic');});
qS('#formUnderline').addEventListener('click', function() {document.execCommand('underline');});
qS('#formBullets').addEventListener('click', function() {document.execCommand('insertUnorderedList');});
qS('#formNumbers').addEventListener('click', function() {document.execCommand('insertOrderedList');});

qS('#formCheck').addEventListener('click', function() {
  document.execCommand('insertUnorderedList');
  
  var focPointer = window.getSelection().focusNode;
  while (focPointer.id != "editorNote") {
    if (focPointer.nodeName == "LI") {
      
      focPointer = focPointer.parentElement;
      focPointer.className = "checkList";
      
      for (var i = 0, chL = focPointer.children.length; i < chL; i++) {
        if (!focPointer.children[i].dataset.check) {
          focPointer.children[i].dataset.check = 'check_box_outline_blank';
        }
        focPointer.children[i].setAttribute('onclick', 'chCheck(event, this)');
      }
    }
    focPointer = focPointer.parentNode;
  }
});

qS('#formColor').addEventListener('click', function() {
  myApp.colPalette.style.display = (myApp.colPalette.style.display === '') ? 'block' : '';
});

qS('#formColor').addEventListener('blur', function() {
  myApp.colPalette.style.display = '';
});

//------------------------------------------------------------------------------

qS('#del').addEventListener('click', function() {
  myConf.style.display = 'block';
});

qS('#myConfYes').addEventListener('click', function() {
  if (location.hash.search('#edit') === 0) {myApp.selectedNote.remove();}
      localStorage.setItem("myStack", myApp.stack.innerHTML);
      //location.hash = '';
      history.back();
      
      chStack();
});

qS('#myConfNo').addEventListener('click', function() {
      myApp.myConf.style.display = '';
});

//------------------------------------------------------------------------------

qS('#myInfoClose').addEventListener('click', function() {
      history.back();
});