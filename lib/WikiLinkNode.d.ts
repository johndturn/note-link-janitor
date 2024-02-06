import type { Node } from 'unist';

export interface WikiLinkNode extends Node {
  value: string;
  data: {
    alias: string;
    permalink: string;
  };
}
