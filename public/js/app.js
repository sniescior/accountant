
// Global declarations
const appContainer = document.getElementById('appContainer')
const overlay = document.getElementById('overlay')
var url = window.location

// Switch button function (for example dark-mode toggle button)
function toggleButton(elementId) {
    const element = document.getElementById(elementId)
    if(element.classList.contains('active')) {
        element.classList.remove('active')
    } else {
        element.classList.add('active')
    }
}

function openPopUp(elementId, LiToggle) {
    const element = document.getElementById(elementId)
    LiToggle.classList.toggle('focus')
    overlay.classList.toggle('hidden')
    element.classList.add('pop')
}

function closePopUp(element, LiToggle) {
    const popUpElement = element.parentElement.parentElement
    LiToggle.classList.toggle('focus')
    overlay.classList.toggle('hidden')
    popUpElement.classList.remove('pop')
}

function openBottomUpSheet(elementId) {
    const element = document.getElementById(elementId)
    overlay.classList.remove('hidden')
    element.classList.add('up')
}

function closeBottomUpSheet(elementId) {
    const element = document.getElementById(elementId)
    overlay.classList.add('hidden')
    element.classList.remove('up')
}

function expandOptions(elementID) {
    const element = document.getElementById(elementID)
    element.classList.toggle('focus')
    console.log(element);
}

const toggleDetailedMenu = (elementID) => {

    // Close every detailedMenu element (except for the toggled one)
    Array.from(document.getElementsByClassName('menu-link')).forEach(element => {
        if(element.id != elementID) {
            element.classList.remove('extended')
        }
    })

    const element = document.getElementById(elementID)
    element.classList.toggle('extended')
}

const closeAllPopUps = () => {
    overlay.classList.add('hidden')
    
    Array.from(document.getElementsByClassName('pop-up-alert')).forEach(element => {
        element.classList.remove('pop')
    })
    
    Array.from(document.getElementsByClassName('focus')).forEach(element => {
        element.classList.remove('focus')
    })
}

overlay.addEventListener('click', (e) => {
    // Close all bottomUpSheet elements
    Array.from(document.getElementsByClassName('bottom-up-sheet')).forEach(element => {
        element.classList.remove('up')
    })

    // Close all popUp alerts
    closeAllPopUps()

    // When closing a bottomUpSheet -> close all expandable lists
    Array.from(document.getElementsByClassName('focus')).forEach(element => {
        element.classList.remove('focus')
    })
    overlay.classList.add('hidden')
})