
$(function(){
  $('#search-result .man-hour-table .btn').click(function() {
    let $actual_time = $('<div id="ex__actual_time"></div>');
    let date = new Date(parseInt($(this).attr('onclick').match(/\d+/) + '000'));
    let ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    // 申請中の打刻時間を取得
    $.get(`/employee/adit/modify?year=${ymd[0]}&month=${ymd[1]}&day=${ymd[2]}`)
    .done(function(html){
      let start_time = getTimeRecord('start', html, ymd.join('-'));
      let end_time = getTimeRecord('end', html, ymd.join('-'));
      let work_m = computeMinutes(end_time - start_time) - 60; //休憩時間を除く
      setTimeout(function(){
        // defaultの「簡単入力」を反映
        let $table_column = $('#edit-menu-contents .man-hour-table.man-hour-table-edit .daily');
        if (!$table_column[0]) {
          $('#select-template select').val(1);
          executeLocalScript('changeTemplate();');
        }

        // 勤務時間などの表示
        $('#edit-menu-title').after($actual_time);
        let html = `<p>開始 ${stringWithZero(start_time.getHours())}:${stringWithZero(start_time.getMinutes())} ->
                       終了 ${stringWithZero(end_time.getHours())}:${stringWithZero(end_time.getMinutes())} （休憩 1時間）</p>
                    <p>勤務時間 ${stringTime(work_m)} （差分 <span class="diff_time">${stringTime(work_m - sumInputedCosts())}</span>）</p>`;
        $actual_time.html(html);
        setTimeout(function() {
          $("input[name='minutes[]']").trigger('input');
        }, 100);

        // 入力があった時の処理
        $("#edit-menu-contents").on('keyup input', "input[name='minutes[]']", function() {
          let val = $(this).val();
          if (/^\d+%$/.test(val)) {
            let costs_m = work_m * val.substr(0, val.length - 1) / 100;
            $(this).val(stringTime(costs_m));
          } else if (/^\d+:\d\d$/.test(val)) {
            let costs = val.split(':');
            let costs_m = costs[0] * 60 + costs[1] * 1;
            $('.diff_time', $actual_time).html(stringTime(work_m - (sumInputedCosts(this) + costs_m)));
            if ($(this).next('p.ex__cost_percent').length === 0) {
              $(this).after('<p class="ex__cost_percent"></p>');
            }
            $(this).next('p.ex__cost_percent').html(Math.round(costs_m / work_m * 100) +'%');
          }
        });
      }, 300);
    });
  });

  function getTimeRecord(flag, html, ymd) {
    let matches = flag === 'start' ? html.match(/intoModifyMode\(\d+, '(\d\d:\d\d)', '(入室|出勤)/)
                                   : html.match(/intoModifyMode\(\d+, '(\d\d:\d\d)', '(退室|退勤)/);
    return matches ? new Date(`${ymd} ${matches[1]}`) : new Date();
  }

  function sumInputedCosts(exclude) {
    let sum = 0;
    $("input[name='minutes[]']").each(function(i, input) {
      if (input != exclude) sum += parseInt($(input).next("input[name='hiddenMinutes[]']").val()) || 0;
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
  let time = value.split(':');
  let m = time[0] * 60 + time[2];
}

function stringWithZero(num) {
  return String(num + 100).substring(1);
}

function executeLocalScript(text) {
  let script = document.createElement('script');
  script.textContent = text;
  document.body.appendChild(script);
}
