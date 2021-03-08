
nx:
	#yarn build
	cp -R /home/evgen/Projects/026-mgxr-project/mgxr/build/. /home/evgen/Projects/026-mgxr-project/gh-pages-build/
	cd /home/evgen/Projects/026-mgxr-project/gh-pages-build/
	git add --all
	git commit -m '1820'
	git push
