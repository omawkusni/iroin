'use strict';
const ConversionButton = document.getElementById('buttonid');
const textElement = document.getElementById('textid');
const divcanvasElement =document.getElementById('divcanvasid');
//colorElementとarrByBoinはあいうえお空白順にindexが並び相関する
const colorElement = document.getElementsByName('boincolor');
const arrByBoin = [
  "あかさたなはまらわがざだばぱぁやゃゕ",
  "いきしちにひみりゐぎじぢびぴぃ",
  "うくすつぬふむるんぐずづぶぷぅゆゅゔ",
  "えけせてねへめれゑげぜでべぺぇゖ",
  "おこそとのほもろをごぞどぼぽぉよょ",
  " 　" //半角スペースと全角スペース
  ];
  

  

//変換ボタンを押したときの出力
ConversionButton.onclick = () => {
  // テキストが空の時は処理を終了する
  if (textElement.length === 0) { return; }
  // キャンバス作成済みなら削除
  if( document.getElementById("canvasid") != null ){
    document.getElementById("canvasid").remove();
  }
  //テキストを1文字づつ配列にいれる
  const arrText = textElement.value.split('');
  /**
   * Mapオブジェクト
   * (key：追加順No
   * value:{moji:音節,shuin:音節の主韻,haba:音節の幅})
   */
  const mapOnsetsu = makeOnsetsuMap(arrText)
  var ClassShape = new CvsShape(50);//キャンバスの図形サイズに関するクラス作成
  const arrByKaigyo = textElement.value.split('\n');
  const newCanvas = createCanvas(ClassShape.cvsWidth(maxMojisu(mapOnsetsu)),ClassShape.cvsHight(arrByKaigyo.length));

  //キャンバスを設定
  const ctx = newCanvas.getContext('2d');
  const fontset = 'bold ' + ClassShape.fontSize + 'px' + ' 游明朝'
  ctx.font = fontset;
  let cntX = 0
  let cntY = 0

  mapOnsetsu.forEach((obj) => {
    if (obj.moji === '\n') {
      cntX = 0
      cntY ++
      return;
    }
    //各音節を母音別配列から探してインデックスをセットする
    let thisColor
    arrByBoin.forEach((value, index) => {
      let re = new RegExp('['+ value +']')
      if (re.test(obj.shuin) ) {
        thisColor = colorElement[index].value;
      }
    })
    //四角形と文字を作成
    ctx.fillStyle = thisColor; 
    ctx.fillRect(ClassShape.recStartPointX(cntX), ClassShape.recStartPointY(cntY), ClassShape.recSize, ClassShape.recSize);
    ctx.fillText(obj.moji,ClassShape.txtStartPointX(obj.haba,cntX), ClassShape.txtStartPointY(cntY));
    cntX++
  })
}