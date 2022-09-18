
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

const nestedMenus = document.getElementsByClassName('nested-menu')

const closeNestedMenus = () => {
    Array.from(nestedMenus).forEach(nestedMenu => {
        if(!nestedMenu.classList.contains('hidden')) {
            nestedMenu.classList.add('hidden')
        }
    })
}

const route = (siteID, parentID) => {
    console.log('Routing', siteID);
    const appContainer = document.getElementById('appContainer')
    const nestedMenu = document.getElementById(siteID)
    if(siteID == 'main') {
        closeNestedMenus()
        document.body.classList.remove('hidden')
        appContainer.classList.remove('hidden')
        return
    }

    if(parentID) {
        nestedMenu.classList.remove('hidden')
        return
    }

    closeNestedMenus()
    document.body.classList.add('hidden')
    appContainer.classList.add('hidden')
    nestedMenu.classList.remove('hidden')
}

const navigateTo = url => {
    console.log('Navigating to ', url);
    history.pushState(null, null, url)
    settingsClientRouter()
}

const settingsClientRoutes = [
    { path: '/app/settings', view: 'main' },
    { path: '/app/settings/configuration', view: 'configuration' },
    { path: '/app/settings/configuration/repeat', view: 'repeat', parent: 'configuration' },
    { path: '/app/settings/configuration/currency', view: 'currency', parent: 'configuration' },
    { path: '/app/settings/accounts', view: 'accounts' },
    { path: '/app/settings/security', view: 'security' },
    { path: '/app/settings/plan', view: 'plan' },
    { path: '/app/settings/language', view: 'language' }
]

const settingsClientRouter = async () => {
    const potentialMatches = settingsClientRoutes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
    route(match.route.view, match.route.parent)
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded');
    settingsClientRouter()
    document.addEventListener('click', (e) => {
        if(e.target.matches('[data-link]')) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })

    window.addEventListener('popstate', () => {
        console.log('Popstate detected')
        console.log(location.pathname);

        settingsClientRouter()
    })
})
