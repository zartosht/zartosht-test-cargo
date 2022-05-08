ARG NODE_VERSION

FROM node:${NODE_VERSION}-alpine

RUN apk add --no-cache git

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN apk add --no-cache  --virtual .build-deps shadow && \
    ([ "${GROUP_ID}" == "1000" ] || groupmod -g ${GROUP_ID} node) && \
    ([ "${USER_ID}" == "1000" ] || usermod -u ${USER_ID} node ) && \
    mkdir -p /home/node/.vscode-server/extensions /home/node/.vscode-server-insiders/extensions && \
    chown -R node:node /home/node/ && \
    apk del .build-deps && rm -rf /var/cache/apk/*

ARG EXTRA_PKGS

RUN [ -z "$EXTRA_PKGS" ] || (apk add --no-cache $EXTRA_PKGS && rm -rf /var/cache/apk/*)

WORKDIR /app

EXPOSE 3000

RUN mkdir node_modules && echo '' > node_modules/.keep && chown node:node -R /app && npm i -g typescript

USER node

VOLUME [ "/app/node_modules" ]

CMD exec /bin/sh -c "trap : TERM INT; (while true; do sleep 1000; done) & wait"
