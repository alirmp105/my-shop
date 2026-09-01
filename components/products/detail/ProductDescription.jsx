
export function ProductDescription({ description }) {
  if (!description) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">توضیحات محصول</h2>
      <div className="whitespace-pre-line text-sm leading-8 text-foreground/90 sm:text-base">{description}</div>
    </section>
  );
}
