# ShikiJoy
Chrome extension that replaces [animejoy.ru](https://animejoy.ru) website pages with my React app in purpose of complete overhaul

## Reasoning
- AnimeJoy is a nice site, but user experience is not great.
- I want to integrate [Shikimori](https://shikimori.one).
- Absence of API and Cloudflare protection makes it very problematic to build a separate website that would consume animejoy data.

## Notes
This is a development repo. Releases will be available later.

Run `npm run install` **([concurrently](https://github.com/open-cli-tools/concurrently) is required)** to install dependencies. Then you can run 
* `npm run dev` **([concurrently](https://github.com/open-cli-tools/concurrently) is required)** to run demo on your machine.
* `npm run build` to generate bundled script and stylesheet.

Repo divided onto 3 folders: 
* react - frontend of the app
* server - api/proxy built with NextJS
* extension - actual extension

**react app must be _bundled_ (use ```npm run build```) to be used in the extension**
