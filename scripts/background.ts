import {browser, Tabs} from "webextension-polyfill-ts";
import Tab = Tabs.Tab;

browser.contextMenus.create({
    id: "remove_element",
    title: "Göm titel",
    documentUrlPatterns: ["https://*/*", "http://*/*"],
    contexts: ["image"],
});

browser.contextMenus.onClicked.addListener(async ({linkUrl}, tab) => {
    console.log('add', linkUrl)
    const { app = [] } = await browser.storage.local.get('app');

    if(linkUrl && !app.includes(linkUrl)){
        app.push(linkUrl)
    }

    console.log('App', app);
    await browser.storage.local.set({ app })
    await sendMessageToContent(app);
});

browser.runtime.onMessage.addListener(async (msg) => {
    init();
});

async function sendMessageToContent(app: string[]): Promise<boolean>{
    try {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        });

        const messages = tabs.map((tab) => {
            return sendMessageToTab(tab, app);
        });

        return Promise.all(messages).then(() => true);
    } catch(error){
        return Promise.reject(error)
    }
}

function sendMessageToTab(tab:Tab, app:string[]): Promise<any> {
    return browser.tabs.sendMessage(
        tab.id,
        {app}
    )
}

async function show(){
    const { app = [] } = await browser.storage.local.get('app');
    console.table(app);
}

async function undo(index: number){
    let { app = [] } = await browser.storage.local.get('app');
    app.splice(index, 1);
    console.log(app);
    await browser.storage.local.set({app});
    //@ts-ignore
    show();
}

async function init(){
    const { app = [] } = await browser.storage.local.get('app');
    //@ts-ignore
    window.show = show;
    //@ts-ignore
    window.undo = undo;
    //@ts-ignore
    console.log(window.log, window.show);
    await sendMessageToContent(app);
}

init();
