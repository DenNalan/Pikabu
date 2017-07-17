$('document').ready(function(){
  create();
  onClickTabs();
});

function create(){
  chrome.storage.local.get('tab', function (tab){
    var tabNum = tab['tab'];

    if(tabNum!=1 && tabNum!=2) tabNum = 1;

    var page;
    if(tabNum==1) {
      page = $.ajax('http://pikabu.ru/freshitems.php');
      $('.tab1').css({'border-bottom': '3px solid #5190b8', 'margin-bottom': '-2px'});
    }
    else {
      page = $.ajax('http://pikabu.ru/subs?st=7&r=0');
      $('.tab2').css({'border-bottom': '3px solid #5190b8', 'margin-bottom': '-2px'});
    }

    page.done(function (data) {
      $(data).find('#wrap').each(function(){
        data = this;
      });

      $(data).find('.b-user-menu__avatar').each(function(){
        $('.avatarTd').append($(this));
      });

      $(data).find('.b-user-menu__header a:nth-child(1)').each(function(){
        $('.secondTd').prepend($(this));
      });

      $(data).find('.b-user-menu-list').each(function(){
        var messages = $(this).find('li:nth-child(6)');
        $('.menu').prepend(messages);
        if(messages.children().length==2) messages.append('<a class="b-user-menu-list__count">0</a>');


        var posts = $(this).find('li:nth-child(4)');
        $('.menu').prepend(posts);
        if(posts.children().length==2) posts.append('<a class="b-user-menu-list__count">0</a>');

        $('.menu').prepend($(this).find('li:nth-child(2)'));
        $('.menu').prepend($(this).find('li:nth-child(1)'));

      });


      if(tabNum==1) comments(data);
      else subs(data);

      changeHref();
    });
  });
}

function update(tabNum){
  for(var i=1;i<5;i++) $('.tab'+i).css({'border-bottom': '0', 'margin-bottom': '0'});
    $('.content').children().remove();

  var page;
  if(tabNum==3){
    $('.tab3').css({'border-bottom': '3px solid #5190b8', 'margin-bottom': '-2px'});
    $('.content').append($('<input type="checkbox" id="isNotificationOn" checked><span> Включить оповещения</span><h4>Что отображать на иконке?</h4><select id="iconSetting"><option value="1">Число новых комментариев</option><option value="2">Число новых постов в ленте</option><option value="3">Ничего</option></select><h4>Звуковые оповещения</h4><select id="soundSetting"><option value="1">Комментарии</option><option value="2">Комментарии и посты</option><option value="3">Посты</option><option value="4">Ничего</option></select><h4>Проверять новые матералы на сайте каждые</h4><input type="text" id="timeInput" size="2"> <span> секунд</span>'));
    
    chrome.storage.local.get('isNotificationOn', function(isNotificationOn){
      $('#isNotificationOn').prop("checked", isNotificationOn['isNotificationOn']);
    });
    $('#isNotificationOn').click(function(){
      chrome.storage.local.set({'isNotificationOn': this.checked});
    });

    chrome.storage.local.get('iconSetting', function(iconSetting){
      $('#iconSetting').val(iconSetting['iconSetting']);
    });
    $('#iconSetting').on('change', function() {
      chrome.storage.local.set({'iconSetting': this.value });
    });

    chrome.storage.local.get('soundSetting', function(soundSetting){
      $('#soundSetting').val(soundSetting['soundSetting']);
    });
    $('#soundSetting').on('change', function() {
      chrome.storage.local.set({'soundSetting': this.value });
    });

    $('#timeInput').attr("maxlength", 3);
    $('#timeInput').keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    chrome.storage.local.get('time', function(time){
      $('#timeInput').val(time['time']);
    });
    $('#timeInput').on('blur', function() {
      if(this.value>=5 && this.value<=999) chrome.storage.local.set({'time': this.value });
      else chrome.storage.local.set({'time': '20'});
    });

    
  }else{

    if(tabNum==1) {
      page = $.ajax('http://pikabu.ru/freshitems.php');
      $('.tab1').css({'border-bottom': '3px solid #5190b8', 'margin-bottom': '-2px'});
    }
    else if(tabNum==2){
      page = $.ajax('http://pikabu.ru/subs');
      $('.tab2').css({'border-bottom': '3px solid #5190b8', 'margin-bottom': '-2px'});
    }
    page.done(function (data) {
      $(data).find('#wrap').each(function(){
        data = this;
      });

      if(tabNum==1) comments(data);
      else subs(data);

      changeHref();
    });
  }
}

function changeHref(){
  $('a').each(function() {
    var href = this.href.split('/');
    var newHref = "";

    if(href[0] == "chrome-extension:"){
      for(var i=0; i<href.length; i++){
        if(i!=0&&i!=1&&i!=2){
          newHref += "/";
          newHref += href[i];
        }
      }

      $(this).attr('href', 'http://pikabu.ru' + newHref);
    }
  });
}
function onClickTabs(){
  $('.tab1').click(function(){
    chrome.storage.local.set({'tab': 1}, function (tab){ update(1); });
  });
  $('.tab2').click(function(){
    chrome.storage.local.set({'tab': 2}, function (tab){ update(2); });
  });
  $('.tab3').click(function(){
    update(3);
  });
  $('.tab4').click(function(){
    chrome.tabs.create({ url: 'http://pikabu.ru/' });
  });

}

function comments(data){
  $(data).find('.b-comments-profile').each(function(){
    $('.content').append(this);

    $(this).find('.b-comment__rating').each(function(){
      this.remove();
    });
    $(this).find('.b-comment__tools').each(function(){
      this.remove();
    });
    $(this).find('.b-comment__controls').each(function(){
      this.remove();
    });
    $(this).find('.b-comment-toggle').each(function(){
      this.remove();
    });

    $('.content').append('<hr>');
  });
}

function subs(data){
  $(data).find('.story').each(function(){
    var tr = $('<tr></tr>');
    $('.content').append(tr);
    var td1 = $('<td class="ratingTd"></td>');
    var td2 = $('<td></td>');
    tr.append(td1);
    tr.append(td2);

    $(this).find('.story__rating-count').each(function(){
      if($(this).children().length==1) td1.append($('<div class="story__rating-count">?</div>'));
      else td1.append($(this));
    });

    $(this).find('.story__header').each(function(){
      td2.append($(this));

      $(this).find('.story__tags').each(function(){
        this.remove();
      });

    });
  });
}