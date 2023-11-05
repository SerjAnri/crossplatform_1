import {CurrencyEntity} from "./currencyEntity.js";

export class Utils {

    // отрезает цифры у числа с плавающей точкой
    // по умолчанию 3 цифры после запятой
    formatFloatToDisplayingAmount(number, decimalPoint = 3) {
        let str = number.toString()
        let zeroCount
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '.') {
                zeroCount = 0
                if (zeroCount === decimalPoint) {
                    return str.substring(0, i)
                }
                continue
            }
            if (zeroCount !== undefined) {
                zeroCount += 1
                if (zeroCount === decimalPoint) {
                    return str.substring(0, i + 1)
                }

            }
        }
        return str
    }

    showNominalCurrency(nominal, currency) {
        if (nominal === undefined || currency.charCode === undefined || currency.nominal === undefined) return ''
        if (currency.value <= 0 || currency.nominal < 1 || !Number.isInteger(nominal) || nominal < 1) return ''
        const amount = parseFloat(currency.value) * nominal / parseFloat(currency.nominal)
        return `${nominal.toString()} ${currency.charCode} = ${this.formatFloatToDisplayingAmount(amount)}₽`
    }

    getCurrenciesByDynamics(currencies) {
        let pros = [], cons = [], equal = []
        currencies.forEach(it => {
            const currency = new CurrencyEntity(it)
            if (currency.previous < currency.value) {
                pros.push(currency)
            } else if (currency.previous > currency.value) {
                cons.push(currency)
            } else {
                equal.push(currency)
            }
        })
        return {pros, cons, equal}
    }

    getCurrencyNamesFromArray(array) {
        let text = ""
        for (let i = 0; i < array.length; i++) {
            text += array[i].charCode
            if (i !== array.length - 1) {
                text += ", "
            } else text += "."
        }
        return text
    }

}
