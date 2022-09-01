const navbar = document.getElementById('navbar')
const businessToggle = document.getElementById('business-toggle')
const aboutToggle = document.getElementById('about-toggle')
const personalToggle = document.getElementById('personal-toggle')

const toggleElements = [businessToggle, aboutToggle, personalToggle]

const extendedLists = document.getElementsByClassName('extended-list')

function ifActive(element) {
    if(element.classList.contains('extended')) return true
    return false
}

// determine whether clicked element is a list item (li) or not
function ifTarget(event) {
    for(let i = 0; i < 3; i++) {
        if(toggleElements[i].contains(event.target)) return true
    }

    return false
}

function removeActiveElements() {
    Array.from(toggleElements).forEach(element => {
        if(ifActive(element)) element.classList.remove('extended')
    });
}

// function toggleExtendedList(name) {
//     const extendedListElement = document.getElementById(name)

//     if(extendedListElement.classList.contains('active')) {
//         extendedListElement.classList.remove('active')
//         return
//     }

//     removeActiveElements()
    
//     extendedListElement.classList.add('active')
// }

function toggleExtendedList(element) {
    if(element.classList.contains('extended')) {
        element.classList.remove('extended')
        return
    }

    removeActiveElements()
    
    element.classList.add('extended')
    
}

document.body.addEventListener('click', (e) => {
    if(!ifTarget(e)) removeActiveElements()
})
