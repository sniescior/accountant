
// Global declarations
const appContainer = document.getElementById('appContainer')
var url = window.location

// gonna be different behaviour when page opened in Safari Browser
var isSafari = window['safari']

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
function toggleNestedMenu(elementId, goToMainSettingsScreen = true) {
    const element = document.getElementById(elementId)
    const elementLinkId = elementId + '-link'
    const elementLink = document.getElementById(elementLinkId)
    if(element.classList.contains('hidden')) {
        element.classList.remove('hidden')
        document.body.classList.add('hidden')
        appContainer.classList.add('hidden')
        if(isSafari) appContainer.classList.add('safari')
        if(elementLink) {
            elementLink.classList.add('move-right')
        }
    } else {
        if(goToMainSettingsScreen) {
            document.body.classList.remove('hidden')
            appContainer.classList.remove('hidden')
        }
        element.classList.add('hidden')
        if(isSafari) element.classList.add('safari')
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
function setNestedMenu(nestedMenuId, goToMainSettingsScreen = true) {
    const nestedMenu = document.getElementById(nestedMenuId)
    if(nestedMenu.classList.contains('hidden')) {
        toggleNestedMenu(nestedMenuId, goToMainSettingsScreen)
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
            toggleNestedMenu(repeatNestedMenu.id, false)
            return
        }
        
        if(!currencyNestedMenu.classList.contains('hidden')) {
            toggleNestedMenu(currencyNestedMenu.id, false)
            return
        }
        
        setNestedMenu('configuration')
    }
    
    if(url.href.endsWith('#repeat')) {
        setNestedMenu('repeat', false)
    }
    
    if(url.href.endsWith('#currency')) {
        setNestedMenu('currency', false)
    }
    
    if(url.href.endsWith('#accounts')) {
        setNestedMenu('accounts')
    }
    
    if(url.href.endsWith('#plan')) {
        setNestedMenu('plan')
    }
    
    if(url.href.endsWith('#security')) {
        setNestedMenu('security')
    }
});

