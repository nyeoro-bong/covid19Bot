 // 東京都の最新データを取得
  var target = texts[1];
    if (texts[1] == null) {
      target = 'Tokyo' //'covid'とだけ入力されたときに’Tokyo'を自動補足する処理
      var targetData = prefectures.filter(i => i[4] == target); // 東京都のデータを抽出
    }else{
      var targetData = prefectures.filter(i => i[4] == target ); // 指定した自治体のデータを抽出
    }
  var latest = targetData.pop(); // 最新データ
  var pre = targetData.pop(); // 最新1日前のデータ
  var date = latest[0] + '/' + latest[1] + '/' + latest[2]; // 最新日付
  var testedPositive = latest[5] - pre[5]; // 検査陽性人数（累計値なので差分を取得）
  var tested = latest[6] - pre[6];  // 検査人数
  
  var testedPositiveRatio = testedPositive / tested *100;//検査陽性率を計算
    if (tested == 0){
      testedPositiveRatio = 'N/A'; //検査人数がゼロの時は'N/A'を代入
    }else{
      testedPositiveRatio = testedPositiveRatio.toFixed(1); //小数点第１位の数値に成型
    }
  
  var sumtestedPositive = latest[5];
  var serious =latest[8];
  var deaths =latest[10];
  var fatality = deaths / sumtestedPositive *100;//陽性死亡率を計算
    if (deaths == 0){
      fatality = 'N/A'; //死者数がゼロの時は'N/A'を代入
    }else{
      fatality = fatality.toFixed(2);//小数点第２位の数値に成型
    }
  
    var message = `【${target} のcovid-19感染状況】[${date}] 陽性: ${testedPositive}, 検査人数: ${tested}, 検査陽性率: ${testedPositiveRatio +'%'}, 重症者: ${serious}, 死者: ${deaths}, 死亡率: ${fatality +'%'}`;

    // Slack に送信
    var options = {
      "method" : "POST",
      "headers": {"Content-type": "application/json"},
      "payload" : '{"text":"' + message + '"}',
    };
    var webhookUrl = " your webhookUrl　//Slackから取得した webhook の URL を設定 ";
    UrlFetchApp.fetch(webhookUrl, options);
    }
} 
