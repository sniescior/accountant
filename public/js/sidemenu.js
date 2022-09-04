
const sideMenu = document.getElementById('side-menu')

const businessMenuToggle = document.getElementById('menu-business-toggle')
const aboutMenuToggle = document.getElementById('menu-about-toggle')
const personalMenuToggle = document.getElementById('menu-personal-toggle')

const toggleMenuElements = [businessMenuToggle, aboutMenuToggle, personalMenuToggle]

function toggleSideMenu() {
    if(sideMenu.classList.contains('hidden')) {
        sideMenu.classList.remove('hidden')
        document.body.classList.add('shade')
    } else {
        sideMenu.classList.add('hidden')
        document.body.classList.remove('shade')
    }
}

function ifActive(element) {
    if(element.classList.contains('extended')) return true
    return false
}

function ifTarget(event) {
    for(let i = 0; i < 3; i++) {
        if(toggleMenuElements[i].contains(event.target)) return true
    }

    return false
}

const closeButton = document.getElementById('side-menu-close-button')
const openButton = document.getElementById('side-menu-open-button')

document.body.addEventListener('click', (e) => {
    if(!ifTarget(e) && !openButton.contains(e.target) && !sideMenu.contains(e.target)) {
        sideMenu.classList.add('hidden')
        document.body.classList.remove('shade')
    }
})
