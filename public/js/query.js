
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
    console.log('Created text node: ', h2)
    return h2
}

const createDiv = (className = '') => {
    const div = document.createElement('div')
    div.classList.add(className)
    return div
}

const transactionsTableBody = document.getElementById('transactions-table-body')
const renderTransactions = (transactions) => {
    transactions.forEach(transaction => {
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

        transactionsTableBody.appendChild(tr)
    });
}

window.addEventListener('load', () => {
    console.log('Loaded');
    const sendQuery = () => {
        const timeStamp = getCurrentTime()
        const year = timeStamp.getFullYear()
        const month = timeStamp.getMonth()
        const date = timeStamp.getDate() - 1

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
            const loader = document.getElementById('transaction-spinner')
            loader.classList.add('loaded')
        }))
    }

    sendQuery()
})
