"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RichTextEditor from "./create/RichTextEditor";
import { Descendant } from "slate";
interface Props {
  title: "Edit Description" | "Edit SEO Description";
  open: boolean;
  onClose: () => void;
  onSave: (value: any) => void;
}
const DescriptionModal = ({ title, open, onClose, onSave }: Props) => {
  const [editorValue, setEditorValue] = useState<Descendant[]>([]);

  useEffect(() => {
    if (open) {
      // You can set initial value for editor when modal opens
      const initialContent: Descendant[] = [
        {
          type: "paragraph",
          children: [
            {
              text: "Your initial content goes here...",
              bold: false,
              italic: false,
              underline: false,
              code: false,
            },
          ],
        },
      ];
      setEditorValue(initialContent);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl  sm:max-w-4xl lg:max-w-5xl z-[100]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Render the RichTextEditor */}
        <div className="mt-4 mb-4 container overflow-auto">
          <RichTextEditor
            initialValue={editorValue}
            onChange={setEditorValue}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editorValue)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionModal;
