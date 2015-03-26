#!/bin/bash

# download
UA="Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:36.0) Gecko/20100101 Firefox/36.0.1 Waterfox/36.0.1"
grep --no-group-separator -A 1 "^// http" icon-encoder.less \
    | while read URL; do
        URL="${URL:3}"
        read FILE
        FILE="$(cut -d"'" -f2 <<< "$FILE")"
        wget -nv -O "$FILE" --user-agent="$UA" "$URL"
    done

# convert
lessc icon-encoder.less > out.css
