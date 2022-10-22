// Global declarations
const appContainer = document.getElementById('appContainer')
const overlay = document.getElementById('overlay')
var url = window.location

// Overlay
const toggleOverlay = () => {
    const overlay = document.getElementById('overlay')
    overlay.classList.toggle('hidden')
}

// Switch button
function toggleButton(elementId) {
    const element = document.getElementById(elementId)
    if(element.classList.contains('active')) {
        element.classList.remove('active')
    } else {
        element.classList.add('active')
    }
}

// Pop Ups
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

// Bottom Up Sheet
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

// Dropdowns and Inputs
const closeAllDropdowns = (exceptThisOneID) => {
    Array.from(document.getElementsByClassName('focus')).forEach(dropdown => {
        if(exceptThisOneID) {
            const openedDropdown = document.getElementById(exceptThisOneID)
            if(openedDropdown !== dropdown) {
                dropdown.classList.remove('focus')
            }
        } else {
            dropdown.classList.remove('focus')
        }
    })
}

function toggleDropdown(elementID) {
    const element = document.getElementById(elementID)
    element.classList.toggle('focus')

    closeAllDropdowns(elementID)
}

const clearDropdown = () => {
    Array.from(document.getElementsByClassName('selected-value')).forEach(element => {
        element.classList.remove('selected-value')
    })
}

function setDropdownValue(element, dropdownID, defaultValue) {
    const dropdownInput = document.getElementById(dropdownID)
    dropdownInput.value = element.innerHTML
    
    if(element.classList.contains('selected-value')) {
        element.classList.remove('selected-value')
        dropdownInput.value = defaultValue
        toggleDropdown(dropdownID)
    } else {
        clearDropdown()
        element.classList.add('selected-value')
        dropdownInput.value = element.innerHTML
        toggleDropdown(dropdownID)
    }
}

// Modals 
const toggleModal = (modalID) => {
    const modal = document.getElementById(modalID)
    modal.classList.toggle('pop')
    toggleOverlay()
    closeAllDropdowns()
}

// Detailed menu
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
    
    Array.from(document.getElementsByClassName('pop')).forEach(element => {
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

    // Close all popUp alerts (also closing modal elements)
    closeAllPopUps()

    // When closing a bottomUpSheet -> close all expandable lists
    Array.from(document.getElementsByClassName('focus')).forEach(element => {
        element.classList.remove('focus')
    })
    
    overlay.classList.add('hidden')
})

// Tabs
const setTab = (tabToggle, tabID) => {
    const tab = document.getElementById(tabID)
    tabToggle.classList.add('active')

    const tabToggles = Array.from(document.querySelectorAll('[role="presentation"]'))
    tabToggles.forEach(element => {
        if(element.classList.contains('active') && element !== tabToggle) {
            element.classList.remove('active')
        }
    })
}

const dropdowns = Array.from(document.getElementsByClassName('dropdown'))
const dropdownWrappers = Array.from(document.getElementsByClassName('dropdown-wrapper'))

document.body.addEventListener('click', (e) => {
    // Close any opened dropdown when clicked outside
    if(!e.target.classList.contains('dropdown') && !e.target.classList.contains('dropdown-wrapper') && !e.target.parentElement.classList.contains('dropdown-wrapper') ) {
        closeAllDropdowns()
    }
})




