#!/usr/bin/env bash
# Fetch the image/font assets referenced by the vendored ExtJS theme CSS files.
set -u
EXT_DIR="$(cd "$(dirname "$0")/../src/main/resources/static/ext" && pwd)"
BASE="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0"
CSS_FILES=(
  "classic/theme-neptune/resources/theme-neptune-all_1.css"
  "classic/theme-neptune/resources/theme-neptune-all_2.css"
  "packages/font-ext/resources/font-ext-all.css"
  "packages/font-awesome/resources/font-awesome-all.css"
)

tmp_list=$(mktemp)
for css in "${CSS_FILES[@]}"; do
  dir=$(dirname "$css")
  grep -ohE "url\(['\"]?[^)'\"]+" "$EXT_DIR/$css" 2>/dev/null \
    | sed -E "s/^url\(['\"]?//; s/\?.*$//; s/#.*$//" \
    | grep -vE '^(data:|//)' \
    | sed -E "s|^$dir/|$dir/|; s|^([^/])|$dir/\1|"
done | sed '/^$/d' | sort -u > "$tmp_list"

echo "assets to fetch: $(wc -l < "$tmp_list")"
ok=0; fail=0
while read -r asset; do
  mkdir -p "$EXT_DIR/$(dirname "$asset")"
  if curl -sS -f -m 60 -o "$EXT_DIR/$asset" "$BASE/$asset"; then
    ok=$((ok+1))
  else
    rm -f "$EXT_DIR/$asset"
    fail=$((fail+1))
    echo "FAILED: $asset"
  fi
done < "$tmp_list"
rm -f "$tmp_list"
echo "done. ok=$ok fail=$fail"
