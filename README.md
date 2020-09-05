# covid19Bot
Ｎ予備校　2020夏の特別授業 ”Google Apps で作る Slack Bot” で作った教材に、検査陽性率とR0(基本再生産数)の表示機能を追加しました。
release #3  'covid Prefecturename(Japan)' と入力すると感染状況＋検査陽性率と重症者数、感染死亡率とR0(基本再生産数)を返すBotです。

基本再生産数の計算式は、（直近7日間の新規陽性者数／その前7日間の新規陽性者数）^（平均世代時間／報告間隔）です。
計算式はwikipedia記事、京都大学／山中教授のサイト、東洋経済オンラインのサイト、北海道大学／西浦教授のサイト（敬称略、順不同）を参考にしています。
平均世代時間と報告間隔は、それぞれ簡易的に4.2と6.3としています。
CSVデータはkaz.ogiwaraさんのリポジトリを参照しています。

本アプリケーションの制作にあたり、Ｎ予備校の小枝先生、"すライム"様、"nshun"様をはじめ、たくさんの方々にご協力頂きました。貢献に感謝申し上げます。
