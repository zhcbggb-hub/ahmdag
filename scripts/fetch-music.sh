#!/bin/sh
# Downloads the music and sound effects used by the videos into public/music and public/sfx.
# They come from Mixkit (Mixkit License: free for commercial projects, not to be redistributed
# on their own), so they are downloaded here instead of being committed.
set -e
mkdir -p public/music public/sfx
get() { curl -sSL -A "Mozilla/5.0" "$1" -o "$2"; echo "Saved $2"; }

get https://assets.mixkit.co/music/474/474.mp3 public/music/what-about-action.mp3
get https://assets.mixkit.co/music/371/371.mp3 public/music/cat-walk.mp3
get https://assets.mixkit.co/music/460/460.mp3 public/music/arab-nights.mp3
get https://assets.mixkit.co/music/470/470.mp3 public/music/golden-storm.mp3

sfx() { get "https://assets.mixkit.co/active_storage/sfx/$1/$1-preview.mp3" "public/sfx/$2.mp3"; }
sfx 1491 pin-fall
sfx 1143 impact-deep
sfx 1489 wings
sfx 3005 pop
sfx 2633 sparkle
sfx 2608 zoom
sfx 2357 notify
sfx 2568 tap
sfx 2908 impact-epic
sfx 1492 whoosh-fast
sfx 790 riser
sfx 837 stamp
sfx 2842 key
sfx 833 hammer
sfx 2367 pen
sfx 1993 coins
sfx 1530 paper
