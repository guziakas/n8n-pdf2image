declare module 'pdf-poppler' {
	interface PoplerOptions {
		format?: 'png' | 'jpeg' | 'pdf';
		out_dir?: string;
		out_prefix?: string;
		first_page?: number;
		last_page?: number;
		size?: { width?: number; height?: number } | string;
		pdf_flags?: string[];
	}

	export function convert(file: string, options: PoplerOptions): Promise<string[]>;
}
