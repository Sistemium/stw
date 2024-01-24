import * as native from 'sistemium-data/lib/util/native';
import noop from 'lodash/noop';

const BARCODE_SCANNER_FN = 'BARCODE_SCANNER_FN';
const BARCODE_SCANNER_POWER_FN = 'BARCODE_SCANNER_POWER_FN';
const BARCODE_SCANNER_STATUS_FN = 'BARCODE_SCANNER_STATUS_FN';

export function isNative() {
  return native.isNative();
}

export function barCodeScannerOn(onScan, onStatus) {

  window[BARCODE_SCANNER_POWER_FN] = noop;

  window[BARCODE_SCANNER_FN] = (scan, type, symbology) => {
    onScan(scan, symbology);
  };

  window[BARCODE_SCANNER_STATUS_FN] = status => {
    onStatus(status);
  };

  native.handler('barCodeScannerOn')
    .postMessage({
      scanCallback: BARCODE_SCANNER_FN,
      powerButtonCallback: BARCODE_SCANNER_POWER_FN,
      statusCallback: BARCODE_SCANNER_STATUS_FN,
    });

}

export function barCodeScannerOff() {
  window[BARCODE_SCANNER_FN] = noop;
  // window[BARCODE_SCANNER_STATUS_FN] = noop;
  native.handler('barCodeScannerOff')
    .postMessage({});
}
