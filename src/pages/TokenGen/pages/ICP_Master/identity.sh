#!/usr/bin/env bash

# Additional information
IDENTITY=$1



dfx identity new --disable-encryption $IDENTITY 
dfx identity use $IDENTITY
dfx identity get-principal

OUTPUT=$(dfx identity get-principal)


Identity_ID=$(dfx identity get-principal)

# Save the Canister ID to a file
echo "$Identity_ID" > ID-id-file

# Print the Canister ID
echo "Identity_ID: $Identity_ID & name: $identity"

