
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

// MARK: Pop-Ups handling
function openPopUp(elementId) {
    const element = document.getElementById(elementId)
    overlay.classList.toggle('hidden')
    element.classList.add('pop')
}

function closePopUp(element) {
    const popUpElement = element.parentElement.parentElement
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

overlay.addEventListener('click', (e) => {
    Array.from(document.getElementsByClassName('bottom-up-sheet')).forEach(element => {
        element.classList.remove('up')
    })
    Array.from(document.getElementsByClassName('pop-up-alert')).forEach(element => {
        element.classList.remove('pop')
    })
    overlay.classList.add('hidden')
})

function expandOptions(elementID) {
    const element = document.getElementById(elementID)
    element.classList.toggle('focus')
}

const toggleDetailedMenu = (elementID) => {
    console.log(elementID);
    const element = document.getElementById(elementID)
    element.classList.toggle('extended')
}