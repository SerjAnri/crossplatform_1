import {CurrencyEntity} from "./currencyEntity.js";
import {GeneralEntity} from "./generalEntity.js";
import {ArrowCanvas} from "./arrowCanvas.js";
import {PieChart} from "./pieChart.js";
import {Utils} from "./utils.js";

document.addEventListener('DOMContentLoaded', setup)

const util = new Utils()

const currencySelector = document.getElementById('currencySelector');
const nominalInput = document.getElementById('nominalInput');
const ArrowChart = new ArrowCanvas(document.getElementById('arrowCanvas'))
const pieChart = new PieChart(document.getElementById('pieCanvas'), document.getElementById("pieLegend"))

const API = 'https://www.cbr-xml-daily.ru/daily_json.js'
let info
let currency

function setup() {
    startApp()
}


function calculateResult() {
    const result = document.getElementById('output');
    if (currencySelector.value === '-') {
        result.textContent = ''
        return
    }
    result.textContent = util.showNominalCurrency(Number(nominalInput.value), currency)
}

function makeChart() {
    ArrowChart.drawArrow([
            {
                value: currency.previous,
                date: info.previousDate
            }, {
                value: currency.value,
                date: info.date
            }],
        util)
}

function initCurrencySelector(currencies) {
    currencies.forEach(i => {
        let opt = document.createElement('option');
        opt.value = i
        opt.innerHTML = i
        currencySelector.appendChild(opt)
    })
    currencySelector.addEventListener('change', (event) => {
        const selectedName = document.getElementById('selectedCurrencyContainer')
        if (event.target.value !== '-') {
            currency = new CurrencyEntity(info.valute[currencySelector.value])
            selectedName.textContent = `Валюта: ${currency.name}`
            document.getElementById('changesContainer').style.display = 'block'
            makeChart()
        } else {
            document.getElementById('changesContainer').style.display = 'none'
            selectedName.textContent = `\n`
            ArrowChart.clear()
        }
        calculateResult()
    });
}

function initNominalInput() {
    nominalInput.addEventListener('input', () => {
        calculateResult()
    });
}

function initStats() {
    const splittedCurrencies = util.getCurrenciesByDynamics(Object.values(info.valute))
    pieChart.draw({
        increase: splittedCurrencies.pros.length,
        decrease: splittedCurrencies.cons.length,
        equal: splittedCurrencies.equal.length
    })
    const pros = document.getElementById('pros')
    const cons = document.getElementById('cons')
    const equel = document.getElementById('cons')
    if (splittedCurrencies.pros.length !== 0)
        pros.textContent = `Валюты с положительной динамикой: ${util.getCurrencyNamesFromArray(splittedCurrencies.pros)}`
    if (splittedCurrencies.cons.length !== 0)
        cons.textContent = `Валюты с отрицательной динамикой: ${util.getCurrencyNamesFromArray(splittedCurrencies.cons)}`
    if (splittedCurrencies.equal.length !== 0)
        equel.textContent = `Валюты с нулевой динамикой: ${util.getCurrencyNamesFromArray(splittedCurrencies.equal)}`

}

function buildBarChartWithD3(){
    const splittedCurrencies = util.getCurrenciesByDynamics(Object.values(info.valute));
    const consValues = splittedCurrencies.cons.flatMap(it => it.value);
    const consNames = splittedCurrencies.cons.flatMap(it => it.charCode);
    const prosValues = splittedCurrencies.pros.flatMap(it => it.value);
    const prosNames = splittedCurrencies.pros.flatMap(it => it.charCode);

    let ctx1 = document.getElementById('chart1').getContext('2d');
    let chartPros = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: prosNames,
            datasets: [{
                label: 'Валюта',
                data: prosValues
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 3,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    let ctx2 = document.getElementById('chart2').getContext('2d');
    let chartCons = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: consNames,
            datasets: [{
                label: 'Валюта',
                data: consValues
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 3,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

}

function apiIsReady(flag) {
    if (flag) {
        document.getElementById('content').style.display = 'block'
    } else {
        document.getElementById('contentError').style.display = 'block'
    }
}

function initViews() {
    apiIsReady(true)
    initCurrencySelector(Object.keys(info.valute))
    initNominalInput()
    initStats()
    buildBarChartWithD3()
}

function startApp() {
    fetch(API)
        .then(res => res.json())
        .then((out) => {
            if (info != null) return
            info = new GeneralEntity(out)
            initViews()
        }).catch(err => {
        apiIsReady(false)
        // setTimeout(function() {
        //     startApp()
        // }, 2000);
        console.error(err)
    });
}