import { render } from "https://deno.land/x/aeonyx_md@v0.0.2/mod.ts";

import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-go?no-check";
import "https://esm.sh/prism-svelte@0.5.0?no-check";

export class RendererService {
  render = render;
}
