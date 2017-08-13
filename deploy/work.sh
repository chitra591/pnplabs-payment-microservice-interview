#!/bin/bash
set -e

### Configuration ###

APP_DIR=/var/www/pnplabs-payment-microservice-interview
GIT_URL=git://github.com/chitra591/pnplabs-payment-microservice-interview
RESTART_ARGS=

### Automation steps ###

set -x

# Pull latest code
if [[ -e $APP_DIR/code ]]; then
  cd $APP_DIR/code
  git pull
else
  git clone $GIT_URL $APP_DIR/code
  cd $APP_DIR/code
fi

# Install dependencies
npm install --production
npm prune --production

# Restart app
passenger-config restart-app --ignore-app-not-running --ignore-passenger-not-running $RESTART_ARGS $APP_DIR/code
