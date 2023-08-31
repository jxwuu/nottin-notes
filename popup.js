//fading
function fade(element) {
  var op = 1; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.3;
  }, 30);
}

// unfade
function unfade(element) {
  var op = 0.1; // initial opacity
  element.style.display = "block";
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += op * 0.3;
  }, 30);
}

var titles = {
  title: "untitled",
  title0: "untitled",
  title1: "untitled",
  title2: "untitled",
  title3: "untitled",
  title4: "untitled",
  title5: "untitled",
  title6: "untitled",
  title7: "untitled",
};

var notes = {
  title: "content",
  title0: "content",
  title1: "content",
  title2: "content",
  title3: "content",
  title4: "content",
  title5: "content",
  title6: "content",
  title7: "content",
};

var note = {
  title: "untitled",
  content: "lorem ipsom",
};

var initial;

//initial loader
if (document.readyState == "loading") {
  var initial = new Promise(function (resolve, reject) {
    var permission = true;
    chrome.storage.sync.get(null, function (result) {
      permission = result;
      resolve(permission);
    });
  });
  initial.then(function (permission) {
    for (const key in permission) {
      if (key && permission[key] && document.getElementById(key)) {
        if (permission[key].length > 0) {
          document.getElementById(key).innerHTML = permission[key];
        } else {
          document.getElementById(key).innerHTML = "untitled";
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fade(document.getElementById("note"));
  unfade(document.getElementById("notebook"));
});

// from notebook to specific note (first note)
document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementsByClassName("page");
  for (var i = 0; i < link.length; i++) {
    link.item(i).addEventListener("click", function () {
      chrome.storage.sync.set({ currNote: this.id });
      record(this);
      var note = this.id + "note";
      var noteId = this.id;
      chrome.storage.sync.get([noteId, note], function (result) {
        document.getElementById("titleinput").value = result[noteId]
          ? result[noteId]
          : "";
        document.getElementById("noteinput").value = result[note]
          ? result[note]
          : "";
      });
      fade(document.getElementById("notebook"));
      unfade(document.getElementById("note"));
    });
  }
});

function record(currRecord) {
  var titleinput = document.getElementById("titleinput");
  var textinput = document.getElementById("noteinput");
  var currNote = chrome.storage.sync.get(currNote, function (result) {
    var noteId = result.currNote;
    var newNote = {};
    var newNoteContent = {};
    newNote[noteId] = titleinput.value;
    newNoteContent[noteId + "note"] = textinput.value;
    chrome.storage.sync.set(newNote);
    chrome.storage.sync.set(newNoteContent);
    document.getElementById(noteId).innerHTML = titleinput.value;
  });
}

// from note to notebook!
document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("gotoNotebook");
  link.addEventListener("click", function () {
    fade(document.getElementById("note"));
    unfade(document.getElementById("notebook"));
    chrome.storage.sync.get("currNote", function (result) {
      record(result.currNote);
    });
  });
});


