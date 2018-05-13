export function toComment(value: string): string {
  if (!value) {
    return '';
  }
  return `/* ${value} */`;
}

const primitives = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'Uuid',
};

export function toPrimitive(value: string): string {
  return primitives[value] || value || '';
}
