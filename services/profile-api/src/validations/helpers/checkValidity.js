export const checkUniqueValidity = async ({
  detailList,
  key,
  uniqueErrorText,
  emptyErrorText,
  existsErrorText,
  filterKey,
  context,
  type,
  allowEmpty = false,
}) => {
  const values = detailList.map((d) => d[key]?.[0]?.value);
  const uniqueValues = new Set(values);

  if (uniqueValues.size !== values.length) {
    throw new Error(uniqueErrorText);
  }

  if (values.some((c) => !c) && !allowEmpty) {
    throw new Error(emptyErrorText);
  }

  const { getByArgs } = context.dataLoader;

  for (let i = 0; i < detailList.length; i++) {
    const detail = detailList[i];
    if (detail[key]?.[0]?.value) {
      const foundSimilarValues = (
        await getByArgs(
          {
            filters: {
              type,
              [filterKey]: detail[key]?.[0]?.value,
            },
            size: 1000,
          },
          {
            id: { raw: {} },
            [filterKey]: { raw: {} },
          }
        )
      )?.filter((c) => Object.keys(c ?? {}).length > 0 && c?.id !== detail.id);

      if (foundSimilarValues?.length > 0) {
        throw new Error(existsErrorText);
      }
    }
  }
};
