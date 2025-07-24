import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  createEditor,
  Descendant,
  BaseEditor,
  Element as SlateElement,
  Transforms,
  Editor,
  Node,
} from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import isHotkey from "is-hotkey";

// Extend Slate types for TypeScript
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

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type RichTextModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue: string;
};

const HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export default function RichTextModal({
  title,
  open,
  onClose,
  onSave,
  initialValue,
}: RichTextModalProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>([]);
  const [textSize, setTextSize] = useState("normal"); // Text size state

  useEffect(() => {
    if (open) {
      if (initialValue) {
        try {
          const parsed = JSON.parse(initialValue);
          if (Array.isArray(parsed)) {
            setValue(parsed);
            return;
          }
        } catch {
          // fallback to plain text
        }
        setValue([{ type: "paragraph", children: [{ text: initialValue }] }]);
      } else {
        setValue([{ type: "paragraph", children: [{ text: "" }] }]);
      }
    }
  }, [initialValue, open]);

  const handleSave = () => {
    // Save as JSON string
    onSave(JSON.stringify(value));
    onClose();
  };

  // Rendering elements
  const renderElement = useCallback(({ attributes, children, element }) => {
    const textSizeClass = element.textSize ? `text-${element.textSize}` : "";
    switch (element.type) {
      case "heading-one":
        return (
          <h1 {...attributes} className={`text-2xl font-bold my-2 ${textSizeClass}`}>
            {children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...attributes} className={`text-xl font-semibold my-2 ${textSizeClass}`}>
            {children}
          </h2>
        );
      case "block-quote":
        return (
          <blockquote
            {...attributes}
            className="border-l-4 pl-4 italic text-gray-600 my-2"
          >
            {children}
          </blockquote>
        );
      case "numbered-list":
        return <ol {...attributes} className="list-decimal list-inside my-2">{children}</ol>;
      case "bulleted-list":
        return <ul {...attributes} className="list-disc list-inside my-2">{children}</ul>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      default:
        return <p {...attributes} className={`my-2 ${textSizeClass}`}>{children}</p>;
    }
  }, []);

  // Rendering leaf (text with marks)
  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    if (leaf.code) {
      children = (
        <code className="bg-gray-200 rounded px-1 py-[2px] font-mono text-sm">
          {children}
        </code>
      );
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  // Mark helpers
  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
  };

  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  // Block helpers
  const LIST_TYPES = ["numbered-list", "bulleted-list"];
  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: n =>
        LIST_TYPES.includes(
          (!Editor.isEditor(n) && SlateElement.isElement(n) && n.type) as string
        ),
      split: true,
    });

    let newType: string = isActive ? "paragraph" : isList ? "list-item" : format;

    Transforms.setNodes(editor, { type: newType });

    if (!isActive && isList) {
      Transforms.wrapNodes(editor, { type: format, children: [] });
    }
  };

  const isBlockActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: n => SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  // Change text size
  const changeTextSize = (size: string) => {
    setTextSize(size);
    Transforms.setNodes(editor, { textSize: size });
  };

  // Hotkeys
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(mark);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
          {/* Marks */}
          <Button
            variant={isMarkActive("bold") ? "default" : "outline"}
            onClick={() => toggleMark("bold")}
            title="Bold (Cmd + B)"
          >
            <span className="material-icons">format_bold</span>
          </Button>
          <Button
            variant={isMarkActive("italic") ? "default" : "outline"}
            onClick={() => toggleMark("italic")}
            title="Italic (Cmd + I)"
          >
            <span className="material-icons">format_italic</span>
          </Button>
          <Button
            variant={isMarkActive("underline") ? "default" : "outline"}
            onClick={() => toggleMark("underline")}
            title="Underline (Cmd + U)"
          >
            <span className="material-icons">format_underlined</span>
          </Button>
          <Button
            variant={isMarkActive("code") ? "default" : "outline"}
            onClick={() => toggleMark("code")}
            title="Code (Cmd + `)"
          >
            <span className="material-icons">code</span>
          </Button>

          {/* Blocks */}
          <Button
            variant={isBlockActive("heading-one") ? "default" : "outline"}
            onClick={() => toggleBlock("heading-one")}
            title="Heading 1"
          >
            H1
          </Button>
          <Button
            variant={isBlockActive("heading-two") ? "default" : "outline"}
            onClick={() => toggleBlock("heading-two")}
            title="Heading 2"
          >
            H2
          </Button>
          <Button
            variant={isBlockActive("block-quote") ? "default" : "outline"}
            onClick={() => toggleBlock("block-quote")}
            title="Block Quote"
          >
            <span className="material-icons">format_quote</span>
          </Button>
          <Button
            variant={isBlockActive("numbered-list") ? "default" : "outline"}
            onClick={() => toggleBlock("numbered-list")}
            title="Numbered List"
          >
            <span className="material-icons">format_list_numbered</span>
          </Button>
          <Button
            variant={isBlockActive("bulleted-list") ? "default" : "outline"}
            onClick={() => toggleBlock("bulleted-list")}
            title="Bulleted List"
          >
            <span className="material-icons">format_list_bulleted</span>
          </Button>

          {/* Text Size */}
          <div className="flex items-center">
            <select
              value={textSize}
              onChange={(e) => changeTextSize(e.target.value)}
              className="bg-transparent border border-gray-300 text-sm rounded px-2 py-1"
            >
              <option value="normal">Normal</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
        </div>

        {/* Editable area */}
        <div className="min-h-[300px] border rounded p-4 bg-white text-black overflow-auto max-h-[60vh]">
          <Slate editor={editor} initialValue={value} onChange={newValue => setValue(newValue)}>
            <Editable
              placeholder="Enter some rich text..."
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              spellCheck
              autoFocus
              onKeyDown={onKeyDown}
            />
          </Slate>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
