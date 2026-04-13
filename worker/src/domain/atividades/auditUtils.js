export function describeValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'vazio';
  }
  return String(value);
}

export function describeBoolean(value) {
  return Number(value) === 1 ? 'Sim' : 'Não';
}

export function addChange(changes, label, before, after) {
  const beforeText = describeValue(before);
  const afterText = describeValue(after);
  if (beforeText !== afterText) {
    changes.push(`${label}: "${beforeText}" -> "${afterText}"`);
  }
}

export function buildUpdateDetails(before, after, fields) {
  const changes = [];
  for (const field of fields) {
    const format = field.format || ((value) => value);
    addChange(changes, field.label, format(before[field.key]), format(after[field.key]));
  }

  return changes.length > 0 ? changes.join('; ') : 'Sem alterações nos campos principais';
}
