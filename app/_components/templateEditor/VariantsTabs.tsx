const VariantsTabs = ({
  variants,
  selectedVariant,
  setSelectedVariant,
}: any) => (
  <div className="px-8 bg-bg-secondary border-b border-border">
    <div className="flex gap-1">
      {variants &&
        variants.map((variant: any) => (
          <button
            key={variant?.id}
            onClick={() => setSelectedVariant(variant)}
            className={`px-4 py-3 rounded-t-md text-sm font-medium border-b-2 ${
              selectedVariant?.id === variant?.id
                ? "bg-bg text-text border-primary"
                : "bg-transparent text-text-secondary border-transparent"
            }`}
          >
            {variant?.name}
          </button>
        ))}
    </div>
  </div>
);

export default VariantsTabs;
