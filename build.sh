# Build sourcemap, no --minify, and include tests.
cd src
../node_modules/.bin/esbuild main.src.ts \
	--bundle \
	--sourcemap \
	--format=esm \
	--outfile=../dist/json.dev.mjs

# Production build
# mkdir tmp && cd tmp && cp the files to tmp
# find all tmp/**/*.src.ts
# delete corresponding *.ts files (= the tests)
# mv *.src.ts *.ts
# ../node_modules/.bin/esbuild \
# 	--bundle \
#	--format=esm \
# --outfile=../dist/json.mjs