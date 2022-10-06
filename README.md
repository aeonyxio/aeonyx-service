# Blog API

## Run app

```bash
deno run --allow-net --config config.json --allow-read src/main.t
```

## Run tests

```bash
deno test --allow-net --allow-read --config config.json
```

## Update api-gen

```bash
deno install -r -f -n api-gen --allow-read --allow-write https://raw.githubusercontent.com/aeonyxio/groot/main/main.ts
```

## Run api-gen

```bash
api-gen gen ./schema/api.json ./schema/objects.json
```
