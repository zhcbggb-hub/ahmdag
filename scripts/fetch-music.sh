#!/bin/sh
# Background music: "What About Action?" from Mixkit (Mixkit License: free for commercial projects,
# not to be redistributed on its own), so it is downloaded here instead of being committed.
set -e
mkdir -p public/music
curl -sSL -A "Mozilla/5.0" "https://assets.mixkit.co/music/474/474.mp3" -o public/music/what-about-action.mp3
echo "Saved public/music/what-about-action.mp3"
