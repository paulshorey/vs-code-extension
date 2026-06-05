import JSZip from "jszip";
import { parseJsonTextRecursive } from "./json";

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function extractSfdtPayload(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("No SFDT content provided.");
  }

  const parsed = parseJsonTextRecursive(trimmed);
  if (isJsonObject(parsed)) {
    if (typeof parsed.sfdt === "string" && parsed.sfdt.trim()) {
      return parsed.sfdt.trim();
    }
    throw new Error('Could not find a non-empty "sfdt" string in the JSON payload.');
  }

  if (typeof parsed === "string" && parsed.trim()) {
    return parsed.trim();
  }

  if (parsed !== undefined) {
    throw new Error("SFDT payload must be a JSON object, JSON string, or base64 string.");
  }

  return trimmed;
}

async function readSfdtArchive(base64Payload: string): Promise<string> {
  const zipBuffer = Buffer.from(base64Payload, "base64");
  const zip = await JSZip.loadAsync(zipBuffer);
  const files = Object.values(zip.files).filter((file) => !file.dir);

  if (files.length === 0) {
    throw new Error("SFDT zip archive contains no files.");
  }

  const sfdtFile = files.find((file) => file.name === "sfdt" || file.name.endsWith("/sfdt")) ?? files[0];
  return sfdtFile.async("string");
}

export async function decodeSfdtToObject(text: string): Promise<unknown> {
  const base64Payload = extractSfdtPayload(text);
  const content = await readSfdtArchive(base64Payload);
  const parsed = parseJsonTextRecursive(content);

  if (parsed === undefined) {
    throw new Error("Decoded SFDT content is not valid JSON.");
  }

  return parsed;
}

export async function decodeSfdtToFormattedJson(text: string): Promise<string> {
  const decoded = await decodeSfdtToObject(text);
  return JSON.stringify(decoded, null, 2);
}

async function writeSfdtArchive(sfdtContent: string): Promise<string> {
  const zip = new JSZip();
  zip.file("sfdt", sfdtContent);
  return zip.generateAsync({
    type: "base64",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}

export async function encodeObjectToSfdt(value: unknown): Promise<string> {
  const sfdtContent = JSON.stringify(value);
  return writeSfdtArchive(sfdtContent);
}

export async function encodeJsonToSfdt(text: string): Promise<string> {
  const parsed = parseJsonTextRecursive(text);

  if (parsed === undefined) {
    throw new Error("Selected text is not valid JSON.");
  }

  return encodeObjectToSfdt(parsed);
}
