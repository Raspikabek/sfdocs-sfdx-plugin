export default {
  questionmark(text: string): string {
    if (text === null || text === undefined) {
      return '';
    }
    return `${text}????`;
  },

  uppercase(text: string): string {
    if (text === null || text === undefined) {
      return '';
    }
    return text.toLowerCase();
  },
};
