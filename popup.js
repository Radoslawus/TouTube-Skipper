const adsTrigger = document.querySelector('#ContinueWatching')
let youtubeOptions

window.addEventListener('DOMContentLoaded', async() => {
    let youtubeOptions = await loadOptionsOrSetDefaults()
    setCheckbox(youtubeOptions)
})

adsTrigger.addEventListener('change', () => {
    setOptions()
})

function setOptions() {
    youtubeOptions.skipAds = adsTrigger.checked
    saveOptions(youtubeOptions)
}

function setCheckbox(youtubeOptions) {
    adsTrigger.checked = youtubeOptions.skipAds
}

function saveOptions(youtubeOptions) {
    chrome.storage.sync.set({
        'youtubeOptions': youtubeOptions
    })
}