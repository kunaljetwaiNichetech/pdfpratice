import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './App.css'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(fileUrl);
      setError(null); // Reset any previous errors
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error) {
    setError('Failed to load PDF file. Please try again.');
    console.error('PDF load error:', error);
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">Amtrudex</div>
        <div className="upload-section">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="file-input"
          />
        </div>
      </header>

      <main className="main-content">
        {pdfFile ? (
          <div className="pdf-container">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading="Loading PDF..."
            >
              <Page 
                pageNumber={currentPage}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={Math.min(window.innerWidth * 0.9, 1000)}
                loading="Loading page..."
              />
            </Document>
            {error && <div className="error-message">{error}</div>}
            
            <div className="navigation-controls">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="arrow-btn"
              >
                ←
              </button>
              
              {/* Pagination numbers */}
              <div className="pagination-numbers">
                {[...Array(numPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages || 1))}
                disabled={currentPage >= numPages}
                className="arrow-btn"
              >
                →
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-message">
            <p>Please upload a PDF file to view</p>
          </div>
        )}
      </main>

      <footer className="footer">
        {/* Footer is now empty */}
      </footer>
    </div>
  )
}

export default App
