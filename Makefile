
mgxr_build:
	yarn build
	cp -R /home/evgen/Projects/026-mgxr-project/mgxr/build/. /home/evgen/Projects/026-mgxr-project/gh-pages-build/
	cd /home/evgen/Projects/026-mgxr-project/gh-pages-build/ \
		&& git add --all && git status && git commit -m `date +%FT%T%Z` && git push

start:
	yarn start
