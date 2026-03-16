"use client";

import { createContext, useContext } from "react";

type EditorContextValue = {
  isEditing: boolean;
  actorId: string | null;
};

const EditorContext = createContext<EditorContextValue>({ isEditing: false, actorId: null });

export function EditorProvider({
  children,
  isEditing,
  actorId,
}: {
  children: React.ReactNode;
  isEditing: boolean;
  actorId: string | null;
}) {
  return <EditorContext.Provider value={{ isEditing, actorId }}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
  return useContext(EditorContext);
}
