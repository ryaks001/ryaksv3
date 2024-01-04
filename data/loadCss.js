import utils from './_utils.js'
import icdata from './configs/Icons.js'
import filters from './configs/Filters.js'

let datapath = new URL(".", import.meta.url).href
let eConsole = "%c RyaksV3 "
let eCss = "color: #ffffff; background-color: #f77fbe"

window.setTimeout(async()=> {
	DataStore.set("Summoner-ID", await utils.getSummonerID())
	console.log(eConsole+"%c Current summonerID: "+`%c${DataStore.get("Summoner-ID")}`,eCss,"color: #e4c2b3","color: #0070ff")
},5000)

let loadCss = async (node) => {
	let pagename, previous_page, ranked_observer
	pagename = node.getAttribute("data-screen-name")
	if (pagename == "rcp-fe-lol-store") {
		let runtime = 0
		let purchaseHistory = window.setInterval(() => {
			try {
				runtime += 1
				let storeIframe = document.querySelector('#rcp-fe-lol-store-iframe > iframe[referrerpolicy = "no-referrer-when-downgrade"]').contentWindow.document.querySelector("div.item-page-items-container-wrapper.purchase-history-page-content-wrapper")
					storeIframe.style.background = "transparent"
				let th = storeIframe.querySelectorAll("div > div > table > thead > tr > th")
				for (let i = 0; i < th.length; i++) {
					th[i].style.background = "transparent"
				}
				if (storeIframe.style.background == "transparent") {
					window.clearInterval(purchaseHistory)
					console.log(eConsole+"%c Cleared Background ("+`%c${runtime/10}%c)`,eCss,"color: #e4c2b3","color: #0070ff","color: #e4c2b3")
				}
			}
			catch {}
		},100)
	}
	if (pagename == "rcp-fe-lol-profiles-main") {		
        let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')
        window.setInterval(() => {
            try {
                document.querySelector("div.summoner-xp-radial").remove()
            }catch {}
			if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Rank-Name")) {
				try {
					document.querySelector(".style-profile-ranked-component.ember-view .style-profile-emblem-header-title").innerHTML = DataStore.get("Rank-line1")
					document.querySelector(".style-profile-emblem-subheader-ranked > div").innerHTML = DataStore.get("Rank-line2")
				}catch{}
			}
            if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Avatar")) {
                try {
					document.querySelector("lol-regalia-profile-v2-element").shadowRoot.querySelector("div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.querySelector("uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
				}catch {}
            }
			if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Regalia-Banner")) {
				try {
					document.querySelector("lol-regalia-profile-v2-element").shadowRoot.querySelector("lol-regalia-banner-v2-element").
						shadowRoot.querySelector("uikit-state-machine > div:nth-child(2) > img").src = `${datapath}assets/Icon/Regalia-Banners/${icdata["Regalia-banner"]}`
				}catch {}
			}
        }, 100)
        
        if (!ranked_observer && rankedNode) {
            ranked_observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.target.classList.contains('visible')) {
                        let tmpInterval = window.setInterval(() => {
                            try {
                                document.querySelector("div.smoke-background-container > lol-uikit-parallax-background").shadowRoot.querySelector(".parallax-layer-container").style.backgroundImage = ''
                                window.clearInterval(tmpInterval)
                            }
                            catch {}
                        }, 500)
                    }
                })
            })
            ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false })
        }		
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
        if (ranked_observer)
        ranked_observer.disconnect()
        ranked_observer = undefined
	}
	if (previous_page != pagename) {previous_page = pagename}
	if (DataStore.get("aram-only") && pagename == "rcp-fe-lol-parties") {
		window.setInterval(()=>{
			try{
				document.querySelector("div[data-game-mode='CLASSIC']").remove()
				document.querySelector("div[data-game-mode='TFT']").remove()
				document.querySelector("lol-uikit-navigation-item[data-category='VersusAi']").remove()
				document.querySelector("lol-uikit-navigation-item[data-category='Training']").remove()
			}catch{}
			try {
				if (document.getElementsByClassName("parties-game-navs-list")[0].getAttribute("selectedindex") == "0") {
					document.querySelector('div[data-game-mode=ARAM] div[class=parties-game-type-upper-half]').click()
				}
			}catch{}
			try {
				document.querySelector('div.parties-custom-game-subcategory-select > div[data-map-id="11"]').remove()
			}catch{}
			try {
				if (document.getElementsByClassName("parties-game-navs-list")[0].getAttribute("selectedindex") == "3") {
					document.querySelector('div.parties-custom-game-subcategory-select > div[data-map-id="12"] > div').click()
				}
			}catch{}
			try {
				let remove = window.setInterval(()=> {
					let test = document.querySelectorAll("div.custom-game-list-body lol-uikit-scrollable > tbody > tr")
					for (let i=0;i< test.length;i++) {
						if (test[i].querySelector("td.custom-game-list-table-body-map").innerText == "Summoner's Rift") {
							test[i].remove()
						}
					}
					window.setTimeout(()=>{window.clearInterval(remove)},2000)
				},100)
			}catch{}
		},100)
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		if (DataStore.get("Runes-BG")) {
			let style = (element) => {element.remove()}

			utils.subscribeToElementCreation('.aux', style)
			utils.subscribeToElementCreation('#splash', style)
			utils.subscribeToElementCreation('#construct', style)
			utils.subscribeToElementCreation('#keystone', style)

			utils.subscribeToElementCreation('.perks-construct-minspec', (element) => {
				window.setInterval(()=>{
					element.style.cssText = `
						top: 0px; 
						left: 0px; 
						filter: ${filters["Runes"]}; 
						background-image: var(--pri${element.getAttribute('primary')})
					`
				},100)
			})
		}
	}
}

function tickerCss(defaults) {
	try {
		Object.entries(defaults).forEach(([key, value]) => {
			let ticker = document.querySelector("#lol-uikit-layer-manager-wrapper lol-uikit-flyout-frame").shadowRoot
			if (DataStore.get("Custom-Icon")) {
				ticker.querySelector(key).style.cssText = value
			}
		});
	}catch{}
}

window.setInterval(()=>{
	tickerCss(
		{
			"div > div.border": "display: none;",
			"div > div.sub-border": "display: none;",
			"div > div.caret": "display: none;",
			"div > div.lol-uikit-flyout-frame": "background-color: black; border-radius: 10px;"
		}
	)

	if (DataStore.get("new-gamesearch-queue")) {
		try {
			let main = document.querySelector("lol-social-panel lol-parties-game-info-panel").shadowRoot
			let gameinfo = main.querySelector("lol-parties-status-card").shadowRoot
			let gamesearch = main.querySelector("lol-parties-game-search").shadowRoot
			let check = gameinfo.querySelector(".parties-status-card-bg-container")

			if (main && check.style.display != "none") {
				gameinfo.querySelector(".parties-status-card-body").style.cssText = `
					margin-top: -23px; 
					padding: 10px 5px 10px 10px; 
					border: 1px solid #8c8263; 
					border-radius: 10px
				`
				gameinfo.querySelector(".parties-status-card-header").style.cssText = `
					visibility: hidden;
					height: 14px;
				`
				gameinfo.querySelector(".parties-status-card-map").style.margin = "-3px 10px 0 0"
				gameinfo.querySelector(".parties-status-card").style.background = "transparent"
				gamesearch.querySelector("div").style.cssText = `
					border: 1px solid #8c8263; 
					border-radius: 10px; 
					margin-top: 9px
				`
				gamesearch.querySelector(".parties-game-search-divider").style.display = "none"
				main.querySelector(".parties-game-info-panel-bg-container").style.display = "none"
				check.style.display = "none"
			}
		}catch{}
	}
	
	if (DataStore.get("settings-dialogs-transparent")) {
		let style = "var(--Settings-and-Dialog-frame-color)"
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = style}catch{}
		try {document.querySelector("lol-uikit-full-page-backdrop > lol-uikit-dialog-frame > div").style.background = style}catch {}
		try {document.querySelector("lol-uikit-full-page-backdrop lol-regalia-identity-customizer-element").shadowRoot.querySelector("lol-regalia-banner-v2-element").remove()}catch{}
		try {document.querySelector(".lol-settings-container").style.background = style}catch {}
		try {document.querySelector(".lol-settings-container").shadowRoot.querySelector("div").style.background = style}catch{}
		try {document.querySelector("#lol-uikit-layer-manager-wrapper lol-uikit-dialog-frame").shadowRoot.querySelector("div").style.background = style}catch{}
	}	

	if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Hover-card-backdrop")) {
		try {
			if (document.querySelector("#lol-uikit-tooltip-root lol-regalia-hovercard-v2-element").getAttribute("summoner-id") == DataStore.get("Summoner-ID")) {
				document.querySelector("#hover-card-backdrop").style.backgroundImage = "var(--Hover-card-backdrop)"
			}
		}catch{}
	}

	if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Avatar")) {
		try {
			document.querySelector("lol-uikit-full-page-backdrop lol-regalia-identity-customizer-element").shadowRoot.
				querySelector("div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").shadowRoot.
				querySelector("uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		}catch {}
		try {
			document.querySelector("#lol-uikit-tooltip-root div.hover-card-info-container").style.background = "#1a1c21"
			document.querySelector(`#lol-uikit-tooltip-root lol-regalia-hovercard-v2-element[summoner-id="${DataStore.get("Summoner-ID")}"]`).shadowRoot.
				querySelector("lol-regalia-crest-v2-element").shadowRoot.
				querySelector("div > uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		}catch {}
		try {
			document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.
				querySelector("div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").shadowRoot.
				querySelector("uikit-state-machine > div.lol-regalia-summoner-icon-mask-container > div").style.backgroundImage = "var(--Avatar)"
		}catch {}
	}

	if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Border")) {
		try {
			document.querySelector("lol-uikit-full-page-backdrop lol-regalia-identity-customizer-element").shadowRoot.
				querySelector("div.regalia-identity-customizer-crest-wrapper > lol-regalia-crest-v2-element").shadowRoot.
				querySelector("uikit-state-machine > lol-uikit-themed-level-ring-v2").shadowRoot.querySelector("div").style.backgroundImage = 'var(--Border)'
		}catch{}
		try {
			document.querySelector(`#lol-uikit-tooltip-root lol-regalia-hovercard-v2-element[summoner-id="${DataStore.get("Summoner-ID")}"]`).shadowRoot.
				querySelector("lol-regalia-crest-v2-element").shadowRoot.querySelector("div > uikit-state-machine > lol-uikit-themed-level-ring-v2").shadowRoot.
				querySelector("div").style.backgroundImage = 'var(--Border)'
		}catch{}
		try {
			document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.querySelector("div.regalia-parties-v2-crest-wrapper > lol-regalia-crest-v2-element").shadowRoot.
				querySelector("uikit-state-machine > lol-uikit-themed-level-ring-v2").shadowRoot.
				querySelector("div").style.backgroundImage = 'var(--Border)'
		}catch{}
		try {
			document.querySelector("div > lol-regalia-profile-v2-element").shadowRoot.querySelector("div.regalia-profile-crest-hover-area.picker-enabled > lol-regalia-crest-v2-element").shadowRoot.
				querySelector("uikit-state-machine > lol-uikit-themed-level-ring-v2").shadowRoot.
				querySelector("div").style.backgroundImage = 'var(--Border)'
		}catch{}
	}

	if (DataStore.get("Custom-Icon") && DataStore.get("Custom-Regalia-Banner")) {
		try {
			document.querySelector("div.lobby-banner.local > lol-regalia-parties-v2-element").shadowRoot.
				querySelector("lol-regalia-banner-v2-element").shadowRoot.
				querySelector("uikit-state-machine > div:nth-child(2) > img").src = `${datapath}assets/Icon/Regalia-Banners/${icdata["Regalia-banner"]}`
		}catch{}
		try {
			document.querySelector("lol-uikit-full-page-backdrop lol-regalia-identity-customizer-element").shadowRoot.
				querySelector("lol-regalia-banner-v2-element").shadowRoot.
				querySelector("uikit-state-machine > div:nth-child(2) > img").src = `${datapath}assets/Icon/Regalia-Banners/${icdata["Regalia-banner"]}`
		}catch{}
	}
}, 500)

window.addEventListener("load", ()=> {
    if (DataStore.get("Runes-BG")) {
		utils.addCss("--Hover-card-backdrop",`${datapath}assets/Icon`,icdata['Hover-card'])
		utils.addFont(`${datapath}assets/Fonts`,"BeaufortforLOL-Bold.ttf","Lol-font","Ryaks")
		utils.addCss("--pri8000",`${datapath}assets/Backgrounds/Runes`,icdata['Precision'])
		utils.addCss("--pri8100",`${datapath}assets/Backgrounds/Runes`,icdata['Domination'])
		utils.addCss("--pri8200",`${datapath}assets/Backgrounds/Runes`,icdata['Sorcery'])
		utils.addCss("--pri8300",`${datapath}assets/Backgrounds/Runes`,icdata['Inspiration'])
		utils.addCss("--pri8400",`${datapath}assets/Backgrounds/Runes`,icdata['Resolve'])
	}
	if (DataStore.get("Animate-Loading")) {utils.addCss("--RyaksFly",`${datapath}assets/Icon`,icdata["Animation-logo"],`${datapath}assets/Css/Addon-Css/Animate-Loading-Screen.css`)}
	else {utils.addCss("--RyaksStatic",`${datapath}assets/Icon`,icdata["Static-logo"],`${datapath}assets/Css/Addon-Css/Static-Loading-Screen.css`)}

	if (DataStore.get("Custom-Icon")) {
		if (DataStore.get("Custom-Avatar")) {
			utils.addCss("--Avatar",`${datapath}assets/Icon`,icdata["Avatar"],`${datapath}assets/Css/Addon-Css/Icon/Avatar.css`)
		}
		if (DataStore.get("Custom-RP-Icon")) {
			utils.addCss("--RP-Icon",`${datapath}assets/Icon`,icdata["RP-icon"],`${datapath}assets/Css/Addon-Css/Icon/RiotPoint.css`)
		}
		if (DataStore.get("Custom-BE-Icon")) {
			utils.addCss("--BE-Icon",`${datapath}assets/Icon`,icdata["BE-icon"],`${datapath}assets/Css/Addon-Css/Icon/BlueEssence.css`)
		}
		if (DataStore.get("Custom-Rank-Icon")) {
			utils.addCss("--Rank-Icon",`${datapath}assets/Icon`,icdata["Rank-icon"],`${datapath}assets/Css/Addon-Css/Icon/Rank.css`)
		}
		if (DataStore.get("Custom-Emblem")) {
			utils.addCss("--Emblem",`${datapath}assets/Icon`,icdata["Honor"],`${datapath}assets/Css/Addon-Css/Icon/Emblem.css`)
		}
		if (DataStore.get("Custom-Clash-banner")) {
			utils.addCss("--Clash-banner",`${datapath}assets/Icon`,icdata["Class-banner"],`${datapath}assets/Css/Addon-Css/Icon/ClashBanner.css`)
		}
		if (DataStore.get("Custom-Ticker")) {
			utils.addCss("--Ticker",`${datapath}assets/Icon`,icdata["Ticker"],`${datapath}assets/Css/Addon-Css/Icon/Ticker.css`)
		}
		if (DataStore.get("Custom-Trophy")) {
			utils.addCss("--Trophy",`${datapath}assets/Icon`,icdata["Trophy"],`${datapath}assets/Css/Addon-Css/Icon/Trophy.css`)
		}
		if (DataStore.get("Custom-Border")) {
			utils.addCss("--Border",`${datapath}assets/Icon`,icdata["Border"])
		}
	}
	if (DataStore.get("Custom-Font")) {
		DataStore.set("Font-folder", `${datapath}assets/Fonts/Custom`)
		utils.addFont(DataStore.get("Font-folder"),DataStore.get("CurrentFont"),"Custom-font","Custom")
	}
	if (DataStore.get("Custom-Cursor")) {
		utils.CustomCursor(`url("${datapath}assets/Icon/${icdata["Mouse-cursor"]}")`,`${datapath}assets/Css/Addon-Css/Cursor.css`)
	}
    if (DataStore.get("hide-vertical-lines")) {
		utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Hide-vertical-lines.css`)
	}
	if (DataStore.get("aram-only")) {
		utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Aram-only.css`)
	}
	if (DataStore.get("Hide-Champions-Splash-Art")) {
		utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Hide-Champs-Splash-Art.css`)
	}
	if (DataStore.get("Sidebar-Transparent")) {
		utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Sidebar-Transparent.css`)
	}
	else {
		utils.addCss("","","",`${datapath}assets/Css/Addon-Css/Sidebar-Color.css`)
	}
    utils.addCss("","","",`${datapath}assets/Css/RyaksV3.css`)
	utils.mutationObserverAddCallback(loadCss, ["screen-root"])
})