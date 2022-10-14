const MAX_TRIES_MONITOR_SKIP = 10
let isMonitorActive = null
let youtubeOptions

async function initContent() {
    youtubeOptions = await loadOptionsOrSetDefaults()
    startHelper(youtubeOptions)
}

initContent()

chrome.storage.onChanged.addListener(
    (changes, areaName) => {
        if (areaName === 'sync' && changes.youtubeOptions?.newValue) {
            youtubeOptions = changes.youtubeOptions.newValue
            startHelper(youtubeOptions)
        }
    }
)

function startMonitoringForSelectors(selectors, numTries) {
    numTries++
    const monitor = new MutationObserver(() => {
        let selector = selectors.join(', ')
        let elems = document.querySelectorAll(selector)
        let video = document.querySelector('video')
        for (const elem of elems) {
            const newClass = elem.getAttribute("class")
            if (youtubeOptions.skipAds && newClass.includes('ytp-ad-skip-button')) {
                elem.click()
                console.log('skip type 1')
            }
            if (youtubeOptions.skipAds && newClass.includes('ytp-ad-preview-text') && !elem.classList.contains('done')) {
                elem.classList.add('done')
                video.currentTime = video.duration
                console.log('skip type 2')
            }
            if (youtubeOptions.skipAds && newClass.includes('ytp-ad-overlay-close-container') && !elem.classList.contains('done')) {
                elem.classList.add('done')
                elem.click()
                console.log('skip overlay elem')
            }
        }
    })

    let reactEntry = document.querySelector('body')
    if (!selectors.length) {
        return
    } else if (reactEntry) {
        if (!isMonitorActive) {
            monitor.observe(reactEntry, {
                attributes: false,
                childList: true,
                subtree: true,
            })
            isMonitorActive = true
        }
    } else {
        if (numTries > MAX_TRIES_MONITOR_SKIP) { return }
        setTimeout(() => {
            startMonitoringForSelectors(selectors, numTries)
        }, 100 * numTries)
    }
}

function startHelper(youtubeOptions) {
    let selectors = []
    if (youtubeOptions.skipAds) { enableskipAds(selectors) }
    startMonitoringForSelectors(selectors, 0)
}

function enableskipAds(selectors) {
    selectors.push('.ytp-ad-skip-button')
    selectors.push('.ytp-ad-preview-text')
    selectors.push('.ytp-ad-overlay-close-container')
}