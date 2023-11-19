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
OUTPUT=$(dfx deploy --argument "(
  principal\"$PRINCIPAL\", 
  record {
    logo = record {
      logo_type = \"$IMAGE_URL\";
      data = \"\";
    };
    name = \"$NAME\";
    symbol = \"$SYMBOL\";
    maxLimit = $TOTALSUPPLY;
  }
)"
)

# Extract the canisterId from the output
CANISTER_ID=$(echo "$OUTPUT" | grep -o 'Canister ID: [^ ]*' | awk '{print $3}')

# Save the canisterId to a file
echo "$CANISTER_ID" > canister-id-dip721

echo "Removing $NAME canister from dfx.json..."
cat dfx.json | jq --arg name "$NAME" 'del(.canisters[$name])' > dfx.tmp
mv dfx.tmp dfx.json
