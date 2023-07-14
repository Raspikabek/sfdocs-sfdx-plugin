export default {
  uppercase(text: string | null | undefined): string {
    if (text === null || text === undefined) {
      return '';
    }
    return text.toUpperCase();
  },

  lowercase(text: string | null | undefined): string {
    if (text === null || text === undefined) {
      return '';
    }
    return text.toLowerCase();
  },

  isFieldRelated(object: string, field: string): boolean {
    const objectName = object.split('.')[0];
    return field.startsWith(`${objectName}.`);
  },

  eq(a: string, b: string): boolean {
    return a === b;
  },

  isArray(value: unknown): boolean {
    return Array.isArray(value);
  },

  toArray(items: unknown): unknown[] {
    return Array.isArray(items) ? items : [items];
  },

  // Add more helper methods as needed
};
