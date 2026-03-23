// composables/useBreadcrumbs.ts
export const useBreadcrumbs = () => {
  const overrides = useState<Record<string, string>>('breadcrumb-overrides', () => ({}));

  const setBreadcrumbLabel = (pathPart: string, label: string) => {
    overrides.value[pathPart] = label;
  };

  const getBreadcrumbLabel = (pathPart: string) => {
    return overrides.value[pathPart];
  };

  return {
    overrides,
    setBreadcrumbLabel,
    getBreadcrumbLabel
  };
};
