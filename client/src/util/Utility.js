class Utility {
  static getLastRecord(data) {
    if (data.length) {
      return data.slice(-1)[0];
    } else {
      return null;
    }
  }

  static formatDate(value) {
    return dateFormat.format(value);
  }

  static formatInteger(value) {
    return integerFormat.format(Math.round(value));
  }

  static formatPercent(value) {
    return percentFormat.format(value);
  }
}

export default Utility;

const dateFormat = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const integerFormat = new Intl.NumberFormat('default');
const percentFormat = new Intl.NumberFormat('default', {
  style: 'percent',
  maximumSignificantDigits: 3,
});
