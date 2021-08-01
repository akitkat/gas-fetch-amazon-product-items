const spreadSheetId = SpreadsheetApp.getActiveSpreadsheet().getId()
const sheetNameProductItemList = 'Amazon商品リスト'

/*
 * アドオンメニュー追加.
 */
const onOpen = e => {
  SpreadsheetApp
    .getUi()
    .createAddonMenu()
    .addItem('商品情報取得', 'getProductItems')
    .addToUi()
}

/*
 * 未取得のasinリストからAmazonの商品情報を取得してスプレッドシートに書き出す.
 */
const getProductItems = () => {
  // jpy と krwのレートを取得.
  const rateJpyToKrw = getRateJpyToKrw_()

  const sqlProductItemList = SpreadSheetsSQL.open(spreadSheetId, sheetNameProductItemList)
  const asin = sqlProductItemList
    .select(['asin', 'ステータス'])
    .filter('asin > NULL AND ステータス = NULL')
    .result()
    .map(e => e.asin)

  // 検索対象asinがないので終了.
  if (asin.length < 1) {
    return
  }

  // 処理が重いためアイムアウトを回避するためにasinを5個ずつ処理する.
  chunk_(asin, 5).forEach(e => {
    const data = fetchAll_(e)

    // 商品取得できなかったので終了.
    if (data.length < 1) {
      return
    }

    // スプレッドシートに書き込み.
    updateRows_(sqlProductItemList, data, rateJpyToKrw)
  })
}

/*
 * 商品情報取得する.
 */
const fetchAll_ = (asin) => {
  try {
    const url = `${ScriptProperties.getProperty('AMAZON_API_BASE_URL')}${asin.join(',')}`
    const json = UrlFetchApp.fetch(url).getContentText()
    return JSON.parse(json)
  } catch (e) {
    console.error(e)
    throw e
  }
}

/*
 * スプレッドシートを更新する.
 */
const updateRows_ = (sql, data, rateJpyToKrw) => {
  data.forEach(e => {
    sql.updateRows({
      '商品名': e.title ?? '',
      '商品詳細': e.detail_table.replace(/\r?\n/g,"") ?? '',
      'Amazon価格(円)': e.price ?? '',
      '販売予定価格(ウォン)': e.price ? (e.price * 2 * rateJpyToKrw) : '',
      '画像1': e.images[0] ?? '',
      '画像2': e.images[1] ?? '',
      '画像3': e.images[2] ?? '',
      '画像4': e.images[3] ?? '',
      'ブランド名': e.brand ?? '',
      'ステータス': e.status ?? '',
      '備考': e.memo ?? '',
      '作成日時': Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss') ?? '',
      '更新日時': Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss') ?? '',
    }, `asin = ${e.asin}`)
  })
}

/*
 * 日本円とウォンのレートを取得する.
 */
const getRateJpyToKrw_ = () => {
  try {
    const url = 'https://api.aoikujira.com/kawase/json/jpy'
    const json = UrlFetchApp.fetch(url).getContentText()
    const data = JSON.parse(json)
    return data['KRW']
  } catch (e) {
    console.error(e)
    throw e
}
  }

/*
 * 配列をchunkする.
 */
const chunk_ = (arr, size) => {
  return arr.reduce(
    (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
    []
  )
}