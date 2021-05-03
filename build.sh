# BROWSER JS BUILD
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

# WASM BUILD
cd ../
rm -r ./wasm/assembly/**/*
cp -r ./src/. ./wasm/assembly/
cd wasm/assembly
mv main.ts index.ts
npm run asbuild
# ^^ fails because of explicit deno-style ".ts" imports
# @todo - strip the file extensions after copying