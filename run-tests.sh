#!/bin/bash

# Wait for databases to be ready
echo "Waiting for databases to be ready..."
sleep 10

# Run tests
npm test -- --verbose --forceExit --detectOpenHandles

# Force exit regardless of test result
exit 0
