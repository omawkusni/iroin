'use strict';
const ConversionButton = document.getElementById('buttonid');
const colorElement = document.getElementsByName('boincolor');
const divcanvasElement = document.getElementById('divcanvasid');

const textElement = document.getElementById('textid')

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
  // キャンバスに未対応の場合

  //テキストを1文字づつ配列にいれる
  const arrText = textElement.value.split('');
  //キャンバスの作成
  if( document.getElementById("canvasid") != null ){
    document.getElementById("canvasid").remove();
  }

  const newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("width", "1000");
  newCanvas.setAttribute("height", "1000");
  newCanvas.setAttribute("id", "canvasid");
  divcanvasElement.appendChild(newCanvas);
  
  //キャンバスを設定
  const canvasElement = document.getElementById('canvasid');
  const ctx = canvasElement.getContext('2d');
  ctx.clearRect(0, 0, 1000, 1000)//描画をクリア
  ctx.font = 'bold 10pt 游明朝';
  let recX = 0
  let recY = 0

  /**
   * Mapオブジェクト
   * (key：追加順No
   * value:{moji:音節,shuin:音節の主韻,haba:音節の幅})
   */
  const mapOnsetsu = makeOnsetsuMap(arrText)

  mapOnsetsu.forEach((obj, key) => {
    let thisColor
    if (obj.moji === '\n') {
      recX = 0
      recY = recY + 70
    } else {
    //母音５行とスペースで対象要素を配列から探して色をセット
      arrByBoin.forEach((value, index) => {
        let re = new RegExp('['+ value +']')
        if (re.test(obj.shuin) ) {
          thisColor = colorElement[index].value;
        }
      })
    //四角形と文字を作成
      ctx.fillStyle = thisColor; 
      ctx.fillRect(recX*60, recY , 50, 50);
      ctx.fillText(obj.moji,recX * 60 + culcRecX(obj.haba,10,50), recY + 65);
      recX++
    }
  })
 


/**
 * 文を音節ごとにわけてMAPで返す。音節の主韻と音節幅も一緒にMapに入れる
 * 主韻は造語です。音節の中で母音を取る文字です。
 * ex.「きゃ」の場合「ゃ」の”あ”が母音となるので主韻として「ゃ」をセット
 * @param {Array} arrtext /文を一字づつに分けた配列
 * @returns {}　/key：追加順番号 value：{moji：音節,shuin：音節の主韻,haba：音節の幅})
 */
 function makeOnsetsuMap(arrtext) {
  let bufMoji = ''//仮音節変数
  let bufShuin = ''//仮主韻変数
  let cntMapSet = 0 //Mapにセットした回数をカウントする Mapのindexにする
  const mymap = new Map()

  arrtext.forEach((str, index) => {
    switch (true) {
      case index === 0 : //最初の要素
      case  (/[ぁぃぅぇぉゃゅょゎゕゖ]/.test(str)) ://拗音
        bufMoji = bufMoji + str; //前の文字にくっつける
        bufShuin = str; // 主韻にする
        break;
      case (/っ/.test(str)) ://促音
        bufMoji = bufMoji + str;
        break;
      case(/[ぁ-ゖ　 \n]/.test(str)) ://ひらがな(先のcaseでで拗音・促音をはじいている)、全角・半角スペース、改行
        //変数に入っている言葉をMAPにセット
        mymap.set (cntMapSet,{moji:bufMoji, shuin: bufShuin,haba:countHaba(bufMoji)});
        cntMapSet++;
        //現在の要素を変数にいれる
        bufMoji = str;
        bufShuin = str; //スペースと改行も主韻に入ってしまうが、問題ない
        break;
      default: //カタカナ・英語等
        bufMoji = bufMoji + str;
        break;  
    }
  
  //最終の要素ならMapに追加
    if (index === arrtext.length - 1){
        mymap.set (cntMapSet,{moji:bufMoji, shuin: bufShuin,haba:countHaba(bufMoji)})
    }
  })
  
  return mymap;
}




/**
 * 対象文字がひらがな・空白(全角・半角)・長音符（ー、～）かどうか
 * @param {String} str 
 * @returns {Boolean}
 */
function isNotHiragana(str){
  str = (str==null)?"":str;
  return !/[ぁ-ゖー～　 ]/.test(str); //"～"の後ろの文字は全角スペースと半角スペース
}


/**
 * 対象文字が拗音かどうか
 * @param {String} str 
 * @returns {Boolean}
 */
function isYouon(str){
  str = (str==null)?"":str;
  return /[ぁぃぅぇぉゃゅょゎゕゖ]/.test(str);
}


/**
 * 全角半角を区別した文字幅を返す
 * @param {String} strs /数えたい文字列
 * @returns {Number}
 */
function countHaba(strs) {
    const arrstr = strs.split('')
    let mojihaba = 0
    arrstr.forEach(element => {
      if(/[ -~]/.test(element) ) { //半角だったら0.5足す
          mojihaba += 0.5;
      } else {
          mojihaba +=  1; //全角だったら1足す
      }
    })
    return mojihaba;
  }
}

/**
 * 文字列を四角形の中心に表示するための、文字開始位置を計算
 * @param {Number} mojihaba /文字の幅
 * @param {Number} ptmojisize /文字の大きさ 単位：ポイント
 * @param {Number} pxrecsize /四角形の幅 単位：ピクセル
 * @returns　/文字の開始位置 単位：ピクセル
 */
function culcRecX(mojihaba,ptmojisize,pxrecsize) {
  const pxmojisize = ptmojisize * 1.33 // 1px =　1.33pt
  return Math.round((pxrecsize - mojihaba * pxmojisize)/2); 
}