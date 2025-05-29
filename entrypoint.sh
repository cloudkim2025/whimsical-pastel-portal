#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  VITE_NAVER_CLIENT_ID: "${VITE_NAVER_CLIENT_ID}",
  VITE_NAVER_REDIRECT_URI: "${VITE_NAVER_REDIRECT_URI}",
  VITE_IMP_CODE: "${VITE_IMP_CODE}",
  VITE_CHANNEL_KEY: "${VITE_CHANNEL_KEY}"
}
EOF

exec nginx -g "daemon off;"