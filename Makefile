
bundle: node_modules
	npm run bundle
test: node_modules
	npm test
node_modules:
	npm install
watch: node_modules
	npm run watch

.PHONY: test watch bundle
