#!/bin/bash
cd /home/kavia/workspace/code-generation/soundshare-297317/music_sharing_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

