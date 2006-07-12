/* $Id$ */

/**
 * function to add chatroom events handlers to the onscreen widgets
 */
var chatroomBlockAddEvents = function() {
  setInterval("chatroomBlockGetUpdates()", chatroomBlock.updateInterval);
  return;
}

/**
 * handles response from msg HTTP requests
 */
var chatroomBlockCallback = function(responseText, HttpRequest, chatroomDummyParam) {
  if (HttpRequest.responseText) {
    var resArray = eval(HttpRequest.responseText);
    if (typeof resArray == 'object' && typeof resArray.length != 'undefined') {
      if (resArray[0].length) {
        chatroomUpdateActiveChatList(resArray[0]);
      }
      if (resArray[1].length) {
        chatroomUpdateActiveChatroomList(resArray[1]);
      }
    }
  }
  return;
}

/**
 * handles updating the sitewide active chat list
 */
function chatroomUpdateActiveChatList(chats) {
  var chatList = $('chatroom-sitewide-chats');
  var chatsToDelete = [];

  if (chatList) {
    // reset the timestamp
    chatroomBlock.chatTimestamp = chats.pop();

    // get the list of chats
    var chatListItems = chatList.getElementsByTagName('li');

    // if there's no chats to add
    if (chats.length == 0) {
      // and there's only the 'no chats' item, exit
      if (chatListItems[0].id == 'chat_empty') {
        return;
      }
    }
    
    // delete items not in chats array 
    for (i = 0; i < chatListItems.length; i++) {
      var deleteFlag = true;
      for (j = 0; j < chats.length; j++) {
        if (chatListItems[i].id == chats[j].chatListId) {
          deleteFlag = false;
          chats[j].noAdd = 1;
        }
      }
      if (deleteFlag) {
        chatsToDelete.push(chatListItems[i].id);
      }
    }
    for (i = 0; i < chatsToDelete.length; i++) {
      chatList.removeChild($(chatsToDelete[i]));
    }

    // if we deleted all the items and there's nothing to add
    if (chatList.childNodes.length == 0 && chats.length == 0) {
      // add the 'no chats' li and exit
      var li = document.createElement('li');
      li.id = 'chat_empty';
      li.style.fontStyle = 'italic';
      li.appendChild(document.createTextNode('There are no active chats'));
      chatList.appendChild(li);
      return;
    }

    // add chats to the list
    for (i = 0; i < chats.length; i++) {
      if (typeof chats[i].noAdd == 'undefined') {
        var chatLink = document.createElement('a');
        chatLink.appendChild(document.createTextNode(chats[i].chatName));
        chatLink.setAttribute('href', chatroomBlock.chatBase + chats[i].ccid);

        var span = document.createElement('span');
        addClass(span, 'chatroomLink');
        span.appendChild(document.createTextNode('in room '));
        var roomLink = document.createElement('a');
        roomLink.appendChild(document.createTextNode(chats[i].roomName));
        roomLink.setAttribute('href', chatroomBlock.roomBase + chats[i].crid);
        span.appendChild(roomLink);

        var li = document.createElement('li');
        li.id = chats[i].chatListId;
        li.appendChild(chatLink);
        li.appendChild(document.createElement('br'));
        li.appendChild(span);

        chatList.appendChild(li);
      }
    }
  }
}

/**
 * handles updating the sitewide active chatroom list
 */
function chatroomUpdateActiveChatroomList(chatrooms) {
  var chatroomList = $('chatroom-sitewide-chatrooms');
  var chatroomsToDelete = [];

  if (chatroomList) {
    // reset the timestamp
    chatroomBlock.chatTimestamp = chatrooms.pop();

    // get the list of chatrooms
    var chatroomListItems = chatroomList.getElementsByTagName('li');

    // if there's no chatrooms to add
    if (chatrooms.length == 0) {
      // and there's only the 'no chatrooms' item, exit
      if (chatroomListItems[0].id == 'chatroom_empty') {
        return;
      }
    }
    
    // delete items not in chatrooms array 
    for (i = 0; i < chatroomListItems.length; i++) {
      var deleteFlag = true;
      for (j = 0; j < chatrooms.length; j++) {
        if (chatroomListItems[i].id == chatrooms[j].chatroomListId) {
          deleteFlag = false;
          chatrooms[j].noAdd = 1;
        }
      }
      if (deleteFlag) {
        chatroomsToDelete.push(chatroomListItems[i].id);
      }
    }
    for (i = 0; i < chatroomsToDelete.length; i++) {
      chatroomList.removeChild($(chatroomsToDelete[i]));
    }

    // if we deleted all the items and there's nothing to add
    if (chatroomList.childNodes.length == 0 && chatrooms.length == 0) {
      // add the 'no chatrooms' li and exit
      var li = document.createElement('li');
      li.id = 'chatroom_empty';
      li.style.fontStyle = 'italic';
      li.appendChild(document.createTextNode('There are no active chatrooms'));
      chatroomList.appendChild(li);
      return;
    }

    // add chatrooms to the list
    for (i = 0; i < chatrooms.length; i++) {
      if (typeof chatrooms[i].noAdd == 'undefined') {
        var chatroomLink = document.createElement('a');
        chatroomLink.appendChild(document.createTextNode(chatrooms[i].chatroomName));
        chatroomLink.setAttribute('href', chatroomBlock.roomBase + chatrooms[i].crid);

        var li = document.createElement('li');
        li.id = chatrooms[i].chatroomListId;
        li.appendChild(chatroomLink);
        chatroomList.appendChild(li);
      }
    }
  }
}

/**
 * gets updates from the server for chatroom blocks
 */
function chatroomBlockGetUpdates() {
  var postData = {block_update:1,module_base:chatroomBlock.moduleBase};
  var checkBlocks = false;
  if ($('chatroom-sitewide-chatrooms')) {
    postData.room_cache_file = chatroomBlock.roomCacheFile;
    postData.room_timestamp  = chatroomBlock.roomTimestamp;
    checkBlocks = true;
  }
  if ($('chatroom-sitewide-chats')) {
    postData.chat_cache_file = chatroomBlock.chatCacheFile;
    postData.chat_timestamp  = chatroomBlock.chatTimestamp;
    checkBlocks = true;
  }
  if (checkBlocks) {
    return HTTPPost(chatroomBlock.blockUrl, chatroomBlockCallback, false, postData);
  }
  return;
}

// Global Killswitch
if (isJsEnabled()) {
  addLoadEvent(chatroomBlockAddEvents);
}

/* vim: set expandtab tabstop=2 shiftwidth=2 autoindent smartindent: */