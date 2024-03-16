FROM denoland/deno:debian

WORKDIR /app

COPY . .

RUN deno cache ./main.tsx

RUN echo "HOST_ADDRESS=ws://149.comamoca.dev" > .env

CMD ["deno", "run", "--allow-net", "--allow-read", "main.tsx"]
