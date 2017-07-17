var pCount = "";
var mCount = "";
var timer;
var icon;
var sound;
var time;
var myAudio = new Audio();
myAudio.src = "/sound.mp3";

function startNotification(){
  timer = setInterval(function()
  {
    check();
  },time);
}

function stopNotification(){
  clearInterval(timer);
  chrome.browserAction.setBadgeText({text: ''});
}


chrome.storage.local.get('time', function(t){
  if(t>=5 && t<=999) time = t * 1000;
  else {
    time = 20 * 1000;
    chrome.storage.local.set({'time': '20'});
  }
});
chrome.storage.local.get('isNotificationOn', function(isNotificationOn){
  if(isNotificationOn['isNotificationOn']==null) chrome.storage.local.set({'isNotificationOn': true});
  if(isNotificationOn['isNotificationOn']) startNotification();
});
chrome.storage.local.get('iconSetting', function(iconSetting){
  if(iconSetting['iconSetting']==null) chrome.storage.local.set({'iconSetting': 1});
  icon = iconSetting['iconSetting'];
});
chrome.storage.local.get('soundSetting', function(soundSetting){
  if(soundSetting['soundSetting']==null) chrome.storage.local.set({'soundSetting': 1});
  sound = soundSetting['soundSetting'];
});


chrome.storage.onChanged.addListener(function(changes, namespace) {
  var name;
  for(var item in changes){
    name = item;
  }
  switch(name){
    case 'isNotificationOn':
    if(changes[name]['newValue']) startNotification();
    else stopNotification();
    break

    case 'iconSetting':
    icon = changes[name]['newValue'];
    break

    case 'soundSetting':
    sound = changes[name]['newValue'];
    break

    case 'time':
    if(changes[name]['newValue']>=5 && changes[name]['newValue']<=999) time = changes[name]['newValue'] * 1000;
    else{
      time = 20 * 1000;
      chrome.storage.local.set({'time': '20'});
    }
    stopNotification();
    startNotification();
    break
  }
});

chrome.browserAction.setBadgeBackgroundColor({color: '#67BB58'});

function check(){
  var page = $.ajax('http://pikabu.ru/profile.php?page=9999');

  page.done(function (data) {

    $(data).find('.b-user-menu-list').each(function(){
      var newPCount = $(this).find('li:nth-child(4)').find('.b-user-menu-list__count').text();
      var newMCount = $(this).find('li:nth-child(6)').find('.b-user-menu-list__count').text();

      if(mCount < newMCount && mCount!=null && newMCount!=null){
        mCount = newMCount;
        if(sound==1 || sound==2) myAudio.play();
      }
      if(newMCount==null || newMCount=="") mCount = 0;

      if(pCount < newPCount && pCount!=null && newPCount!=null){
        pCount = newPCount;
        if(sound==2 || sound==3) myAudio.play();
      }
      if(newPCount==null || newPCount=="") pCount = 0;

      if(icon==1) chrome.browserAction.setBadgeText({text: newMCount});
      else if(icon==2) chrome.browserAction.setBadgeText({text: newPCount});
      else chrome.browserAction.setBadgeText({text: ''});

    });
  });
}

