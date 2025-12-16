import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ApiError } from "./ApiError.util.js";

/**
 * Generates TipTap-formatted blog content using LangChain and OpenAI
 * @param {string} title - Blog title
 * @param {string} excerpt - Blog excerpt
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} TipTap-formatted JSON content
 */
export const generateTipTapContent = async (title, excerpt, apiKey) => {
  if (!apiKey) {
    throw new ApiError(500, "OpenAI API key not configured");
  }

  // Initialize LangChain ChatOpenAI model with response_format
  // Use clientOptions to pass response_format
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 4000,
    apiKey: apiKey,
    clientOptions: {
      response_format: { type: "json_object" },
    },
  });

  const systemMessage = `You are an expert blog content writer. Generate a well-structured, engaging blog post of approximately 1000 words based on the provided title and excerpt.

CRITICAL: You MUST return a valid JSON object in TipTap editor format. The JSON object must have this exact structure (this is the root object, not nested):

{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1, "textAlign": null },
      "content": [{ "type": "text", "text": "Main Heading" }]
    },
    {
      "type": "paragraph",
      "attrs": { "textAlign": null },
      "content": [{ "type": "text", "text": "Paragraph text here." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2, "textAlign": null },
      "content": [{ "type": "text", "text": "Subheading" }]
    },
    {
      "type": "paragraph",
      "attrs": { "textAlign": null },
      "content": [
        { "type": "text", "text": "Normal text and " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "bold text" },
        { "type": "text", "text": " and " },
        { "type": "text", "marks": [{ "type": "italic" }], "text": "italic text" },
        { "type": "text", "text": "." }
      ]
    },
    {
      "type": "horizontalRule"
    }
  ]
}

Requirements:
1. Start with an H1 heading using the provided title
2. Use H2 and H3 headings to structure sections (level 2-3)
3. Use paragraphs for body text with attrs: { "textAlign": null }
4. Include horizontalRule nodes to separate major sections (at least 2-3 in the content)
5. Use bold marks: { "type": "text", "marks": [{ "type": "bold" }], "text": "text" }
6. Use italic marks: { "type": "text", "marks": [{ "type": "italic" }], "text": "text" }
7. Create approximately 1000 words of engaging, informative content
8. Make content relevant to the title and excerpt
9. Structure logically with clear sections
10. Return ONLY the JSON object, no markdown, no code blocks, no explanations

Content structure should be:
- H1: Main title (the provided title)
- Paragraph: Engaging introduction
- H2: First major section
- Multiple paragraphs: Detailed content
- Horizontal rule
- H2: Second major section
- Multiple paragraphs: Detailed content
- Horizontal rule
- H2: Third major section
- Multiple paragraphs: Detailed content
- H2: Conclusion section
- Paragraph: Summary/conclusion`;

  const userMessage = `Generate a blog post with the following details:
Title: ${title}
Excerpt: ${excerpt}

Create a comprehensive, well-structured blog post of approximately 1000 words. 

Return the content as a JSON object with this exact structure (this should be the root JSON object):
{"type":"doc","content":[...]}

Do not wrap it in any other property. The root object must be the TipTap document structure.`;

  try {
    // Create LangChain messages
    const messages = [
      new SystemMessage(systemMessage),
      new HumanMessage(userMessage),
    ];

    // Invoke the model using LangChain with JSON response format
    const response = await model.invoke(messages);

    console.log("🤖 [OpenAI] Response received:", {
      hasResponse: !!response,
      responseType: typeof response,
      hasContent: !!response.content,
      contentType: typeof response.content,
      contentLength: response.content?.length || 0,
      contentPreview: response.content?.substring(0, 200) || "empty",
    });

    const responseContent = response.content;
    if (!responseContent) {
      throw new ApiError(500, "Failed to generate content from OpenAI");
    }

    // Parse the JSON response
    let content;
    try {
      // Try parsing directly
      // responseContent might already be an object if LangChain parsed it
      if (typeof responseContent === "string") {
        content = JSON.parse(responseContent);
      } else if (typeof responseContent === "object") {
        content = responseContent;
      } else {
        throw new ApiError(500, "Unexpected response format from OpenAI");
      }

      console.log("📦 [OpenAI] Parsed content:", {
        hasContent: !!content,
        contentType: typeof content,
        contentKeys: content ? Object.keys(content) : [],
        hasType: !!content?.type,
        typeValue: content?.type,
        hasContentArray: !!content?.content,
        contentArrayLength: content?.content?.length || 0,
      });

      // Handle case where OpenAI wraps response in a property (when using json_object mode)
      // Check if the response has a 'content' property that is the actual TipTap content
      if (content.content && content.content.type === "doc") {
        content = content.content;
      }
      // If response has 'tiptap' or 'blog' property
      if (content.tiptap && content.tiptap.type === "doc") {
        content = content.tiptap;
      }
      if (content.blog && content.blog.type === "doc") {
        content = content.blog;
      }
    } catch (parseError) {
      // If response is not valid JSON, try to extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          content = JSON.parse(jsonMatch[0]);
          // Check if wrapped
          if (content.content && content.content.type === "doc") {
            content = content.content;
          }
        } catch (e) {
          console.error("JSON Parse Error:", e);
          throw new ApiError(500, "Invalid JSON response from OpenAI");
        }
      } else {
        throw new ApiError(500, "Invalid JSON response from OpenAI");
      }
    }

    // Validate the structure
    if (!content || typeof content !== "object") {
      throw new ApiError(500, "Invalid response format from OpenAI");
    }

    if (!content.type || content.type !== "doc") {
      throw new ApiError(500, "Invalid TipTap format: missing 'doc' type");
    }

    if (!content.content || !Array.isArray(content.content)) {
      throw new ApiError(
        500,
        "Invalid TipTap format: missing or invalid 'content' array"
      );
    }

    return content;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("OpenAI API Error:", error);
    throw new ApiError(
      500,
      `Failed to generate blog content: ${error.message || "Unknown error"}`
    );
  }
};
