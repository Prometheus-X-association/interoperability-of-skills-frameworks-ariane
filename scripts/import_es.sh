#!/bin/bash

echo -e "\n"
echo " [Mindmatcher] local Docker Elasticsearch data importer"
echo " ======================================================"
echo -e "\n"

clear_line() {
  echo -ne "\r\033[K"
}

spinner() {
  local delay=0.1
  local spinstr='|/-\'
  while [ -d /proc/$pid ]; do
    local temp=${spinstr#?}
    printf "\r\t\t %s/%s %c" "$1" "$2" "$spinstr"
    spinstr=$temp${spinstr%"$temp"}
    sleep $delay
  done
}

docker pull -q elasticdump/elasticsearch-dump

# Declare per-index import types
declare -A index_types
# AI Translator
index_types["edge_matchings"]="settings mapping"
index_types["edge_rules"]="settings mapping"
index_types["search-ariane-jobs-and-skills"]="settings mapping data"
# Skill tagging
index_types["search-skill-tagging-matchings"]="settings mapping"
index_types["search-esco-skills"]="settings mapping data"

echo -e "\n👉 Download elasticsearch data"
if [ -z "$(ls -A '.downloaded/elasticsearch' 2>/dev/null)" ]; then
    for index in "${!index_types[@]}"; do
        echo -e "   └─${index}"
        types=(${index_types[$index]})
        for type in "${types[@]}"; do
            echo -ne "     └─${type} ⏳"
            wget "https://storage.googleapis.com/elasticsearch-edge-ai-translator/${index}-${type}.json" \
                --quiet \
                --directory-prefix .downloaded/elasticsearch
            sleep 1
            clear_line && echo -e "     └─${type} ✔️"
        done
    done
else
    echo -e "  └─elasticsearch data already fetched locally in .downloaded/elasticsearch ✔️"
fi

echo -e "\n👉 Import elasticsearch data"
for index in "${!index_types[@]}"; do
    echo -e "   └─${index}"
    curl -s -o /dev/null -X POST "http://localhost:9200/${index}/_delete_by_query" -H 'Content-Type: application/json' -d '{"query":{"match_all":{}}}'
    types=(${index_types[$index]})
    for type in "${types[@]}"; do
        echo -ne "     └─${type} ⏳"
        docker run \
            --rm \
            --network edge-translator-origin_ai-translator-network \
            -v "$(pwd)/.downloaded/elasticsearch:/mnt/host_folder" \
            -ti elasticdump/elasticsearch-dump \
            --output="http://elasticsearch:9200/${index}" \
            --input="/mnt/host_folder/${index}-${type}.json" \
            --overwrite \
            --type="${type}" \
            --quiet
        sleep 1
        clear_line && echo -e "     └─${type} ✔️"
    done
done

echo -e "   └─🎉 Import succeeded"
exit 0