
$(function() {
  $('#search-result .man-hour-table .btn').click(function() {
    let $actual_time = $('<div id="ex__actual_time"></div>');
    let date = new Date(parseInt($(this).attr('onclick').match(/\d+/) + '000'));
    let ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    // 申請中の打刻時間を取得
    $.when($.get(`/employee/adit/modify?year=${ymd[0]}&month=${ymd[1]}&day=${ymd[2]}`), openEditMenu())
    .then(function(res) {
      let d = new $.Deferred;
      let start_time = getTimeRecord('start', res[0], ymd.join('-'));
      let end_time = getTimeRecord('end', res[0], ymd.join('-'));
      let work_m = computeMinutes(end_time - start_time) - 60; //休憩時間を除く
      work_m > 0 && work_m < 12 * 60 ? d.resolve(start_time, end_time, work_m) : d.reject();
      return d.promise();
    }).done(function(start_time, end_time, work_m) {
      // 工数の入力がまだなければ、「簡単入力」の一つ目をdefaultとして反映
      let $table_column = $('#edit-menu-contents .man-hour-table.man-hour-table-edit .daily');
      if (!$table_column[0]) {
        $('#select-template select').val(1);
        executeLocalScript('changeTemplate();');
      }

      // 勤務時間などの表示
      $('#edit-menu-title').after($actual_time);
      let actual_html = `<p>開始 ${stringWithZero(start_time.getHours())}:${stringWithZero(start_time.getMinutes())} ->
                     終了 ${stringWithZero(end_time.getHours())}:${stringWithZero(end_time.getMinutes())} （休憩 1時間）</p>
                  <p>勤務時間 ${stringTime(work_m)} （差分 <span class="diff_time">${stringTime(work_m - sumInputedCosts())}</span>）</p>`;
      $actual_time.html(actual_html);

      // 入力があった時の処理
      $("#edit-menu-contents").on('keyup input', "input[name='minutes[]']", function() {
        let val = $(this).val();
        if (/^\d+%$/.test(val)) {
          let costs_m = work_m * val.substr(0, val.length - 1) / 100;
          $(this).val(stringTime(costs_m));
        } else if (/^\d+:\d\d$/.test(val)) {
          $('.diff_time', $actual_time).html(stringTime(work_m - sumInputedCosts()));
          if ($(this).next('p.ex__cost_percent').length === 0) {
            $(this).after('<p class="ex__cost_percent"></p>');
          }
          $(this).next('p.ex__cost_percent').html(Math.round(revertStringTime(val) / work_m * 100) +'%');
        }
      });

      // 初期の入力値反映
      setTimeout(function() {
        $("input[name='minutes[]']").trigger('input');
      }, 100);
    });
  });

  function openEditMenu() {
    let d = new $.Deferred;
    let open = setInterval(function() {
      if ($('#edit-menu').css('display') === 'block') {
        clearInterval(open);
        d.resolve();
      }
    }, 150);
    return d.promise();
  }

  function getTimeRecord(flag, html, ymd) {
    let matches = flag === 'start' ? html.match(/intoModifyMode\(\d+, '(\d\d:\d\d)', '(入室|出勤)/)
                                   : html.match(/intoModifyMode\(\d+, '(\d\d:\d\d)', '(退室|退勤)/);
    return matches ? new Date(`${ymd} ${matches[1]}`) : new Date();
  }

  function sumInputedCosts() {
    let sum = 0;
    $("input[name='minutes[]']").each(function(i, input) {
      if ($(input).val()) sum += revertStringTime($(input).val());
    });
    return sum;
  }
});

function computeMinutes(ms) {
  return Math.floor(ms / 60000);
}

function stringTime(m) {
  let symbol = m >= 0 ? '' : '-';
  let h_s = stringWithZero(Math.floor(Math.abs(m) / 60));
  let m_s = stringWithZero(Math.floor(Math.abs(m) - (h_s * 60)));
  return `${symbol}${h_s}:${m_s}`;
}

function revertStringTime(hm) {
  let time = hm.split(':');
  return time[0] * 60 + time[1] * 1;
}

function stringWithZero(num) {
  return String(num + 100).substring(1);
}

function executeLocalScript(text) {
  let script = document.createElement('script');
  script.textContent = text;
  document.body.appendChild(script);
}
