
$(function(){
  let first = new MutationObserver(prepareUsefulChannelList);
  first.observe($('#channel-list')[0], {childList: true});
  let useful_list = new MutationObserver(refreshUsefulChannelList);
  let types = ['all', 'team', 'club', 'group', 'other'];

  function prepareUsefulChannelList() {
    let $useful_list = $('<ul id="useful-channel-list"></ul>');
    $('#channel-list').after($useful_list);
    $.each(types, function(i, type) {
      $useful_list.append(`<div id="useful-channel-list-${type}">
                             <p class="title"><i></i> ${type}<span class="num"></span></p>
                           </div>`);
    });
    first.disconnect();
    useful_list.observe($('#channel-list')[0], {childList: true});

    $('#useful-channel-list .title').click(function() {
      let $icon = $('i', $(this))
      $icon.toggleClass('open');
      $(this).nextAll(':not(.unread, .active)').toggle($icon.hasClass('open'));
    });
  }

  function refreshUsefulChannelList() {
    let $channels = $('#channel-list li');
    if (!$channels[0]) return;

    clearUsefulChannelList();
    let count = {};
    $.each(types, function(i, type){ count[type] = 0; });
    $channels.each(function(i, channel) {
      let type = getChannelType(channel);
      $('#useful-channel-list-' + type).append($(channel));
      count[type] += 1;
    });
    $.each(count, function(type, num) {
      let $useful_channels = $('#useful-channel-list-' + type);
      $('.num', $useful_channels).html(num);
      if ($('i', $useful_channels).hasClass('open')) {
        $('li:not(.unread, .active)', $useful_channels).show();
      }
    });
  }

  function clearUsefulChannelList() {
    $('#useful-channel-list li').remove();
  }

  function getChannelType(channel) {
    let labels = $('a', $(channel)).attr('aria-label').split(', ');
    let type = labels[0].split('_')[0];
    if ($(channel).hasClass('group')) return 'group';
    if (!types.includes(type)) return 'other';
    return type;
  }
});
