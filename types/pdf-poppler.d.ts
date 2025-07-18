declare module 'pdf-poppler' {
  export interface ConvertOptions {
    format?: 'jpeg' | 'png';
    out_dir?: string;
    out_prefix?: string;
    page?: number | null;
    quality?: number;
    size?: string;
  }

  export function convert(pdfPath: string, options: ConvertOptions): Promise<string[]>;
}
