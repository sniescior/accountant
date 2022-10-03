const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const getDate = () => {
    var today = new Date();
    var currentMonth = today.getMonth()
    var currentYear = today.getFullYear()
    var currentDay = String(today.getDate()).padStart(2, '0')
    var currentDayOfWeek = today.getDay()
    return { currentYear, currentMonth, currentDay, currentDayOfWeek }
}

const setDate = () => {
    const { currentYear, currentMonth, currentDay, currentDayOfWeek } = getDate()

    const dayElement = document.getElementById('current-date-day')
    const weekdayElement = document.getElementById('current-date-weekday')
    const restElement = document.getElementById('current-date-rest')

    dayElement.innerHTML = currentDay
    weekdayElement.innerHTML = weekdays[currentDayOfWeek]

    restElement.innerHTML = (currentMonth + 1) + '.' + currentYear

    const mainDateSelect = document.getElementById('main-date-select')
    mainDateSelect.innerHTML = currentYear + ' ' + months[currentMonth]

    const calendarYearSelect = document.getElementById('modal-calendar-year-select')
    calendarYearSelect.innerHTML = currentYear

    const modalCalendarYearSelect = document.getElementById('modal-calendar-year-input')
    const modalCalendarMonthSelect = document.getElementById('modal-calendar-month-input')
    modalCalendarMonthSelect.value = months[currentMonth].toUpperCase()
    modalCalendarYearSelect.value = currentYear
    const modalCalendarMonthSelectButton = document.getElementById(months[currentMonth].toUpperCase())
    modalCalendarMonthSelectButton.classList.add('active')
}

window.addEventListener('load', setDate)

const calendarMonthSelect = (yearWrapperID) => {
    const { currentYear, currentMonth } = getDate()
    const selectedYear = parseInt(document.getElementById(yearWrapperID).innerHTML)
    const currentMonthElement = document.getElementById(months[currentMonth].toUpperCase())
    if(currentYear == selectedYear) {
        currentMonthElement.classList.add('active')
    } else {
        currentMonthElement.classList.remove('active')
    }
}

const setCurrentYear = (yearWrapperID) => {
    const { currentYear } = getDate()
    const calendarYearSelect = document.getElementById(yearWrapperID)
    calendarYearSelect.innerHTML = currentYear
    calendarMonthSelect(yearWrapperID)
}

const yearBack = (yearWrapperID) => {
    const calendarYearSelect = document.getElementById(yearWrapperID)
    const startingYear = parseInt(calendarYearSelect.innerHTML)
    calendarYearSelect.innerHTML = startingYear - 1
    calendarMonthSelect(yearWrapperID)
}

const yearForward = (yearWrapperID) => {
    const calendarYearSelect = document.getElementById(yearWrapperID)
    const startingYear = parseInt(calendarYearSelect.innerHTML)
    calendarYearSelect.innerHTML = startingYear + 1
    calendarMonthSelect(yearWrapperID)
}

const sendCalendarForm = (buttonElement, yearInputID, monthInputID, calendarFormID) => {
    const yearInput = document.getElementById(yearInputID)
    const monthInput = document.getElementById(monthInputID)
    const calendarForm = document.getElementById(calendarFormID)
}