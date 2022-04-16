SHELL := /bin/sh
FLAGS = --outDir dist/ --outFile $(OUT) --lib es2020,dom

SRC = script.ts
OUT = dist/script.js

# --strict
#  
#

.PHONY: all watch clean
all: $(OUT)

$(OUT): $(SRC)
	tsc $(FLAGS) $(SRC)

watch: $(SRC)
	tsc --watch $(FLAGS) $(SRC)

clean:
	rm dist/script.js
