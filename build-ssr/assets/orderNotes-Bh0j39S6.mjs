const buildAdditionalNotes = (notes) => JSON.stringify(notes);
const parseAdditionalNotes = (value) => {
  if (!value) {
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    return { notes: value };
  }
  return { notes: value };
};

export { buildAdditionalNotes as b, parseAdditionalNotes as p };
