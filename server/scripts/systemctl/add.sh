#!/usr/bin/env bash

echo "== Add 'obs.controller.darts.service' system service"
sudo cp ./scripts/systemctl/obs.controller.darts.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable obs.controller.darts.service
sudo systemctl start obs.controller.darts.service
sudo systemctl status obs.controller.darts.service
