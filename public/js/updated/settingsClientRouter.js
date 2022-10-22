/**
 * ------------- ROUTER FOR CLIENT-SIDE NAVIGATION BETWEEN SETTINGS PAGES -------------
 */

const containers = document.getElementsByClassName('container')

settingsClientRoutes = [
    { path: '/app/settings/profile', view: 'profile', linkItem: 'profile-link' },
    { path: '/app/settings/configuration', view: 'configuration', linkItem: 'configuration-link' },
    { path: '/app/settings/configuration/income-categories', view: 'configuration-income-categories', linkItem: 'configuration-link' },
    { path: '/app/settings/configuration/expense-categories', view: 'configuration-expense-categories', linkItem: 'configuration-link' },
    { path: '/app/settings/configuration/budget', view: 'configuration-budget', linkItem: 'configuration-link' },
    { path: '/app/settings/accounts', view: 'accounts', linkItem: 'accounts-link' },
    { path: '/app/settings/accounts/groups', view: 'accounts-groups', linkItem: 'accounts-link' },
    { path: '/app/settings/accounts/accounts-configuration', view: 'accounts-configuration', linkItem: 'accounts-link' },
    { path: '/app/settings/general', view: 'general', linkItem: 'general-link"' },
    { path: '/app/settings/security', view: 'security', linkItem: 'security-link' }
]

const navigateTo = url => {
    history.pushState(null, null, url)
    settingsClientRouter()
}

const route = (viewID, linkID) => {
    const allLinks = document.querySelectorAll('[data-link]')
    const linkElement = document.getElementById(linkID)

    if(!linkElement.classList.contains('interactive')) {
        Array.from(allLinks).forEach(link => {
            link.classList.remove('active')
            if(link.id == linkID) {
                link.classList.add('active')
            }
        })
    }

    const allContainers = document.getElementsByClassName('container')
    Array.from(allContainers).forEach(container => {
        container.classList.remove('active')
        if(container.id == viewID) {
            container.classList.add('active')
        }
    })
}

settingsClientRouter = async () => {
    const potentialMatches = settingsClientRoutes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
    route(match.route.view, match.route.linkItem)
}

document.addEventListener('DOMContentLoaded', () => {
    settingsClientRouter()

    document.addEventListener('click', (e) => {
        if(e.target.matches('[role="presentation"]')) {
            e.preventDefault()
            console.log(e.target);
            navigateTo(e.target.href)
        }
    })

    window.addEventListener('popstate', () => {
        settingsClientRouter()
    })
})