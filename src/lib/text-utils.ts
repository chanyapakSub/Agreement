
// Thai Baht Text Conversion
const MAX_POSITION = 6;
const UNIT_NAMES = ['สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
const NUM_NAMES = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];

function convertInteger(number: number): string {
    const digits = number.toString().split('').reverse();
    let text = '';

    for (let i = 0; i < digits.length; i++) {
        const digit = parseInt(digits[i]);
        const position = i % MAX_POSITION;

        if (digit === 0) {
            if (i > 0 && i % MAX_POSITION === 0) text = 'ล้าน' + text;
            continue;
        }

        let unitName = position === 0 ? '' : UNIT_NAMES[position - 1];
        let numName = NUM_NAMES[digit];

        if (position === 0 && digit === 1 && i > 0) {
            numName = 'เอ็ด'; // One at the end (21, 101)
        } else if (position === 1 && digit === 2) {
            numName = 'ยี่'; // Twenty
        } else if (position === 1 && digit === 1) {
            numName = ''; // Ten (not One-Ten)
        }

        if (i > 0 && i % MAX_POSITION === 0) unitName = 'ล้าน' + unitName;

        text = numName + unitName + text;
    }
    return text;
}

export function toThaiBaht(amount: number | string): string {
    const num = parseFloat(amount.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';

    const baht = Math.floor(num);
    const satang = Math.round((num - baht) * 100);

    if (baht === 0 && satang === 0) return 'ศูนย์บาทถ้วน';

    let text = '';
    if (baht > 0) {
        text += convertInteger(baht) + 'บาท';
    }

    if (satang > 0) {
        text += convertInteger(satang) + 'สตางค์';
    } else {
        text += 'ถ้วน';
    }

    return text;
}

// English Number to Words (Simplified for currency)
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const THOUSANDS = ['', 'Thousand', 'Million', 'Billion'];

function convertGroup(n: number): string {
    let str = '';
    if (n >= 100) {
        str += ONES[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
    }
    if (n >= 20) {
        str += TENS[Math.floor(n / 10)] + ' ';
        n %= 10;
    }
    if (n >= 10) {
        str += TEENS[n - 10] + ' ';
        return str;
    }
    if (n > 0) {
        str += ONES[n] + ' ';
    }
    return str;
}

export function toEnglishBaht(amount: number | string): string {
    const num = parseFloat(amount.toString().replace(/,/g, ''));
    if (isNaN(num)) return '';

    const baht = Math.floor(num);
    const satang = Math.round((num - baht) * 100);

    if (baht === 0) return 'Zero Baht';

    let text = '';
    let i = 0;
    let tempBaht = baht;

    while (tempBaht > 0) {
        if (tempBaht % 1000 !== 0) {
            text = convertGroup(tempBaht % 1000) + THOUSANDS[i] + ' ' + text;
        }
        tempBaht = Math.floor(tempBaht / 1000);
        i++;
    }

    text = text.trim() + ' Baht';

    if (satang > 0) {
        text += ' and ' + convertGroup(satang).trim() + ' Satang';
    } else {
        text += ' Only';
    }

    return text;
}
