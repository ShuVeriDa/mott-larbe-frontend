import { Select } from "@/shared/ui/select";
import type { SelectProps } from "@/shared/ui/select";

export const FieldSelect = (props: SelectProps) => (
	<Select variant="lg" className="bg-surf border" {...props} />
);
