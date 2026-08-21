import { jsonLdString } from "../lib/seo";

type Props = { data: unknown };

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // Serialized via jsonLdString which escapes '<' → <.
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
