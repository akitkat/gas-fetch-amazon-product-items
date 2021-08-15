import {
  chunk_,
  deleteTrigger,
  getRateJpyToKrw_,
  isStop,
  setTrigger,
} from './utils'

const spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
const spreadSheetId = spreadSheet.getId()
const sheetNameProductItemList = 'Amazon商品リスト'

/*
 * 未取得のasinリストからAmazonの商品情報を取得してスプレッドシートに書き出す.
 */
export const getProductItems = () => {
  const lock = LockService.getScriptLock()
  if (! lock.tryLock(1000)) {
    spreadSheet.toast('多重実行のため処理を終了します.')
    return
  }

  try {
    const rateJpyToKrw = getRateJpyToKrw_()
    const sqlProductItemList = SpreadSheetsSQL.open(spreadSheetId, sheetNameProductItemList)
    const res = sqlProductItemList
      .select(['No.', 'asin', 'ステータス'])
      .filter('asin > NULL AND ステータス = NULL')
      .result()

    const asin = res.map(e => e.asin)

    if (asin.length < 1) {
      spreadSheet.toast('検索対象のasinがないので終了します.')
      return
    }

    const invalidAsin = validateAsin_(asin)
    if (0 < invalidAsin.length) {
      spreadSheet.toast(`検索対象のasinに不正な値が含まれます.不正なASIN: ${invalidAsin.join(',')}`)
      return
    }

    // 処理が重いためアイムアウトを回避するためにasinを5個ずつ処理する.
    chunk_(res, 5).forEach(e => {
      const data = fetchAll_(e)

      // 商品取得できなかったので終了.
      if (data.length < 1) {
        return
      }

      // スプレッドシートに書き込み.
      updateRows_(sqlProductItemList, e, data, rateJpyToKrw)
    })
  } catch (e) {
    console.error(e)
  } finally {
    // ロック解除.
    lock.releaseLock()
  }
}

/*
 * ASINが適切かチェックする.
 */
const validateAsin_ = asin => {
  return asin.filter(e => e.length < 10)
}

/*
 * 商品情報取得する.
 */
const fetchAll_ = (data) => {
  try {
    const asin = data.map(e => e.asin.trim()).join(',')
    const url = `${ScriptProperties.getProperty('AMAZON_API_BASE_URL')}${asin}`
    console.log(url)
    const json = UrlFetchApp.fetch(url).getContentText()
    return JSON.parse(json)
  } catch (e) {
    console.error(e)
    spreadSheet.toast(e)
    throw e
  }
}

/*
 * スプレッドシートを更新する.
 */
const updateRows_ = (sql, org, data, rateJpyToKrw) => {
  const attentionImageUrl = ScriptProperties.getProperty('ATTENTION_IMAGE_URL')
  const resizeApiBaseUrl = ScriptProperties.getProperty('RESIZE_API_BASE_URL')
  data.forEach((e, i) => {
    sql.updateRows({
      '商品名': e.title ?? '',
      // '商品詳細': e.detail_table.replace(/\r?\n/g,"") ?? '',
      '商品詳細': `${e.images.slice(4).map(url => `<img src="${url}">`).join()}<img src="${attentionImageUrl}">`,
      'Amazon価格(円)': e.price ? e.price.replace(',', '') : 0,
      '販売予定価格(ウォン)': e.price ? (Math.ceil(parseInt(e.price.replace(',', '')) * 2 * rateJpyToKrw / 100) * 100) : 0,
      '在庫': e.stock ?? '',
      'amazonカテゴリ': e.category ? e.category.join(',') : '',
      '画像1': e.images[0] ? `${resizeApiBaseUrl}?url=${e.images[0]}` : '',
      '画像2': e.images[1] ? `${resizeApiBaseUrl}?url=${e.images[1]}` : '',
      '画像3': e.images[2] ? `${resizeApiBaseUrl}?url=${e.images[2]}` : '',
      '画像4': e.images[3] ? `${resizeApiBaseUrl}?url=${e.images[3]}` : '',
      'ブランド名': e.brand ?? '',
      'ステータス': e.status ?? '',
      '備考': e.memo ?? '',
      '作成日時': Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss') ?? '',
      '更新日時': Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss') ?? '',
    }, `No. = ${org[i]['No.']}`)
  })
}
