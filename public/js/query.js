
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

window.addEventListener('load', () => {
    console.log('Loaded');
    const sendQuery = () => {
        const timeStamp = getCurrentTime()
        const year = timeStamp.getFullYear()
        const month = timeStamp.getMonth()
        const date = timeStamp.getDate()

        let finalTransactions = []

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
            console.log(data.transactions)
        }))
    }

    sendQuery()
})
