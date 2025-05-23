import { nanoid } from 'nanoid';

export default class RouteConfig {
  destination: string;
  favicon: string;
  key: string;
  name: string;
  path: string;
  shareLink: string;

  constructor({ destination, favicon, name, path, shareLink }) {
    this.destination = destination;
    this.favicon = favicon;
    this.key = nanoid();
    this.name = name;
    this.path = path;
    this.shareLink = shareLink;

    // Verify required values are provided to avoid sneaky runtime errors.

    const missingValues: string[] = [];
    if (!this.destination) missingValues.push('destination');
    if (!this.favicon) missingValues.push('favicon');
    if (!this.key) missingValues.push('key');
    if (!this.name) missingValues.push('name');
    if (!this.path) missingValues.push('path');
    if (!this.shareLink) missingValues.push('shareLink');

    if (!missingValues.length) return;
    throw new Error(`Expected value but received undefined or empty string. ['${missingValues.join("', '")}']`);
  }
}
