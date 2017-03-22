# chrome extensions
 - Jobcan Assistant　（ジョブカンにおける作業工数入力の補助）
   - 申請中（承認前）の打刻からも開始時間・終了時間・差分を表示。
   - 「簡単入力」の一つ目を最初から選択。
   - 入力時間のパーセント表示、またパーセント入力の変換（「〇〇%」と入力すると自動的に時間に変換）
 - Slack Extension　（Slackのチャンネルリストを見やすく表示）
   - 自分宛以外の未読数も表示
   - グループごとにまとめて表示
   - 既読チャンネルの表示/非表示切り替え
     
# Download
ページ右上の『Clone or download』からcloneもしくはdownload zipして解凍してください。
![cloneordownload](https://cloud.githubusercontent.com/assets/1951287/24183105/77926e18-0f09-11e7-82d8-db659452066a.jpg)

# chromeに反映
1. chromeを開いて、url欄に`chrome://extensions/`を入力。
2. 右上の「デベロッパーモード」をチェック。
![default](https://cloud.githubusercontent.com/assets/1951287/24183162/f5d40dea-0f09-11e7-886b-edd090484382.jpg)
3. 「パッケージ化されていない拡張機能を読み込む」
4. 各extensionのフォルダ（直下にmanifest.jsonがあるフォルダ）を選択
 
# 注意
- chrome起動時に毎回「デベロッパーモードの拡張機能を無効にする」というダイアログが表示されるので「キャンセル」を選択。
  - 拡張機能リスト（`chrome://extensions/`）を開いて、対象のextensionを有効にしてください。
