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

const createDropdown = (list, dropdownID, type) => {

    let dropdown = ejs.render(`
        <div class="input-wrapper dropdown" onclick="toggleDropdown(this)">
            <input type="text" placeholder="Category" id="${dropdownID}" name="categoryName" required>
            <i class="bi bi-chevron-down"></i>
            <ul class="dropdown-list inc-category-dropdown">
                <% for(let i = 0; i < list.length; i++) { %>
                    <li class="dropdown-item" onclick="setValue(this, \'${dropdownID}\')" value="<%= list[i].name %>"><%= list[i].name %></li>
                <% } %>
            </ul>
        </div>
    `, { list: list })

    return dropdown
}

const createModal = (transaction, incomeCategories, expenseCategories) => {
    let modal = ejs.render(`
        <div class="modal" id="${transaction.type}-transaction-edit-modal-${transaction.id}">
            <div class="modal-header">
                ${transaction.type == 'inc' ? '<h2>Income transaction</h2>' : '<h2>Expense transaction</h2>'}
                <button onclick="closeModals()" class="close-button"><i class="bi bi-x-lg"></i></button>
            </div>
            <form action="/app/dashboard/edit/${transaction.type}-transaction" method="POST" class="modal-body">
                <div class="form-body">
                    ${transaction.type == 'inc' ? createDropdown(incomeCategories, 'inc-transaction-category-dropdown-' + transaction.id, 'inc') : createDropdown(expenseCategories, 'exp-transaction-category-dropdown' + transaction.id, 'exp')}

                    <div class="input-wrapper">
                        <i class="bi bi-type-h1"></i>
                        <input type="text" placeholder="Title" name="transactionTitle" required value="${transaction.title}">
                    </div>
                    <div class="input-wrapper">
                        <i class="bi bi-currency-pound"></i>
                        <input type="number" placeholder="Note" name="transactionnAmount" required value="${transaction.amount}">
                    </div>
                    <div class="input-wrapper">
                        <i class="bi bi-sticky"></i>
                        <input type="text" placeholder="Note" name="transactionnNote" required value="${transaction.note}">
                    </div>
                </div>
                <div class="form-footer">
                    <div class="button-wrapper">
                        <button class="button-secondary" type="button" onclick="closeModals()">Discard</button>
                        <button class="button-primary" type="submit">Save</button>
                    </div>
                </div>
            </form>
        </div>
    `)

    overlay.innerHTML += modal
}

const transactionsTableBody = document.getElementById('transactions-table-body')
const renderTransactions = (transactions, incomeCategories, expenseCategories) => {
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

        createModal(transaction, incomeCategories, expenseCategories)
        
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
            if(dateRow) { dateRow.classList.add('loaded') }
            tr.classList.add('loaded')
            let modalID = transaction.type + "-transaction-edit-modal-" + transaction.id
            tr.addEventListener('click', (e) => openModal(modalID))
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

        fetch('dashboard/get-transactions', {
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
            renderTransactions(data.transactions, data.incomeCategories, data.expenseCategories)
            renderQuickStats(data.incomes, data.expenses, data.total)
            const loader = document.getElementById('transaction-spinner')
            loader.classList.add('loaded')
        }))
    }

    transactionsQuery()
})
