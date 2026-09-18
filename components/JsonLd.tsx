type JsonLdProps = {
  data: unknown;
};

const serialize = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
