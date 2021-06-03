CXX=dogescript
CXXFLAGS=--beautify

JSFILES=background.js \
		popup/index.js \
		popup/select.js \
		jwt/inject_jwt.js

all: ${JSFILES}

background.js: background.djs
	${CXX} $^ ${CXXFLAGS} > $@

jwt/inject_jwt.js: jwt/inject_jwt.djs
	${CXX} $^ ${CXXFLAGS} > $@

popup/index.js: popup/index.djs
	${CXX} $^ ${CXXFLAGS} > $@

popup/select.js: popup/select.djs
	${CXX} $^ ${CXXFLAGS} > $@

clean:
	rm -f ${JSFILES}

.PHONY: all clean
