const overlay = document.getElementById('overlay')

const setTab = (tabToggle, tabID) => {
    const tab = document.getElementById(tabID)
    tabToggle.classList.add('active')

    const tabToggles = Array.from(document.querySelectorAll('[role="presentation"]'))
    tabToggles.forEach(element => {
        if(element.classList.contains('active') && element !== tabToggle && element.parentNode === tabToggle.parentNode) {
            element.classList.remove('active')
        }
    })

    const tabs = Array.from(document.querySelectorAll('[role="tabpanel"]'))
    tabs.forEach(element => {
        if(element.classList.contains('active') && element.parentNode === tab.parentNode) {
            element.classList.remove('active')
        }
    })

    document.getElementById(tabID).classList.add('active')
}

const openModal = (modalID) => {
    const modal = document.getElementById(modalID)
    overlay.classList.add('visible')
    modal.classList.add('modal-pop')
}

const removeFocus = (except = null) => {
    const focusedElements = Array.from(document.getElementsByClassName('focus'));
    focusedElements.forEach(element => {
        if(element !== except) {
            element.classList.remove('focus')
        }
    })
}

const closeModals = () => {
    const popUpElements = Array.from(document.getElementsByClassName('modal-pop'))
    popUpElements.forEach(element => {
        element.classList.remove('modal-pop')
    })
    overlay.classList.remove('visible')
}

const toggleDropdown = (dropdownWrapper) => {
    removeFocus(this)
    if(dropdownWrapper.classList.contains('focus')) {
        dropdownWrapper.classList.remove('focus')
    } else {
        dropdownWrapper.classList.add('focus')
    }
}

const setValue = (selectedItem, dropdownID) => {
    const dropdown = document.getElementById(dropdownID)
    
    if(selectedItem.classList.contains('selected')) {
        selectedItem.classList.remove('selected')
        dropdown.value = null
    } else {
        selectedItem.classList.add('selected')
        dropdown.value = selectedItem.getAttribute('value')
    }

    const dropdownItems = Array.from(document.getElementsByClassName('dropdown-item'))
    dropdownItems.forEach(dropdownItem => {
        if(dropdownItem.parentNode === selectedItem.parentNode && dropdownItem !== selectedItem) {
            dropdownItem.classList.remove('selected')
        }
    })
}

window.addEventListener('click', (e) => {
    if(e.target.classList.contains('input-wrapper')) {
        removeFocus(e.target)
    } else {
        if(e.target.parentNode.classList.contains('input-wrapper')) {
            removeFocus(e.target.parentNode)
        } else {
            removeFocus()
        }
    }
})

toggleContextMenu = (contextMenuElement) => {
    contextMenuElement.classList.toggle('active')

    Array.from(document.getElementsByClassName('context-menu')).forEach(element => {
        if(element !== contextMenuElement) {
            element.classList.remove('active')
        }
    })
}


