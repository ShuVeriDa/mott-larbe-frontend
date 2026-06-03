"use client";

// ssr:false must live in a Client Component — Server Components forbid it.
// TipTap/ProseMirror manipulates the DOM directly; SSR produces a mismatch.
import dynamic from "next/dynamic";
import type { UseUserTextEditorProps } from "../model/use-user-text-editor";

// Loading skeleton that matches the editor layout to prevent layout shift
const EditorSkeleton = () => (
	<div className="flex h-full flex-col overflow-hidden">
		<div className="h-[49px] shrink-0 animate-pulse border-b border-bd-1 bg-surf-2" />
		<div className="flex flex-1 overflow-hidden">
			<div className="w-[280px] shrink-0 border-r border-bd-1 bg-surf p-4">
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="h-8 animate-pulse rounded bg-surf-3" />
					))}
				</div>
			</div>
			<div className="flex-1 bg-surf" />
		</div>
	</div>
);

const UserTextEditorFormLazy = dynamic(
	() => import("./user-text-editor-form").then((m) => m.UserTextEditorForm),
	{ ssr: false, loading: () => <EditorSkeleton /> },
);

export const UserTextEditorFormClient = (props: UseUserTextEditorProps) => (
	<UserTextEditorFormLazy {...props} />
);
