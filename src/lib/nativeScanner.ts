import * as native from 'sistemium-data/lib/util/native'
import noop from 'lodash/noop'

const BARCODE_SCANNER_FN = 'BARCODE_SCANNER_FN'
const BARCODE_SCANNER_POWER_FN = 'BARCODE_SCANNER_POWER_FN'
const BARCODE_SCANNER_STATUS_FN = 'BARCODE_SCANNER_STATUS_FN'

export function isNative() {
  return native.isNative()
}

type ScanHandler = (code: string, symbology: string) => void
type StatusHandler = (status: string) => void

export function barCodeScannerOn(onScan: ScanHandler, onStatus: StatusHandler) {

  Object.assign(window, { [BARCODE_SCANNER_POWER_FN]: noop })

  Object.assign(window, {
    [BARCODE_SCANNER_FN]: (scan: string, _type: string, symbology: string) => {
      onScan(scan, symbology)
    },
  })

  Object.assign(window, {
    [BARCODE_SCANNER_STATUS_FN]: (status: string) => {
      onStatus(status)
    },
  })

  native.handler('barCodeScannerOn')
    .postMessage({
      // @ts-ignore
      scanCallback: BARCODE_SCANNER_FN,
      powerButtonCallback: BARCODE_SCANNER_POWER_FN,
      statusCallback: BARCODE_SCANNER_STATUS_FN,
    })

}

export function barCodeScannerOff() {
  Object.assign(window, { [BARCODE_SCANNER_FN]: noop })
  // window[BARCODE_SCANNER_STATUS_FN] = noop;
  native.handler('barCodeScannerOff')
    .postMessage({})
}
