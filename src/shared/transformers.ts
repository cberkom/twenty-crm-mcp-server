/**
 * Transformation utilities for converting between API inputs and GraphQL structures
 */

import {
  EmailsComposite,
  PhonesComposite,
  LinkComposite,
  AddressComposite,
  CurrencyComposite,
  BodyV2Composite,
} from "./types.js";

/**
 * Transform email string to EmailsComposite
 */
export function transformEmail(email: string): EmailsComposite {
  return {
    primaryEmail: email,
    additionalEmails: [],
  };
}

/**
 * Transform phone details to PhonesComposite
 */
export function transformPhone(
  phone: string,
  countryCode?: string,
  callingCode?: string
): PhonesComposite {
  return {
    primaryPhoneNumber: phone,
    primaryPhoneCountryCode: countryCode || "",
    primaryPhoneCallingCode: callingCode || "",
    additionalPhones: [],
  };
}

/**
 * Transform URL to LinkComposite
 */
export function transformLink(url: string, label?: string): LinkComposite {
  return {
    primaryLinkLabel: label || "",
    primaryLinkUrl: url,
    secondaryLinks: [],
  };
}

/**
 * Transform address fields to AddressComposite
 */
export function transformAddress(address: {
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
}): AddressComposite | undefined {
  // Only create address if at least one field is provided
  const hasAnyField = Object.values(address).some((value) => value !== undefined);

  if (!hasAnyField) {
    return undefined;
  }

  const result: AddressComposite = {};

  if (address.addressStreet1) result.addressStreet1 = address.addressStreet1;
  if (address.addressStreet2) result.addressStreet2 = address.addressStreet2;
  if (address.addressCity) result.addressCity = address.addressCity;
  if (address.addressPostcode) result.addressPostcode = address.addressPostcode;
  if (address.addressState) result.addressState = address.addressState;
  if (address.addressCountry) result.addressCountry = address.addressCountry;

  return result;
}

/**
 * Transform amount and currency to CurrencyComposite
 * Converts regular amount to micros (amount * 1,000,000)
 */
export function transformCurrency(
  amount: number,
  currencyCode: string = "USD"
): CurrencyComposite {
  return {
    amountMicros: amount * 1000000, // Convert to micros
    currencyCode,
  };
}

/**
 * Transform CurrencyComposite back to regular amount
 * Converts micros to regular amount (amountMicros / 1,000,000)
 */
export function currencyFromMicros(
  currency: CurrencyComposite
): { amount: number; currencyCode: string } {
  return {
    amount: currency.amountMicros / 1000000,
    currencyCode: currency.currencyCode,
  };
}

/**
 * Transform markdown text to BodyV2Composite
 * Creates both blocknote and markdown representations
 *
 * BlockNote format is a JSON array of blocks. Each block has:
 * - id: unique identifier
 * - type: block type (paragraph, heading, bulletListItem, etc.)
 * - props: block properties (textColor, backgroundColor, textAlignment, level for headings)
 * - content: array of inline content (text, links, etc.)
 * - children: nested blocks
 */
export function transformBodyV2(text: string): BodyV2Composite {
  const blocknoteBlocks = markdownToBlockNote(text);
  return {
    blocknote: JSON.stringify(blocknoteBlocks),
    markdown: text,
  };
}

/**
 * Generate a simple unique ID for BlockNote blocks
 */
function generateBlockId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Convert markdown text to BlockNote format
 * Supports: paragraphs, headings (h1-h3), bullet lists, numbered lists
 */
function markdownToBlockNote(markdown: string): object[] {
  const lines = markdown.split('\n');
  const blocks: object[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3;
      blocks.push({
        id: generateBlockId(),
        type: "heading",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
          level: level
        },
        content: parseInlineContent(headingMatch[2]),
        children: []
      });
      i++;
      continue;
    }

    // Bullet list items
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      blocks.push({
        id: generateBlockId(),
        type: "bulletListItem",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left"
        },
        content: parseInlineContent(bulletMatch[1]),
        children: []
      });
      i++;
      continue;
    }

    // Numbered list items
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      blocks.push({
        id: generateBlockId(),
        type: "numberedListItem",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left"
        },
        content: parseInlineContent(numberedMatch[1]),
        children: []
      });
      i++;
      continue;
    }

    // Default: paragraph
    blocks.push({
      id: generateBlockId(),
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left"
      },
      content: parseInlineContent(line),
      children: []
    });
    i++;
  }

  // If no blocks were created, add an empty paragraph
  if (blocks.length === 0) {
    blocks.push({
      id: generateBlockId(),
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left"
      },
      content: [],
      children: []
    });
  }

  return blocks;
}

/**
 * Parse inline content (bold, italic, links) from a text string
 */
function parseInlineContent(text: string): object[] {
  const content: object[] = [];

  // Simple regex to find bold (**text**), italic (*text* or _text_), and links [text](url)
  const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(_(.+?)_)|(\[(.+?)\]\((.+?)\))/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      if (plainText) {
        content.push({
          type: "text",
          text: plainText,
          styles: {}
        });
      }
    }

    if (match[1]) {
      // Bold: **text**
      content.push({
        type: "text",
        text: match[2],
        styles: { bold: true }
      });
    } else if (match[3]) {
      // Italic: *text*
      content.push({
        type: "text",
        text: match[4],
        styles: { italic: true }
      });
    } else if (match[5]) {
      // Italic: _text_
      content.push({
        type: "text",
        text: match[6],
        styles: { italic: true }
      });
    } else if (match[7]) {
      // Link: [text](url)
      content.push({
        type: "link",
        href: match[9],
        content: [{
          type: "text",
          text: match[8],
          styles: {}
        }]
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      content.push({
        type: "text",
        text: remaining,
        styles: {}
      });
    }
  }

  // If no content was parsed, treat entire text as plain
  if (content.length === 0 && text) {
    content.push({
      type: "text",
      text: text,
      styles: {}
    });
  }

  return content;
}
