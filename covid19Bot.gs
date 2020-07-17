function doPost(e) {
  // Slack Event Subscription 認証用のレスポンス
  var params = JSON.parse(e.postData.getDataAsString());
    if (params.type == "url_verification") {
    return ContentService.createTextOutput(params.challenge);
   }
  
  var texts = params.event.text.split(" ");
  if (texts[0] == "covid19") {
    // 感染状況データを取得    
    var urlData = "https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/" //kaz-ogiwaraさんのリポジトリよりcovid19のマスターデータを取得
    var prefecturesCsv = UrlFetchApp.fetch(urlData + 'prefectures.csv').getContentText("UTF-8");
    var prefectures = Utilities.parseCsv(prefecturesCsv);
    var summaryCsv = UrlFetchApp.fetch(urlData + 'summary.csv').getContentText("UTF-8");
    var summary = Utilities.parseCsv(summaryCsv);
    
    // 選択された都道府県の最新データを取得
    var target = texts[1];
    if (texts[1] == null) {
      target = 'Tokyo' //'covid19'とだけ入力されたときに’Tokyo'を自動補足する処理
      var datas = prefectures.filter(i => i[4] == target); // 東京都のデータを抽出
    }else{
      var datas = prefectures.filter(i => i[4] == target ); // 指定した自治体のデータを抽出
    }

    var latest = datas.pop(); // 最新データ
    var pre = datas.pop(); // 最新1日前のデータ
    var date = latest[0] + '/' + latest[1] + '/' + latest[2]; // 最新日付
    var testedPositive = latest[5] - pre[5]; // 検査陽性人数（累計値なので差分を取得）
    var tested = latest[6] - pre[6];  // 検査人数
    
    var sumToday = summary[summary.length-1][3]; //summaryから最新日付の累計陽性者数を所得
    var sum1wAgo = summary[summary.length-8][3]; //最新日付の１週間前のデータを所得
    var sum2wAgo = summary[summary.length-15][3]; //最新日付の２週間前のデータを所得
    var death = summary[summary.length-1][8]; //summaryから最新日付の死者数を所得
    var change1w = sumToday - sum1wAgo; //直近１週間の増加数を計算
    var change1wb = sum1wAgo - sum2wAgo; //上記の前の週の増加数を計算
    var rNumber = (change1w / change1wb)**(4.2 / 6.3);　//ＲＯ計算式：（直近7日間の新規陽性者数／その前7日間の新規陽性者数）^（平均世代時間／報告間隔）
    rNumber = rNumber.toFixed(2);　//平均世代時間を4.2、報告間隔を6.3として簡易的に計算した値を小数点第２位の数値に成型
    var testedPositiveRatio = testedPositive / tested *100;//検査陽性率を計算
    testedPositiveRatio = testedPositiveRatio.toFixed(1);//小数点第１位の数値に成型
    var mortality = death/sumToday*100; //死亡率を計算
    mortality = mortality.toFixed(1); //小数点第１位の数値に成型
    
    var message = `【${target} のcovid-19感染状況】[${date}] 陽性: ${testedPositive}, 検査人数: ${tested}, 検査陽性率: ${testedPositiveRatio +'%'}, 【国内】死亡率: ${mortality+'%'}, R0: ${rNumber} `; //死亡率とR0を追加
  
    // Slack に送信
    var options = {
      "method" : "POST",
      "headers": {"Content-type": "application/json"},
      "payload" : '{"text":"' + message + '"}',
    };
    var webhookUrl = "your webhookUrl　//Slackから取得した webhook の URL を設定";
    UrlFetchApp.fetch(webhookUrl, options);
    }
}
