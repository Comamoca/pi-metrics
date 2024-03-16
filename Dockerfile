FROM denoland/deno:debian

WORKDIR /app

COPY . .

RUN deno cache ./main.tsx

CMD ["deno", "run", "--allow-net", "--allow-read", "main.tsx"]
