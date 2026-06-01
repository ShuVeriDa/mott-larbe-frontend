import { SITE_URL } from "@/shared/lib/seo";

interface PhrasebookJsonLdProps {
	lang: string;
	title: string;
	description: string;
}

const PhrasebookJsonLd = ({ lang, title, description }: PhrasebookJsonLdProps) => {
	const pageUrl = `${SITE_URL}/${lang}/phrasebook`;
	const homeUrl = `${SITE_URL}/${lang}`;

	const schema = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "CollectionPage",
				"@id": pageUrl,
				url: pageUrl,
				name: title,
				description,
				inLanguage: lang,
				isPartOf: { "@id": homeUrl },
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Mott Larbe", item: homeUrl },
					{ "@type": "ListItem", position: 2, name: title, item: pageUrl },
				],
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
		/>
	);
};

export default PhrasebookJsonLd;
