export default {
  mounted(element) {
    const input = element.tagName === 'INPUT' ? element
      : element.getElementsByTagName('input')[0];
    if (!input) {
      // eslint-disable-next-line no-console
      console.warn('selectOnFocus', 'not found input');
      return;
    }
    input.onfocus = selectThis;
  },
};

function selectThis() {
  this.select();
}
