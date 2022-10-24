const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const getCurrentTime = () => {
    var currentDate = new Date()
    const timeStamp = new Date(Date.UTC(
        currentDate.getFullYear(), 
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours() - 2, 
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds())
    )

    return timeStamp
}

const createTextElement = (text, textType) => {
    // textType -> h1, h2, h3, ...
    const h2 = document.createElement(textType)
    const textElement = document.createTextNode(text)
    h2.appendChild(textElement)
    return h2
}

const createDiv = (className = '') => {
    const div = document.createElement('div')
    div.classList.add(className)
    return div
}

const renderDate = (date, weekday, month) => {
    // date -> 1, 2, 3, ... day of month
    // weekday -> mon, tue, wed, thu, ...

    const tr = document.createElement('tr')
    const th = document.createElement('th')
    const dateText = createTextElement(`${weekdays[weekday]} ${date}.${month}`, 'h2')
    th.appendChild(dateText)
    tr.appendChild(th)
    tr.classList.add('date-row')

    return tr
}

const transactionsTableBody = document.getElementById('transactions-table-body')
const renderTransactions = (transactions) => {
    let delay = 0
    let previousDate = -1
    transactions.forEach(transaction => {

        let transactionDate = new Date(Date.UTC(
            new Date(transaction.date).getFullYear(), 
            new Date(transaction.date).getMonth(),
            new Date(transaction.date).getDate(),
            new Date(transaction.date).getHours() - 4,
            new Date(transaction.date).getMinutes()
        ))
        
        const tr = document.createElement('tr')
        
        const tdCategory = document.createElement('td')
        tdCategory.classList.add('category')
        tdCategory.appendChild(createTextElement(transaction.category, 'h2'))
        
        const tdNote = document.createElement('td')
        const divNote = createDiv('note')
        divNote.appendChild(createTextElement(transaction.title, 'h2'))
        divNote.appendChild(createTextElement(transaction.accountName, 'h3'))
        tdNote.appendChild(divNote)

        const tdAmount = document.createElement('td')
        tdAmount.classList.add('amount')
        tdAmount.classList.add(transaction.type)
        tdAmount.appendChild(createTextElement('£' + transaction.amount, 'h2'))

        tr.appendChild(tdCategory)
        tr.appendChild(tdNote)
        tr.appendChild(tdAmount)
        
        
        let dateRow 
        if(previousDate != transactionDate.getDate()) {
            dateRow = renderDate(transactionDate.getDate(), transactionDate.getDay(), transactionDate.getMonth() + 1)
            previousDate = transactionDate.getDate()
            transactionsTableBody.appendChild(dateRow)
        }
        
        transactionsTableBody.appendChild(tr)

        setTimeout(() => {
            if(dateRow) dateRow.classList.add('loaded')
            tr.classList.add('loaded')
        }, delay += 100)
    })
}

const renderQuickStats = (incomeValue, expenseValue, totalValue) => {
    const incomeText = document.getElementById('card-income')
    const expenseText = document.getElementById('card-expense')
    const totalText = document.getElementById('card-total')

    incomeText.insertBefore(createTextElement('£' + incomeValue, 'h2'), incomeText.firstChild)
    expenseText.insertBefore(createTextElement('£' + expenseValue, 'h2'), expenseText.firstChild)
    totalText.insertBefore(createTextElement('£' + totalValue, 'h2'), totalText.firstChild)

    const spinners = []
    spinners.push(document.getElementById(incomeText.id + '-spinner'))
    spinners.push(document.getElementById(expenseText.id + '-spinner'))
    spinners.push(document.getElementById(totalText.id + '-spinner'))

    spinners.forEach(spinner => {
        spinner.classList.add('loaded')
    })
}

window.addEventListener('load', () => {
    const transactionsQuery = () => {
        const timeStamp = getCurrentTime()
        const year = timeStamp.getFullYear()
        const month = timeStamp.getMonth()
        const date = timeStamp.getDate()

        fetch('dashboard/getTransactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payload: {
                    year: year,
                    month: month,
                    date: date
                }
            })
        }).then((res) => res.json().then(async (data) => {
            renderTransactions(data.transactions)
            renderQuickStats(data.incomes, data.expenses, data.total)
            const loader = document.getElementById('transaction-spinner')
            loader.classList.add('loaded')
        }))
    }

    transactionsQuery()
})
