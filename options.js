async function loadOptionsOrSetDefaults() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('youtubeOptions', async(item) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            youtubeOptions = item?.youtubeOptions
            if (!youtubeOptions) {
                youtubeOptions = {
                    "skipAds": true,
                }
                chrome.storage.sync.set({
                    'youtubeOptions': youtubeOptions
                })
            }
            resolve(youtubeOptions)
        })
    })
}