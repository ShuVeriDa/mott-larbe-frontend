"use client";

import { ComponentProps } from 'react';
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { useAdminDictionaryDetailPage } from "../model/use-admin-dictionary-detail-page";
import { DictionaryEntryTopbar } from "./dictionary-entry-topbar";
import { EntryHeaderCard } from "./entry-header-card";
import { LemmasSensesCard } from "./lemmas-senses-card";
import { MorphFormsCard } from "./morph-forms-card";
import { ContextsCard } from "./contexts-card";
import { MetaSideCard } from "./meta-side-card";
import { FrequencySideCard } from "./frequency-side-card";
import { HeadwordsSideCard } from "./headwords-side-card";
import { UserStatsSideCard } from "./user-stats-side-card";
import { SenseModal } from "./sense-modal";
import { ExampleModal } from "./example-modal";
import { MorphFormModal } from "./morph-form-modal";
import { HeadwordModal } from "./headword-modal";
import { MetaModal } from "./meta-modal";
import { AddLemmaModal } from "./add-lemma-modal";

interface AdminDictionaryDetailPageProps {
	lemmaId: string;
}

export const AdminDictionaryDetailPage = ({ lemmaId }: AdminDictionaryDetailPageProps) => {
	const { lang } = useI18n();
	const router = useRouter();

	const {
		detail,
		nav,
		relatedLemmas,
		freqStats,
		userStats,
		contexts,
		mutations,
		modal,
		openModal,
		closeModal,
		showAllForms,
		toggleForms,
		entryId,
	} = useAdminDictionaryDetailPage(lemmaId);

	const handleDeleteEntry = async () => {
		if (!confirm("Удалить эту словарную статью?")) return;
		await mutations.deleteEntry.mutateAsync();
		router.push(`/${lang}/admin/dictionary`);
	};

	// Add lemma handler
	const handleAddLemma = (eid: string, body: import("@/entities/dictionary").AddAdminLemmaDto) => {
		mutations.addLemma.mutate({ entryId: eid, body }, { onSuccess: closeModal });
	};

	// Meta modal handler
	const handleSaveMeta = (body: import("@/entities/dictionary").PatchAdminEntryDto) => {
		mutations.updateEntry.mutate(body, { onSuccess: closeModal });
	};

	// Sense modal handlers
	const handleSaveSense = (data: { definition: string; notes: string }) => {
		if (modal?.type === "editSense") {
			mutations.updateSense.mutate(
				{ senseId: modal.sense.id, body: { definition: data.definition, notes: data.notes || undefined } },
				{ onSuccess: closeModal },
			);
		} else {
			mutations.addSense.mutate(
				{ definition: data.definition, notes: data.notes || undefined },
				{ onSuccess: closeModal },
			);
		}
	};

	// Example modal handlers
	const handleSaveExample = (data: { text: string; translation: string }) => {
		if (modal?.type === "editExample") {
			mutations.updateExample.mutate(
				{
					exampleId: modal.example.id,
					body: { text: data.text, translation: data.translation || undefined },
				},
				{ onSuccess: closeModal },
			);
		} else if (modal?.type === "addExample") {
			mutations.addExample.mutate(
				{ senseId: modal.senseId, body: { text: data.text, translation: data.translation || undefined } },
				{ onSuccess: closeModal },
			);
		}
	};

	// Form modal handlers
	const handleSaveForm = (data: {
		form: string;
		gramCase?: import("@/entities/dictionary").AdminDictGramCase;
		gramNumber?: import("@/entities/dictionary").AdminDictGramNumber;
	}) => {
		if (modal?.type === "editForm") {
			mutations.updateForm.mutate(
				{ formId: modal.form.id, body: data },
				{ onSuccess: closeModal },
			);
		} else {
			mutations.addForm.mutate(data, { onSuccess: closeModal });
		}
	};

	// Headword modal handlers
	const handleSaveHeadword = (data: { word: string; isPrimary: boolean }) => {
		mutations.addHeadword.mutate(data, { onSuccess: closeModal });
	};

		const handleDeleteSense: NonNullable<ComponentProps<typeof LemmasSensesCard>["onDeleteSense"]> = (senseId) => mutations.deleteSense.mutate(senseId);
	const handleDeleteExample: NonNullable<ComponentProps<typeof LemmasSensesCard>["onDeleteExample"]> = (exId) => mutations.deleteExample.mutate(exId);
	const handleDeleteForm: NonNullable<ComponentProps<typeof MorphFormsCard>["onDeleteForm"]> = (formId) => mutations.deleteForm.mutate(formId);
	const handleDeleteHeadword: NonNullable<ComponentProps<typeof HeadwordsSideCard>["onDeleteHeadword"]> = (hwId) => mutations.deleteHeadword.mutate(hwId);
return (
		<div className="flex min-h-0 flex-1 flex-col">
			<DictionaryEntryTopbar
				lang={lang}
				baseForm={detail.data?.baseForm ?? ""}
				lemmaId={lemmaId}
				next={nav.next}
				prev={nav.prev}
				onOpenModal={openModal}
				onDelete={handleDeleteEntry}
				isDeleting={mutations.deleteEntry.isPending}
			/>

			<div className="overflow-y-auto flex gap-[18px] px-[22px] py-[22px] pb-16 max-md:flex-col max-sm:px-3 max-sm:py-3">
				{/* Main column */}
				<div className="flex min-w-0 flex-1 flex-col gap-3.5">
					<EntryHeaderCard data={detail.data} isLoading={detail.isLoading} lemmasCount={relatedLemmas.data?.length} />

					<LemmasSensesCard
						data={detail.data}
						relatedLemmas={relatedLemmas.data}
						currentLemmaId={lemmaId}
						lang={lang}
						isLoading={detail.isLoading}
						onOpenModal={openModal}
						onDeleteSense={handleDeleteSense}
						onDeleteExample={handleDeleteExample}
					/>

					<MorphFormsCard
						forms={detail.data?.forms}
						isLoading={detail.isLoading}
						showAll={showAllForms}
						onToggleAll={toggleForms}
						onOpenModal={openModal}
						onDeleteForm={handleDeleteForm}
					/>

					<ContextsCard
						items={contexts.data?.items}
						total={contexts.data?.total ?? 0}
						lang={lang}
						isLoading={contexts.isLoading}
					/>
				</div>

				{/* Side column */}
				<div className="flex w-[248px] shrink-0 flex-col gap-3.5 max-md:w-full max-md:grid max-md:grid-cols-2 max-sm:flex max-sm:flex-col">
					<MetaSideCard
						data={detail.data}
						isLoading={detail.isLoading}
						onOpenModal={openModal}
					/>

					<FrequencySideCard
						data={freqStats.data}
						isLoading={freqStats.isLoading}
					/>

					<HeadwordsSideCard
						headwords={detail.data?.headwords}
						isLoading={detail.isLoading}
						onOpenModal={openModal}
						onDeleteHeadword={handleDeleteHeadword}
					/>

					<UserStatsSideCard
						data={userStats.data}
						isLoading={userStats.isLoading}
					/>
				</div>
			</div>

			{/* Modals */}
			<MetaModal
				isOpen={modal?.type === "editMeta"}
				data={detail.data}
				isPending={mutations.updateEntry.isPending}
				onClose={closeModal}
				onSave={handleSaveMeta}
			/>

			<AddLemmaModal
				isOpen={modal?.type === "addLemma"}
				entryId={entryId}
				isPending={mutations.addLemma.isPending}
				onClose={closeModal}
				onSave={handleAddLemma}
			/>

			<SenseModal
				isOpen={modal?.type === "addSense" || modal?.type === "editSense"}
				editSense={modal?.type === "editSense" ? modal.sense : null}
				isPending={mutations.addSense.isPending || mutations.updateSense.isPending}
				onClose={closeModal}
				onSave={handleSaveSense}
			/>

			<ExampleModal
				isOpen={modal?.type === "addExample" || modal?.type === "editExample"}
				editExample={modal?.type === "editExample" ? modal.example : null}
				isPending={mutations.addExample.isPending || mutations.updateExample.isPending}
				onClose={closeModal}
				onSave={handleSaveExample}
			/>

			<MorphFormModal
				isOpen={modal?.type === "addForm" || modal?.type === "editForm"}
				editForm={modal?.type === "editForm" ? modal.form : null}
				isPending={mutations.addForm.isPending || mutations.updateForm.isPending}
				onClose={closeModal}
				onSave={handleSaveForm}
			/>

			<HeadwordModal
				isOpen={modal?.type === "addHeadword"}
				isPending={mutations.addHeadword.isPending}
				onClose={closeModal}
				onSave={handleSaveHeadword}
			/>
		</div>
	);
};
