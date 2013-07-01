function supports_html5_storage() {
  if (Modernizr.localstorage) {
    return true;
  } 
  else {
    return false;
  }
}

Storage.prototype.setObject = function(key, value) {
   "use strict";
   this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  "use strict";
  var value = this.getItem(key);
   return value && JSON.parse(value);
}



var counter;

function getCounterStart() {
  var countObject = localStorage.getItem("counter");
  if (countObject) {
    counter = countObject;
  }
  else {
    counter = 0;
  }
}

function setCounter(count) {
  // I guess this parses ints
  localStorage.setItem("counter", count);
}



$(document).ready(function() {
  // click handler for about drop down
  $('#about').click(function() {
    $('#aboutDropDown').slideToggle();
  });

  // keybinding enter to submit add
  $('#addNameInput').keypress(function (e) {
    if (e.which == 13) {
      addItem();
    }
  });

  // modal set focus
  $('#addModal').on('shown', function () {
    $('#addNameInput').focus();
  });

  // check if local storage is supported
  var supportsStorage = supports_html5_storage();
  if (!supportsStorage) {
    $('#content').hide();
    alert("This application depends on HTML5's local storage ");
    return;
  }

  // set counter
  getCounterStart();

  // print out all list item content
  printAll();
  $('#saveButton').hide();
  $('#deleteButton').hide();
});

function printAll() {
  // clear current content
  $('#itemList').empty();

  // add localStorage info
  for (var i = 0; i < localStorage.length; i++){
    // don't show counter
    var key = localStorage.key(i);
    if (key === 'counter') { continue; };
    
    // build item list
    var item = localStorage.getObject(localStorage.key(i));
    var listItem = '<div id="item' + localStorage.key(i) + '" class="listItem">';
    listItem += '<div id="' + localStorage.key(i) + '"class="span11">';
    listItem += '- ' + item.name + "</div>";
    listItem += '<div class="span1" '
    listItem += 'onclick="loadItem(\'' + localStorage.key(i) + '\');">';
    listItem += '<i class="icon-chevron-right"></i>';
    listItem += '</div></div>';
    $('#itemList').append(listItem);
  }
}

function loadItem(key) {
  // get value from localStorage
  var value = localStorage.getObject(key);
  $('#contentText').val(value.content);

  // clear selected from list of items
  $('.selected').removeClass('selected');

  // set selected on correct item
  $('#item' + key).addClass('selected');

  // set button attributes
  $('#saveButton').show();
  $('#deleteButton').show();
  $('#saveButton').attr("onclick", 'saveItem("' + key + '");');
  $('#deleteButton').attr("onclick", 'removeItem("' + key + '");');
}

function addItem() {
  // clear textarea
  $('#contentText').val("");

  // get item name from modal
  var itemName = $('#addNameInput').val();

  // save object to localStorage
  var itemObject = { "name":itemName, "content":""};
  localStorage.setObject(counter, itemObject);
  counter++;
  setCounter(counter);

  // re-print list of items
  printAll();
  // clear selected from list of items
  $('.selected').removeClass('selected');
  // set selected on correct item
  var key = counter - 1;
  $('#item' + key).addClass('selected');

  // show buttons
  $('#saveButton').show();
  $('#deleteButton').show();
  $('#saveButton').attr("onclick", 'saveItem("' + key + '");');
  $('#deleteButton').attr("onclick", 'removeItem("' + key + '");');

  // close and clear modal
  $('#addNameInput').val("");
  $('#addModal').modal('hide');
  $('#contentText').focus();
}

function saveItem(key) {
  // get object from localStorage  
  var item = localStorage.getObject(key);

  // get text
  var text = $('#contentText').val();
  item.content = text;

  // save object to localStorage
  localStorage.setObject(key, item);

  alert("Item Saved!");
}

function removeItem(key) {
  // remove from local storage
  localStorage.removeItem(key);

  // clear textarea
  $('#contentText').val("");
  printAll();

  // change buttons
  $('#saveButton').hide();
  $('#deleteButton').hide();
}


