import { BaseEditor, Descendant, BaseElement } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement =
  | { type: "paragraph"; children: CustomText[]; textSize?: string }
  | { type: "heading-one"; children: CustomText[]; textSize?: string }
  | { type: "heading-two"; children: CustomText[]; textSize?: string }
  | { type: "block-quote"; children: CustomText[] }
  | { type: "numbered-list"; children: CustomElement[] }
  | { type: "bulleted-list"; children: CustomElement[] }
  | { type: "list-item"; children: CustomText[] };

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const

type AlignType = (typeof TEXT_ALIGN_TYPES)[number]
type ListType = (typeof LIST_TYPES)[number]
type CustomElementFormat = CustomElement | AlignType | ListType

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}