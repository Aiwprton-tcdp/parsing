import { Builder, Browser, Capabilities, ThenableWebDriver, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/firefox.js';

export class Tournaments {
	url = process.env.KHL_URL;
	results = [];

	constructor() {
		console.log(this.url);
	}

	async parseResults() {
		const result = await this.parsePage();
		return result ? result : this.results;
	}

	async _parsePage() {
		// let response = await fetch(this.url, {
		// 	headers: {
		// 		'Access-Control-Allow-Origin': 'null',

		// 		// 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
		// 		// ':authority': 'nb-bet.com',
		// 		// ':path': '/hockey/Tournaments?ID=1',
		// 		// ':scheme': 'https',
		// 		// 'accept-encoding': 'gzip, deflate, br, zstd',
		// 		// 'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
		// 		// 'cache-control': 'max-age=0',
		// 		// 'cookie': '__AntiXsrfToken=733b803a07374d629baab9070b45892b; _ym_uid=1733055484415093081; _ym_d=1733055484; _ym_isad=1; SLO_G_WPT_TO=ru; SLO_GWPT_Show_Hide_tmp=1; SLO_wptGlobTipTmp=1; _ym_visorc=w',
		// 		// 'priority': 'u=0, i',
		// 		// 'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Opera";v="114"',
		// 		// 'sec-ch-ua-mobile': '?0',
		// 		// //'sec-ch-ua-platform': '"Windows"',
		// 		// 'sec-fetch-dest': 'document',
		// 		// 'sec-fetch-mode': 'navigate',
		// 		// 'sec-fetch-site': 'none',
		// 		// 'sec-fetch-user': '?1',
		// 		// 'upgrade-insecure-requests': '1',
		// 		// 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0'
		// 	}
		// });

		// if (response.ok) {
		// 	let json = await response.json();
		// 	console.log(json);
		// } else {
		// 	console.log("Ошибка HTTP: " + response.status);
		// }
	}

	async parsePage() {
		if (!this.url) {
			const emptyEnvErrorText = 'Ошибка: файл .env не заполнен';
			return emptyEnvErrorText;
		}

		let _error;
		try {
			const driver = this.initDriver();
			await driver.get(this.url);
			await driver.sleep(1000);
			
			const htmlSchedule = await this.parseSchedulePage(driver);
			this.results = this.getScheduleData(htmlSchedule);
		} catch (error) {
			_error = error.message;
			console.log(_error);
		}

		return _error ? _error : false;
	}

	async parseSchedulePage(driver) {
		if (!await this.clickScheduleTab(driver)) return '';
		return await driver.getPageSource();
	}

	async clickScheduleTab(driver) {
		const scheduleTabId = 'MainContent_tabLeague_tpSchedule_tab';
		const scheduleButtons = await driver.findElements(By.id(scheduleTabId));
		if (scheduleButtons == null || scheduleButtons.length == 0) return false;
		await driver.executeScript('arguments[0].click();', scheduleButtons[0]);
		await driver.sleep(1000);
		return true;
	}

	getScheduleData(data) {
		const match = /<tr class="rows-border-top">[^>]+>(?<date>(?:\d{2}\.?){3})\s(?<time>(?:\d{2}:?){2})(?:[^>]+>){4}(?<first>[^<]+)[^>]+>\s-\s(?<second>[^<]+)/g;
		return [...data.matchAll(match)].map(d => {
			return {
				date: d[1],
				time: d[2],
				first: d[3],
				second: d[4],
			}
		});
	}

	initDriver() {
		const opt = new Options().addArguments(
			'--headless',
			'start-maximized',
			'disable-infobars',
			'--disable-extensions',
			'--no-sandbox',
			'--disable-application-cache',
			'--disable-gpu',
			'--disable-dev-shm-usage',
		);

		const driver = new Builder()
			.forBrowser(Browser.FIREFOX)
			.setFirefoxOptions(opt)
			.withCapabilities(Capabilities.firefox().set('acceptInsecureCerts', true))
			.build();

		return driver;
	}
}