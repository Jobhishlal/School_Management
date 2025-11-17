
export interface IDownloadInvoicePDF {
  execute(invoiceUrl: string): Promise<Buffer>;
}