function tryUnescapeJsonString(text: string): string | null {
  try {
    const safe = text
      .replaceAll("\r\n", String.raw`\r\n`)
      .replaceAll("\n", String.raw`\n`)
      .replaceAll("\r", String.raw`\r`);
    const result = JSON.parse('"' + safe + '"');
    return typeof result === "string" ? result : null;
  } catch {
    return null;
  }
}

export function tryParseJsonText(text: string): unknown | undefined {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    if (trimmed.includes("\\")) {
      const unescaped = tryUnescapeJsonString(trimmed);
      if (unescaped !== null) {
        try {
          return JSON.parse(unescaped);
        } catch {}
      }
    }

    return undefined;
  }
}

export function parseJsonRecursive(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
      try {
        return parseJsonRecursive(JSON.parse(trimmed));
      } catch {
        if (trimmed.includes("\\")) {
          const unescaped = tryUnescapeJsonString(trimmed);
          if (unescaped !== null) {
            try {
              return parseJsonRecursive(JSON.parse(unescaped));
            } catch {}
          }
        }
        return value;
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => parseJsonRecursive(item));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = parseJsonRecursive(val);
    }
    return result;
  }

  return value;
}

export function parseJsonTextRecursive(text: string): unknown | undefined {
  const parsed = tryParseJsonText(text);
  if (parsed === undefined) {
    return undefined;
  }

  return parseJsonRecursive(parsed);
}
