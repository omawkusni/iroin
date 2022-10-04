/**四角形のサイズを基準として、文字サイズや図形間の間隔を指定*/
class CvsShape {
  #_recSize
  #_recSpaceX
  #_recSpaceY
  #_fontSize
  #_fontSpace

  constructor(rectangleSize) {
    this.#_recSize = rectangleSize
    this.#_recSpaceX = Math.round(this.#_recSize * 0.25) + this.#_recSize
    this.#_recSpaceY = Math.round(this.#_recSize * 0.4) + this.#_recSize
    this.#_fontSize = Math.round(this.#_recSize * 0.23)
    this.#_fontSpace = Math.round(this.#_fontSize*0.1) + this.#_fontSize
  }
  get recSize() {return this.#_recSize;}
  get recSpaceX() {return this.#_recSpaceX;}
  get recSpaceY() {return this.#_recSpaceY;}
  get fontSize() {return this.#_fontSize;}
  get fontSpace() {return this.#_fontSpace;}

  recStartPointX(cntX) {
    return cntX * this.recSpaceX;
  }

  recStartPointY(cntY) {
    return cntY * this.recSpaceY;
  }

  txtStartPointX(mojihaba,cntX) {
    return this.recStartPointX(cntX) + Math.round((this.recSize - mojihaba * this.fontSize)/2);
  }

  txtStartPointY(cntY) {
    return this.recStartPointY(cntY) + this.recSize + this.fontSpace ;
  }

  cvsHight(maxGyo){
    return maxGyo * (this.recSpaceY + this.fontSpace);
  }

  cvsWidth(maxMojisu){
    return maxMojisu * (this.recSpaceX);
  }
}

function createCanvas(width,height) {
  const newCanvas =document.createElement("canvas");
  // キャンバスに未対応の場合
  if (!newCanvas.getContext) {
    alert("すいません。表示ができません。" )
    return;
  }
  newCanvas.setAttribute("width", width);
  newCanvas.setAttribute("height", height);
  newCanvas.setAttribute("id", "canvasid");
  divcanvasElement.appendChild(newCanvas);
  return newCanvas
}

/**
 * 1行での最大文字数(音節数)を計算
 * @param {Map} mapOnsetsu Map音節/key：追加順番号 value：{moji：音節,shuin：音節の主韻,haba：音節の幅})
 * @returns {Number}　/最大文字数
 */
function culcMaxMojisu(mapOnsetsu) {
  let max = 0
  let preMojiNo = 0
  mapOnsetsu.forEach((obj, key) => {
    //keyは0はじまり
    if (/\n/.test(obj.moji) && (max < key - preMojiNo)) { 
      max = key - preMojiNo; //
      preMojiNo = key + 1;
      return;
    }
    if ((mapOnsetsu.size === key + 1) && (max < key + 1 - preMojiNo)) {
      max = key + 1 - preMojiNo;
    }
  })
  return max;
}

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
      case(/[ぁ-ゖ　 \n]/.test(str)) ://ひらがな(先のcaseでで拗音・促音をはじいている)とスペースと改行
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