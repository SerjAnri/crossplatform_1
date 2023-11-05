import {Utils} from "../src/utils";
import {CurrencyEntity} from "../src/currencyEntity";

let utils = new Utils()

// formatFloatToDisplayingAmount

test('знаков больше чем нужно', () => {
    expect(utils.formatFloatToDisplayingAmount(3.3122342)).toBe("3.312");
});


test('1 цифра вместо 3', () => {
    expect(utils.formatFloatToDisplayingAmount(3.1)).toBe("3.1");
});

test('число без цифр после запятой (так работает number)', () => {
    expect(utils.formatFloatToDisplayingAmount(3.0)).toBe("3");
});

test('скос всех цифр', () => {
    expect(utils.formatFloatToDisplayingAmount(3.32, 0)).toBe("3");
});

test('нужно столько же цифр сколько есть', () => {
    expect(utils.formatFloatToDisplayingAmount(3.32, 2)).toBe("3.32");
});

// showNominalCurrency

const currencyEntity = new CurrencyEntity({
    CharCode: "USD",
    Nominal: 5,
    Value: 100
})
test('обычный рабочий сценарий с всеми данными', () => {
    expect(utils.showNominalCurrency(1, currencyEntity)).toBe("1 USD = 20₽");
});

test('номинал=0', () => {
    expect(utils.showNominalCurrency(0, currencyEntity)).toBe("");
});

test('номинал отрицательный', () => {
    expect(utils.showNominalCurrency(-5, currencyEntity)).toBe("");
});

const currencyEntity1 = new CurrencyEntity({
    Nominal: 5,
    Value: 100
})
test('сценарий с неполными данными', () => {
    expect(utils.showNominalCurrency(1, currencyEntity1)).toBe("");
});

// getCurrenciesByDynamics
const testCurrencies = {
    "AUD": {
        "ID": "R01010",
        "NumCode": "036",
        "CharCode": "AUD",
        "Nominal": 1,
        "Name": "Австралийский доллар",
        "Value": 39.8065,
        "Previous": 39.9508
    },
    "AZN": {
        "ID": "R01020A",
        "NumCode": "944",
        "CharCode": "AZN",
        "Nominal": 1,
        "Name": "Азербайджанский манат",
        "Value": 36.1966,
        "Previous": 36.0935
    },
    "BYN": {
        "ID": "R01090B",
        "NumCode": "933",
        "CharCode": "BYN",
        "Nominal": 1,
        "Name": "Белорусский рубль",
        "Value": 24.8804,
        "Previous": 24.7955
    }
}

test('тест cons', () => {
    expect(utils.getCurrenciesByDynamics(Object.values(testCurrencies)).cons.length).toBe(1);
    expect(utils.getCurrenciesByDynamics(Object.values(testCurrencies)).cons[0].charCode).toBe("AUD");
});
test('тест pros', () => {
    expect(utils.getCurrenciesByDynamics(Object.values(testCurrencies)).pros.length).toBe(2);
});

test('тест с пустым equel', () => {
    expect(utils.getCurrenciesByDynamics(Object.values(testCurrencies)).equal.length).toBe(0);
});

const testCurrencies2= {"KPR": {"ID":"R01090B", "CharCode":"KPR", "Nominal":1, "Name": "Футбольный мячик", "Value":2.5, "Previous":2.5}}
test('тест на equel с значением', () => {
    expect(utils.getCurrenciesByDynamics(Object.values(testCurrencies2)).equal.length).toBe(1);
});

// getCurrencyNamesFromArray
const TestCurrenciesByDynamics= utils.getCurrenciesByDynamics(Object.values(testCurrencies))
test('тест getCurrencyNamesFromArray', () => {
    expect(utils.getCurrencyNamesFromArray(TestCurrenciesByDynamics.pros)).toBe("AZN, BYN.");
});
