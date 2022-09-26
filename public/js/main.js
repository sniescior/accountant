
// navbar and side-menu common scripts

const body = document.body

// determine whether clicked element is a list item (li) or not
function ifTarget(event, list) {    
    for(let i = 0; i < 3; i++) {
        if(list[i].contains(event.target)) return true
    }

    return false
}

// MARK: navbar scripts

const businessToggle = document.getElementById('business-toggle')
const aboutToggle = document.getElementById('about-toggle')
const personalToggle = document.getElementById('personal-toggle')

const toggleNavElements = [businessToggle, aboutToggle, personalToggle]

function ifActive(element) {
    if(element.classList.contains('extended')) return true
    return false
}

function removeActiveElements(list) {
    Array.from(list).forEach(element => {
        if(ifActive(element)) element.classList.remove('extended')
    });
}

function toggleExtendedList(element) {
    if(element.classList.contains('extended')) {
        element.classList.remove('extended')
        return
    }

    removeActiveElements(toggleNavElements)

    element.classList.add('extended')    
}

// MARK: side-menu scripts

const sideMenu = document.getElementById('side-menu')

const businessMenuToggle = document.getElementById('menu-business-toggle')
const aboutMenuToggle = document.getElementById('menu-about-toggle')
const personalMenuToggle = document.getElementById('menu-personal-toggle')

const toggleMenuElements = [businessMenuToggle, aboutMenuToggle, personalMenuToggle]

const openButton = document.getElementById('side-menu-open-button')

function closeSideMenu() {
    sideMenu.classList.add('hidden')
    body.classList.remove('shade')
    setTimeout(() => {
        removeActiveElements(toggleMenuElements)
    }, 300);
}

function openSideMenu() {
    sideMenu.classList.remove('hidden')
    body.classList.add('shade')
}

function toggleSideMenu() {
    if(sideMenu.classList.contains('hidden')) {
        openSideMenu()
    } else {
        closeSideMenu()
    }
}

// MARK: User menu (user-info) scripts

const userInfo = document.getElementById('user-info')
const userMenu = document.getElementById('user-menu')

function toggleUserMenu() {
    if(userInfo.classList.contains('toggled')) {
        userInfo.classList.remove('toggled')
    } else {
        userInfo.classList.add('toggled')
    }
}

// MARK: Event listener

body.addEventListener('click', (e) => {
    
    if(userInfo) {
        if(userInfo.classList.contains('toggled') && !userInfo.contains(e.target) && !userMenu.contains(e.target)) {
            userInfo.classList.remove('toggled')
        }
    }

    if(sideMenu) {
        if(!sideMenu.classList.contains('hidden')) {
            // if clicked on side-menu closing button or side-menu itself or side-menu list element do nothing
            if(!ifTarget(e, toggleMenuElements) && !openButton.contains(e.target) && !sideMenu.contains(e.target)) {
                closeSideMenu()
            }
            return
        }
    }

    Array.from(document.getElementsByClassName('focus')).forEach(element => {
        if(e.target != element && e.target.parentElement != element) {
            element.classList.remove('focus')
        }
    })
    
    if(!ifTarget(e, toggleNavElements)) removeActiveElements(toggleNavElements)
})