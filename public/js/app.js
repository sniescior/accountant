
// Global declarations
const appContainer = document.getElementById('appContainer')
const overlay = document.getElementById('overlay')
var url = window.location

// gonna be different behaviour when page opened in Safari Browser
var isSafari = window['safari']
if(isSafari) {
    appContainer.classList.add('safari')
    Array.from(document.getElementsByClassName('nested-menu')).forEach((element) => {
        element.classList.add('safari')
    })

    Array.from(document.getElementsByClassName('menu-link')).forEach((element) => {
        element.classList.add('safari')
    })
}

// Switch button function (for example dark-mode toggle button)
function toggleButton(elementId) {
    const element = document.getElementById(elementId)
    if(element.classList.contains('active')) {
        element.classList.remove('active')
    } else {
        element.classList.add('active')
    }
}

// When user goes from one settings screen to another (for example #configuration -> #currency)
function toggleNestedMenu(elementId, goToMainSettingsScreen = true, buttonUsed = true) {
    const element = document.getElementById(elementId)
    const elementLinkId = elementId + '-link'
    const elementLink = document.getElementById(elementLinkId)

    if(element.classList.contains('hidden')) {
        element.classList.remove('hidden')
        document.body.classList.add('hidden')
        appContainer.classList.add('hidden')

        if(elementLink) {
            elementLink.classList.add('move-right')
        }
    } else {
        if(goToMainSettingsScreen) {
            document.body.classList.remove('hidden')
            appContainer.classList.remove('hidden')
        }
        element.classList.add('hidden')
        
        if(elementLink) {
            elementLink.classList.remove('move-right')
        }
    }
}

// Extend accordion menu
function toggleDetailedMenu(elementId) {
    const element = document.getElementById(elementId)
    if(element.classList.contains('extended')) {
        element.classList.remove('extended')
    } else {
        element.classList.add('extended')
    }
}

window.onload = (e) => {
    if(url.href.endsWith('/settings') || url.href.endsWith('/settings/')) {
        document.location = location.protocol + '//' + location.hostname + ':3000/app/settings' + '#main'
        return
    }
    if(url.href.endsWith('#main')) {
        return
    }
    if(url.href.includes('#')) {
        const nestedMenuId = url.href.split('#')[1]
        toggleNestedMenu(nestedMenuId)
    }
}

// open nestedmenu when certain url 
function setNestedMenu(nestedMenuId, goToMainSettingsScreen = true, buttonUsed = true) {
    const nestedMenu = document.getElementById(nestedMenuId)
    if(nestedMenu.classList.contains('hidden')) {
        toggleNestedMenu(nestedMenuId, goToMainSettingsScreen, buttonUsed)
    }
}

// Listen to url changes (navigation observer)
window.addEventListener('popstate', function (e) {

    // user is at #main screen -> close all nested menus that might have been opened
    // and bring the main screen to its initial appearance
    if(url.href.endsWith('#main')) {
        const nestedMenuList = document.getElementsByClassName('nested-menu')
        const nestedMenuLinks = document.getElementsByClassName('move-right')
        document.body.classList.remove('hidden')
        appContainer.classList.remove('hidden')

        // All nestedMenuLists back to the initial position (hidden)
        Array.from(nestedMenuList).forEach((element) => {
            if(!element.classList.contains('hidden')) {
                element.classList.add('hidden')
            }
        })
        
        // All nestedMenuLinks back to the initial position
        Array.from(nestedMenuLinks).forEach((element) => {
            element.classList.remove('move-right')
        })
    }

    // some nestedMenus fire up other nestedMenus
    // for example: from configuration screen two nestedMenus could be opened (#repeat, #currency)
    if(url.href.endsWith('#configuration')) {
        const repeatNestedMenu = document.getElementById('repeat')
        const currencyNestedMenu = document.getElementById('currency')
        if(!repeatNestedMenu.classList.contains('hidden')) {
            toggleNestedMenu(repeatNestedMenu.id, false, false)
            return
        }
        
        if(!currencyNestedMenu.classList.contains('hidden')) {
            toggleNestedMenu(currencyNestedMenu.id, false, false)
            return
        }
        
        setNestedMenu('configuration', true, false)
    }
    
    if(url.href.endsWith('#repeat')) {
        setNestedMenu('repeat', false, false)
    }
    
    if(url.href.endsWith('#currency')) {
        setNestedMenu('currency', false, false)
    }
    
    if(url.href.endsWith('#accounts')) {
        setNestedMenu('accounts', true, false)
    }
    
    if(url.href.endsWith('#plan')) {
        setNestedMenu('plan', true, false)
    }
    
    if(url.href.endsWith('#security')) {
        setNestedMenu('security', true, false)
    }
});

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
