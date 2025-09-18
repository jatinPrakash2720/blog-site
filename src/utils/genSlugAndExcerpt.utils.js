/**
 * Traverses the Tiptap JSON tree and extracts plain text for an excerpt.
 * @param {object} tiptapJSON The Tiptap content object.
 * @param {number} [maxLength=150] The maximum length of the excerpt.
 * @returns {string} A plain-text excerpt.
 */

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
};

const generateExcerpt = (tiptapJSON, maxLength = 150) => {
  let text = "";
  if (!tiptapJSON || !tiptapJSON.content) {
    return "";
  }

  function traverse(nodes) {
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
  if (trimmedText.length <= maxLength) {
    return trimmedText;
  }
  return `${trimmedText.substring(0, maxLength)}...`;
};

export { generateSlug, generateExcerpt };