MakeItRed = {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],
	
	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},
	
	log(msg) {
		Zotero.debug("Make It Red: " + msg);
	},
	
	addToWindow(window) {
		let doc = window.document;
		
		// Add a stylesheet to the main Zotero pane
		let link1 = doc.createElement('link');
		link1.id = 'make-it-red-stylesheet';
		link1.type = 'text/css';
		link1.rel = 'stylesheet';
		link1.href = this.rootURI + 'style.css';
		doc.documentElement.appendChild(link1);
		this.storeAddedElement(link1);
		
		// Use Fluent for localization
		window.MozXULElement.insertFTLIfNeeded("make-it-red.ftl");
		
		// Add menu option
		let menuitem = doc.createXULElement('menuitem');
		menuitem.id = 'make-it-green-instead';
		menuitem.setAttribute('type', 'checkbox');
		menuitem.setAttribute('data-l10n-id', 'make-it-red-green-instead');
		//  این آیدی 'data-l10n-id' چیست؟ چطور میتوان به مشابه آن دسترسی پیدا کرد؟ 
		// هرچیزی در صفحه زوترو، این آیدی براش ست بشه، میره اون آیدی جلوش رو از توی فایل دات اف تی ال پیدا میکنه اونی که توی اون فایل نوشته شده رو براش ست میکنه
		// MozMenuItem#checked is available in Zotero 7
		menuitem.addEventListener('command', () => {
			MakeItRed.toggleGreen(window, menuitem.checked);
		});
		doc.getElementById('menu_toolsPopup').appendChild(menuitem);
		// آیدی های آِتم های مختلف در یک صفحه زوترو چه چیز هایی هستند تا بعدا بتوانیم به آنها دسترسی پیدا کنیم؟ 
		// از هوش مصنوعی باید بپرسیم
		this.storeAddedElement(menuitem);
	},
	
	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},
	
	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		this.addedElementIDs.push(elem.id);
	},
	
	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="make-it-red.ftl"]').remove();
	},
	
	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},
	
	toggleGreen(window, enabled) {
		window.document.documentElement
			.toggleAttribute('data-green-instead', enabled);
	},
	
	async main() {
		// Global properties are included automatically in Zotero 7
		var host = new URL('https://foo.com/path').host;
		this.log(`Host is ${host}`);
		
		// Retrieve a global pref
		this.log(`Intensity is ${Zotero.Prefs.get('extensions.make-it-red.intensity', true)}`);
	},
};
