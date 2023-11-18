#!/usr/bin/env bash

# Additional information
IMAGE_URL=$1
DESCRIPTION=$2
MINT_NAME=$3
COLLECTION_NAME=$4
COLLECTION_LIMIT=$5

# Check if the canister with the given name already exists in dfx.json
if jq -e ".canisters[\"$COLLECTION_NAME\"]" dfx.json > /dev/null 2>&1; then
  echo "Canister with name \"$COLLECTION_NAME\" already exists. Skipping deployment."
else
  # Add the new canister entry to dfx.json
  jq --arg newCanisterName "$COLLECTION_NAME" \
    '.canisters += { ($newCanisterName): { "main": "src/Main.mo" } }' dfx.json > dfx.json.tmp && mv dfx.json.tmp dfx.json

  # Execute the canister deployment
  OUTPUT=$(dfx deploy "$COLLECTION_NAME" --argument "(
    principal\"$(dfx identity get-principal)\", 
    record {
      logo = record {
        logo_type = \"$IMAGE_URL\";
        data = \"$DESCRIPTION\";
      };
      name = \"$COLLECTION_NAME\";
      symbol = \"MintTest\";
      maxLimit = $COLLECTION_LIMIT;
    }
  )")

# Extract the Canister ID from the URLs section of the output

CANISTER_ID=$(dfx canister id $COLLECTION_NAME)

# Save the Canister ID to a file
echo "$CANISTER_ID" > canister-id-file

# Print the Canister ID
echo "Canister IDs: $CANISTER_ID"
jq "del(.canisters[\"$COLLECTION_NAME\"])" dfx.json > dfx.json.tmp && mv dfx.json.tmp dfx.json

fi
