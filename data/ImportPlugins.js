import {getPluginsName} from "./openFolder.js"
let init
if (DataStore.get("Dev-mode")) {
	let res = await fetch(`//plugins/${getPluginsName()}/RyaksV3-Data/data/built-in_plugins/Settings.js`)
	if (res.status == 200) {
		init = (await (() => import(`//plugins/${getPluginsName()}/RyaksV3-Data/data/built-in_plugins/Settings.js`))()).init
	}
}
else {
	let res = await fetch(`https://unpkg.com/Ryaksv3-data@latest/data/built-in_plugins/Settings.js`)
	if (res.status == 200) {
		init = (await (() => import(`https://unpkg.com/Ryaksv3-data@latest/data/built-in_plugins/Settings.js`))()).init
	}
}
export {init}