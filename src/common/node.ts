import { Token } from "./token";

export interface Node {
  nodeKind: NodeKind;
  value: Token;
}

export enum NodeKind {
  Program = 'Program',
  Atom = 'Atom',
  List = 'List',
};

export function createNode(nodeKind: NodeKind, value: any): Node {
  return {
    nodeKind,
    value,
  };
}
