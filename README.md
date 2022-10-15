# Blog API

## Run app

```bash
deno run --allow-net --allow-read --allow-env src/main.ts
```

## Run tests

```bash
deno test --allow-net --allow-read --allow-env
```

## Update api-gen

```bash
deno install -r -f -n api-gen --allow-read --allow-write https://raw.githubusercontent.com/aeonyxio/groot/main/src/mod.ts
```

## Run api-gen

```bash
api-gen deno-oak-server --force gen ./schema/api.json ./schema/objects.json --oakImport https://deno.land/x/oak@v11.1.0
```
