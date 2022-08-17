#!/usr/bin/env bash

pkgs='obs-cli'
install=false

for pkg in $pkgs; do
  status="$(dpkg-query -W --showformat='${db:Status-Status}' "$pkg" 2>&1)"
  if [ ! $? = 0 ] || [ ! "$status" = installed ]; then
    install=true
    break
  fi
done
if "$install"; then
  echo "== Installing obs-cli package"
  sudo dpkg -i ./bin/obs-cli_0.5.0_linux_armv6.deb
fi
