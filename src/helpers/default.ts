export default {
  uppercase(text: string): string {
    if (text === null || text === undefined) {
      return '';
    }
    return text.toUpperCase();
  },

  lowercase(text: string): string {
    if (text === null || text === undefined) {
      return '';
    }
    return text.toLowerCase();
  },

  isFieldRelated(object: string, field: string): boolean {
    const objectName = object.split('.')[0];
    return field.startsWith(`${objectName}.`);
  },

  // Add more helper methods as needed
};
