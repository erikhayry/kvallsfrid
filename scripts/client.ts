import { browser } from "webextension-polyfill-ts";
browser.runtime.onMessage.addListener( ({ app = [] } : { app: string[]}) => {
    console.log('app', app)
    app.forEach(url => {
        const els = document.querySelectorAll(`a[href='${url.replace('https://www.svt.se', '')}']`);
        els.forEach((el: HTMLElement) => {
            el.parentElement.style.display = 'none';
        })
    })
});


browser.runtime.sendMessage('init');