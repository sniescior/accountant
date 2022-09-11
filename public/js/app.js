function toggleButton(elementId) {
    const element = document.getElementById(elementId)
    if(element.classList.contains('active')) {
        element.classList.remove('active')
    } else {
        element.classList.add('active')
    }
}

function toggleNestedMenu(elementId) {
    const element = document.getElementById(elementId)
    const appContainer = document.getElementById('appContainer')
    const elementLinkId = elementId + '-link'
    const elementLink = document.getElementById(elementLinkId)
    console.log(elementLink);
    if(element.classList.contains('hidden')) {
        element.classList.remove('hidden')
        appContainer.classList.add('hidden')
        elementLink.classList.add('move-right')
    } else {
        element.classList.add('hidden')
        appContainer.classList.remove('hidden')
        elementLink.classList.remove('move-right')
    }
}