import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Button } from "@mui/material";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  documentUrl: string;
  fileName: string;
  open: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentUrl,
  fileName,
  open,
  onClose,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prevPage) =>
      numPages ? Math.min(prevPage + 1, numPages) : prevPage
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{fileName}</DialogTitle>
      <DialogContent dividers>
        <div className="flex justify-center">
          <Document
            file={documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center"
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
        {numPages && (
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePrevPage}
              disabled={pageNumber <= 1}
              variant="outlined"
            >
              Previous
            </Button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <Button
              onClick={handleNextPage}
            //  disabled={numPages && pageNumber >= numPages}
              variant="outlined"
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewer;


