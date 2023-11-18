#!/bin/bash
NAME=$1
LOGO=$2
SYMBOL=$3
IMAGE_URL=$4
TOTALSUPPLY=$5
PRINCIPAL=$6

cd "$(dirname "$0")"

echo "Adding $NAME canister to dfx.json..."
cat dfx.json | jq --arg name "$NAME" '.canisters += {($name): {"main": "src/token.mo"}}' > dfx.tmp
mv dfx.tmp dfx.json

dfx start --background
dfx canister create --all
dfx build

# Install the canister and capture the output
OUTPUT=$(dfx canister install token --argument="(\"$LOGO\", \"$NAME\", \"$SYMBOL\", $DECIMALS, $TOTALSUPPLY, principal \"$PRINCIPAL\", 0)")

# Extract the canisterId from the output
CANISTER_ID=$(echo "$OUTPUT" | grep -o 'Canister ID: [^ ]*' | awk '{print $3}')

# Save the canisterId to a file
echo "$CANISTER_ID" > canister-id-dip20

echo "Removing $NAME canister from dfx.json..."
cat dfx.json | jq --arg name "$NAME" 'del(.canisters[$name])' > dfx.tmp
mv dfx.tmp dfx.json
