/**
 * Extracts plain text from Tiptap JSON content
 * @param tiptapJSON The Tiptap content object
 * @param maxLength Maximum length of the extracted text (optional)
 * @returns Plain text string
 */
export const extractTextFromTiptap = (
  tiptapJSON: any,
  maxLength?: number
): string => {
  let text = "";
  if (!tiptapJSON || !tiptapJSON.content) {
    return "";
  }

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (node.type === "text" && node.text) {
        text += node.text;
      }
      if (node.content) {
        traverse(node.content);
      }
      if (["paragraph", "heading"].includes(node.type) && !text.endsWith(" ")) {
        text += " ";
      }
    }
  }

  traverse(tiptapJSON.content);

  const trimmedText = text.trim();
  if (maxLength && trimmedText.length > maxLength) {
    return `${trimmedText.substring(0, maxLength)}...`;
  }
  return trimmedText;
};

