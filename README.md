# Blog API

## Run app

```bash
deno run --allow-net --allow-read --allow-env flag src/main.t
```

## Run tests

```bash
deno test --allow-net --allow-read --allow-env
```

## Update api-gen

```bash
deno install -r -f -n api-gen --allow-read --allow-write https://raw.githubusercontent.com/aeonyxio/groot/main/main.ts
```

## Run api-gen

```bash
api-gen gen ./schema/api.json ./schema/objects.json
```
