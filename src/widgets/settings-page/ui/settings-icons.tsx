import {
	Sun,
	TrendingUp,
	FileText,
	Bell,
	Keyboard,
	Monitor,
	Database,
	Smartphone,
	Laptop,
} from 'lucide-react';
import type { SVGProps } from 'react';

export const AppearanceIcon = (props: SVGProps<SVGSVGElement>) => (
	<Sun className="size-[14px] shrink-0" {...(props as object)} />
);

export const LearningIcon = (props: SVGProps<SVGSVGElement>) => (
	<TrendingUp className="size-[14px] shrink-0" {...(props as object)} />
);

export const ReaderIcon = (props: SVGProps<SVGSVGElement>) => (
	<FileText className="size-[14px] shrink-0" {...(props as object)} />
);

export const NotificationsIcon = (props: SVGProps<SVGSVGElement>) => (
	<Bell className="size-[14px] shrink-0" {...(props as object)} />
);

export const ShortcutsIcon = (props: SVGProps<SVGSVGElement>) => (
	<Keyboard className="size-[14px] shrink-0" {...(props as object)} />
);

export const SessionsIcon = (props: SVGProps<SVGSVGElement>) => (
	<Monitor className="size-[14px] shrink-0" {...(props as object)} />
);

export const DataIcon = (props: SVGProps<SVGSVGElement>) => (
	<Database className="size-[14px] shrink-0" {...(props as object)} />
);

export const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
	<Smartphone className="size-[14px] shrink-0" {...(props as object)} />
);

export const LaptopIcon = (props: SVGProps<SVGSVGElement>) => (
	<Laptop className="size-[14px] shrink-0" {...(props as object)} />
);
