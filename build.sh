# DENO: import {json} from 'src/main.ts'
# NODE: import {json} from 'dist/json.dev.mjs'

# BROWSER JS BUILDS
# <script type="module" src="[...]/json.dev.mjs"></script>
# Dev build - sourcemap, no minification, include tests.
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

# WASM BUILDS
# Dev build - include tests
cd ../
rm -r ./wasm/assembly
mkdir ./wasm/assembly
cp -r ./src/. ./wasm/assembly/
cd wasm/assembly && rm -rf .git
cd wasm/assembly
mv main.ts index.ts
npm run asbuild # fails because of explicit deno-style ".ts" imports
rm -r ./wasm/assembly

# Production build
# cd ../
# rm -r ./wasm/assembly
# mkdir ./wasm/assembly
# cd ./tmp (... where the .src files are gone)
# cp -r ./src/. ./wasm/assembly/
# ... &c.
# npm run asbuild
# rm -r ./wasm/assembly
# cd ../ && rm -r ./tmp