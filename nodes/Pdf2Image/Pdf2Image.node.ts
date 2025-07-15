import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	IBinaryData,
	BINARY_ENCODING,
	NodeConnectionType,
} from 'n8n-workflow';

import * as pdf from 'pdf-poppler';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Import our custom type definitions
import './pdf-poppler';

export class Pdf2Image implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDF to Image',
		name: 'pdf2Image',
		icon: 'file:pdf2image.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Convert PDF files to images',
		defaults: {
			name: 'PDF to Image',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Convert PDF to Images',
						value: 'convert',
					},
				],
				default: 'convert',
			},
			{
				displayName: 'PDF Binary Property',
				name: 'pdfBinaryProperty',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				default: 'data',
				required: true,
				placeholder: 'e.g., data',
				description: 'Name of the binary property that contains the PDF file',
			},
			{
				displayName: 'Output Format',
				name: 'format',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				options: [
					{
						name: 'PNG',
						value: 'png',
					},
					{
						name: 'JPEG',
						value: 'jpeg',
					},
				],
				default: 'png',
				description: 'Output image format',
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['convert'],
						format: ['jpeg'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 85,
				description: 'JPEG quality (1-100)',
			},
			{
				displayName: 'DPI',
				name: 'density',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				typeOptions: {
					minValue: 72,
					maxValue: 600,
				},
				default: 150,
				description: 'Output image DPI (dots per inch)',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				typeOptions: {
					minValue: 100,
				},
				default: '',
				placeholder: 'Leave empty for auto',
				description: 'Output image width in pixels. Leave empty for automatic sizing.',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				typeOptions: {
					minValue: 100,
				},
				default: '',
				placeholder: 'Leave empty for auto',
				description: 'Output image height in pixels. Leave empty for automatic sizing.',
			},
			{
				displayName: 'Convert All Pages',
				name: 'convertAllPages',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				default: true,
				description: 'Whether to convert all pages or specify a range',
			},
			{
				displayName: 'Page Range',
				name: 'pageRange',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['convert'],
						convertAllPages: [false],
					},
				},
				default: '1-5',
				placeholder: 'e.g., 1-5 or 1,3,5',
				description: 'Page range to convert (e.g., "1-5" for pages 1 to 5, or "1,3,5" for specific pages)',
			},
			{
				displayName: 'Output Binary Property Name',
				name: 'outputBinaryProperty',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				default: 'image',
				description: 'Name of the binary property to store the converted images',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'convert') {
					const pdfBinaryProperty = this.getNodeParameter('pdfBinaryProperty', i) as string;
					const format = this.getNodeParameter('format', i) as string;
					const quality = this.getNodeParameter('quality', i, 85) as number;
					const density = this.getNodeParameter('density', i, 150) as number;
					const width = this.getNodeParameter('width', i, '') as number;
					const height = this.getNodeParameter('height', i, '') as number;
					const convertAllPages = this.getNodeParameter('convertAllPages', i) as boolean;
					const pageRange = this.getNodeParameter('pageRange', i, '') as string;
					const outputBinaryProperty = this.getNodeParameter('outputBinaryProperty', i) as string;

					const binaryData = this.helpers.assertBinaryData(i, pdfBinaryProperty);
					
					// Create temporary directory for processing
					const tempDir = join(tmpdir(), `n8n-pdf2image-${Date.now()}`);
					await fs.mkdir(tempDir, { recursive: true });
					
					// Write PDF to temporary file
					const pdfPath = join(tempDir, 'input.pdf');
					const pdfBuffer = await this.helpers.getBinaryDataBuffer(i, pdfBinaryProperty);
					await fs.writeFile(pdfPath, pdfBuffer);

					try {
						// Configure pdf-poppler options
						const options: any = {
							format: format === 'png' ? 'png' : 'jpeg',
							out_dir: tempDir,
							out_prefix: 'page',
							page: null // Will be set later for specific pages
						};

						// Set DPI (density)
						if (density && density !== 150) {
							options.pdf_flags = [`-r ${density}`];
						}

						// Set size if specified
						if (width && height) {
							options.size = { width, height };
						} else if (width) {
							options.size = { width };
						} else if (height) {
							options.size = { height };
						}

						let convertResult: string[] = [];
						
						if (convertAllPages) {
							// Convert all pages using pdf-poppler
							convertResult = await pdf.convert(pdfPath, options);
						} else {
							// Parse page range and convert specific pages
							const pages = Pdf2Image.parsePageRange(pageRange);
							
							for (const page of pages) {
								const pageOptions = { 
									...options, 
									first_page: page,
									last_page: page
								};
								const pageResult = await pdf.convert(pdfPath, pageOptions);
								convertResult.push(...pageResult);
							}
						}

						// Process the converted images
						for (let pageIndex = 0; pageIndex < convertResult.length; pageIndex++) {
							const imagePath = convertResult[pageIndex];
							
							const imageBuffer = await fs.readFile(imagePath);
							const fileName = `page_${pageIndex + 1}.${format}`;
							
							const binaryData: IBinaryData = {
								data: imageBuffer.toString(BINARY_ENCODING),
								mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
								fileName,
								fileExtension: format,
							};

							const newItem: INodeExecutionData = {
								json: {
									...items[i].json,
									pageNumber: pageIndex + 1,
									totalPages: convertResult.length,
									fileName,
								},
								binary: {
									[outputBinaryProperty]: binaryData,
								},
							};

							returnData.push(newItem);
						}

					} finally {
						// Clean up temporary files
						try {
							await fs.rm(tempDir, { recursive: true, force: true });
						} catch (error) {
							// Ignore cleanup errors
						}
					}

				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: items[i].json,
						error: error instanceof Error ? new NodeOperationError(this.getNode(), error) : new NodeOperationError(this.getNode(), String(error)),
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	private static parsePageRange(pageRange: string): number[] {
		const pages: number[] = [];
		const parts = pageRange.split(',');

		for (const part of parts) {
			const trimmed = part.trim();
			
			if (trimmed.includes('-')) {
				// Range like "1-5"
				const [start, end] = trimmed.split('-').map(num => parseInt(num.trim(), 10));
				if (isNaN(start) || isNaN(end) || start > end) {
					throw new Error(`Invalid page range: ${trimmed}`);
				}
				for (let i = start; i <= end; i++) {
					pages.push(i);
				}
			} else {
				// Single page like "3"
				const page = parseInt(trimmed, 10);
				if (isNaN(page)) {
					throw new Error(`Invalid page number: ${trimmed}`);
				}
				pages.push(page);
			}
		}

		return [...new Set(pages)].sort((a, b) => a - b); // Remove duplicates and sort
	}
}
