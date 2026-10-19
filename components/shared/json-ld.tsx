import type { Graph, Thing } from "schema-dts";

export function JsonLd({ data }: { data: Thing | Graph }) {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
