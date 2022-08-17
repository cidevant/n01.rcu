#!/usr/bin/env bash

echo "== Remove 'obs.controller.darts' system service"
sudo systemctl stop obs.controller.darts.service
sudo systemctl disable obs.controller.darts.service
sudo rm -rf /etc/systemd/system/obs.controller.darts.service
sudo systemctl daemon-reload
