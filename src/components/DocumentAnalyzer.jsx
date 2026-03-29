import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  IndianRupee,
  TrendingUp,
  Shield,
  Receipt,
  Download,
  FileSpreadsheet,
  Image as ImageIcon,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Tesseract from 'tesseract.js';

const SUPPORTED_TYPES = {
  'application/pdf': { icon: FileText, color: '#ef4444', label: 'PDF' },
  'image/jpeg': { icon: ImageIcon, color: '#f59e0b', label: 'JPEG' },
  'image/png': { icon: ImageIcon, color: '#f59e0b', label: 'PNG' },
  'image/jpg': { icon: ImageIcon, color: '#f59e0b', label: 'JPG' }
};

// Document parsing patterns for different types
const PATTERNS = {
  salarySlip: {
    employer: /(?:Employer|Company|Organization)[\s:]*([A-Za-z0-9\s&.,]+(?:Pvt\.?\s*Ltd\.?|Limited|Inc\.?|Corp\.?)?)/i,
    employeeName: /(?:Employee\s*Name|Name)[\s:]*([A-Za-z\s.]+)/i,
    employeeId: /(?:Employee\s*(?:ID|Code)|Emp\s*(?:ID|#))[\s:]*([A-Za-z0-9-]+)/i,
    basicSalary: /(?:Basic\s*(?:Salary|Pay)|Basic)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    hra: /(?:HRA|House\s*Rent\s*Allowance)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    specialAllowance: /(?:Special\s*Allowance)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    pfContribution: /(?:PF\s*Contribution|Provident\s*Fund)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    professionalTax: /(?:Professional\s*Tax)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    tds: /(?:TDS|Tax\s*Deducted)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    netSalary: /(?:Net\s*(?:Salary|Pay)|Take\s*Home)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    month: /(?:Month|Period|For\s*the\s*month\s*of)[\s:]*([A-Za-z]+\s+\d{4})/i
  },
  form16: {
    pan: /(?:PAN|Permanent\s*Account\s*Number)[\s:]*([A-Z]{5}\d{4}[A-Z])/i,
    tan: /(?:TAN)[\s:]*([A-Z]{4}\d{5}[A-Z])/i,
    assessmentYear: /(?:Assessment\s*Year|A\.?Y\.?)[\s:]*(\d{4}-\d{2,4})/i,
    grossSalary: /(?:Gross\s*(?:Salary|Income)|Total\s*Income)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    exemptions: /(?:Exemptions|Allowances)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    deductions80C: /(?:80C|Section\s*80C)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    deductions80D: /(?:80D|Health\s*Insurance)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    taxableIncome: /(?:Taxable\s*Income|Income\s*Chargeable)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    tdsDeducted: /(?:TDS\s*Deducted|Tax\s*Deducted)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i
  },
  bankStatement: {
    bank: /(?:Bank\s*Name|Bank)[\s:]*([A-Za-z\s]+Bank)/i,
    accountNumber: /(?:Account\s*(?:Number|#)|A\/C\s*No)[\s:.]*([\d*]+(?:\d{4}))/i,
    period: /(?:Period|Statement\s*Period)[\s:]*([A-Za-z]+\s+\d{4}\s*-\s*[A-Za-z]+\s+\d{4})/i,
    openingBalance: /(?:Opening\s*Balance)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    closingBalance: /(?:Closing\s*Balance)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    totalCredits: /(?:Total\s*Credits|Deposits)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    totalDebits: /(?:Total\s*Debits|Withdrawals)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i
  },
  insurance: {
    insurer: /(?:Insurer|Insurance\s*Company)[\s:]*([A-Za-z\s]+(?:Insurance|Life|General))/i,
    policyNumber: /(?:Policy\s*(?:Number|#)|Policy\s*No)[\s:.]*([\d/\-]+)/i,
    policyType: /(?:Policy\s*Type|Plan\s*Name)[\s:]*([A-Za-z\s]+)/i,
    sumAssured: /(?:Sum\s*Assured|Coverage)[\s:]*[₹$]?\s*([\d,]+(?:,\d{3})*(?:\.\d{2})?)/i,
    premiumAmount: /(?:Premium\s*Amount|Premium)[\s:]*[₹$]?\s*([\d,]+(?:\.\d{2})?)/i,
    premiumFrequency: /(?:Frequency|Mode)[\s:]*(Yearly|Monthly|Quarterly|Half-Yearly)/i,
    policyTerm: /(?:Policy\s*Term|Duration)[\s:]*(\d+\s*years?)/i,
    taxBenefit: /(?:Tax\s*Benefit|80C|Section)[\s:]*([₹$]?\s*[\d,]+)/i
  }
};

const MOCK_EXTRACTION_DATA = {
  salarySlip: {
    type: 'Salary Slip',
    fields: {
      employer: 'TechCorp India Pvt Ltd',
      employeeName: 'Rahul Sharma',
      employeeId: 'TC-2024-0156',
      month: 'February 2024',
      basicSalary: 85000,
      hra: 34000,
      specialAllowance: 15000,
      pfContribution: 10200,
      professionalTax: 200,
      tds: 8500,
      netSalary: 114300,
      annualCTC: 1680000
    }
  },
  form16: {
    type: 'Form 16',
    fields: {
      pan: 'ABCDE1234F',
      tan: 'BNZA12345G',
      assessmentYear: '2024-25',
      grossSalary: 1450000,
      exemptions: 180000,
      deductions80C: 150000,
      deductions80D: 25000,
      taxableIncome: 1095000,
      tdsDeducted: 125000
    }
  },
  bankStatement: {
    type: 'Bank Statement',
    fields: {
      bank: 'HDFC Bank',
      accountNumber: '****4521',
      period: 'Jan 2024 - Mar 2024',
      openingBalance: 125000,
      closingBalance: 185000,
      totalCredits: 425000,
      totalDebits: 365000,
      avgMonthlyBalance: 155000,
      emiDetected: ['Home Loan EMI: ₹45,000', 'Car Loan EMI: ₹12,000']
    }
  },
  insurance: {
    type: 'Insurance Policy',
    fields: {
      insurer: 'LIC of India',
      policyNumber: '123456789',
      policyType: 'Term Life Insurance',
      sumAssured: 10000000,
      premiumAmount: 18500,
      premiumFrequency: 'Yearly',
      policyTerm: '30 years',
      taxBenefit: '80C - ₹18,500/year'
    }
  }
};

const DocumentAnalyzer = () => {
  const { user, updateUserProfile } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    setError(null);
    const validFiles = newFiles.filter(file => {
      const isValidType = Object.keys(SUPPORTED_TYPES).includes(file.type) || 
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.jpeg') ||
        file.name.endsWith('.png');
      
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        setError(`Unsupported file type: ${file.name}. Please upload PDF, JPG, or PNG files.`);
      }
      if (!isValidSize) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
      }
      
      return isValidType && isValidSize;
    });

    const filesWithPreview = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      status: 'pending',
      type: file.type || 'application/pdf',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
    if (files.length === 1) {
      setExtractedData(null);
      setSelectedDocType(null);
      setPreviewFile(null);
    }
  };

  // Extract text from PDF using FileReader and basic parsing
  const extractPDFText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const text = await parsePDFText(arrayBuffer);
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Basic PDF text extraction
  const parsePDFText = async (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('utf-8');
    let text = '';
    
    const pdfString = textDecoder.decode(uint8Array);
    const textMatches = pdfString.match(/\(([^)]{10,500})\)/g) || [];
    text = textMatches.map(match => match.slice(1, -1)).join(' ');
    
    if (!text || text.length < 100) {
      const streamMatches = pdfString.match(/stream\s*([\s\S]*?)\s*endstream/g) || [];
      text = streamMatches.map(stream => {
        const cleanStream = stream.replace(/stream\s*/, '').replace(/\s*endstream/, '');
        return cleanStream.replace(/[^\x20-\x7E\s]/g, ' ');
      }).join(' ');
    }
    
    return text;
  };

  // Perform OCR on image using Tesseract.js
  const performOCR = async (file) => {
    setProcessingStatus('Performing OCR...');
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              setProcessingStatus(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );
      return result.data.text;
    } catch (err) {
      console.error('OCR Error:', err);
      throw new Error('Failed to perform OCR on image');
    }
  };

  // Detect document type from extracted text
  const detectDocumentType = (text) => {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('salary') && textLower.includes('basic') && textLower.includes('hra')) {
      return 'salarySlip';
    }
    if (textLower.includes('form 16') || (textLower.includes('tds') && textLower.includes('assessment year'))) {
      return 'form16';
    }
    if (textLower.includes('account statement') || (textLower.includes('opening balance') && textLower.includes('closing balance'))) {
      return 'bankStatement';
    }
    if (textLower.includes('insurance') && (textLower.includes('policy') || textLower.includes('premium'))) {
      return 'insurance';
    }
    
    return 'salarySlip';
  };

  // Parse document fields based on patterns
  const parseDocumentFields = (text, docType) => {
    const patterns = PATTERNS[docType];
    const fields = {};
    
    if (!patterns) return fields;
    
    for (const [field, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        let value = match[1].trim();
        
        if (['basicSalary', 'hra', 'specialAllowance', 'pfContribution', 'professionalTax', 'tds', 'netSalary', 'grossSalary', 'exemptions', 'deductions80C', 'deductions80D', 'taxableIncome', 'tdsDeducted', 'openingBalance', 'closingBalance', 'totalCredits', 'totalDebits', 'sumAssured', 'premiumAmount'].includes(field)) {
          const numValue = parseFloat(value.replace(/[₹$,\s]/g, ''));
          if (!isNaN(numValue)) {
            value = numValue;
          }
        }
        
        fields[field] = value;
      }
    }
    
    if (docType === 'salarySlip' && fields.basicSalary && !fields.netSalary) {
      const basic = parseFloat(fields.basicSalary) || 0;
      const hra = parseFloat(fields.hra) || 0;
      const special = parseFloat(fields.specialAllowance) || 0;
      const pf = parseFloat(fields.pfContribution) || 0;
      const pt = parseFloat(fields.professionalTax) || 0;
      const tds = parseFloat(fields.tds) || 0;
      fields.netSalary = basic + hra + special - pf - pt - tds;
    }
    
    if (docType === 'form16' && fields.grossSalary && fields.taxableIncome) {
      fields.exemptions = parseFloat(fields.grossSalary) - parseFloat(fields.taxableIncome);
    }
    
    return fields;
  };

  const analyzeDocument = async (fileId) => {
    setProcessing(true);
    setError(null);
    setProcessingStatus('Reading document...');
    
    const fileObj = files.find(f => f.id === fileId);
    if (!fileObj) {
      setError('File not found');
      setProcessing(false);
      return;
    }

    try {
      let extractedText = '';
      
      // Extract text based on file type
      if (fileObj.type === 'application/pdf' || fileObj.name.endsWith('.pdf')) {
        setProcessingStatus('Extracting text from PDF...');
        extractedText = await extractPDFText(fileObj.file);
      } else if (fileObj.type.startsWith('image/') || 
                 fileObj.name.endsWith('.jpg') || 
                 fileObj.name.endsWith('.jpeg') || 
                 fileObj.name.endsWith('.png')) {
        extractedText = await performOCR(fileObj.file);
      }
      
      if (!extractedText || extractedText.length < 50) {
        throw new Error('Could not extract sufficient text from document. Please ensure the document is clear and readable.');
      }
      
      // Detect document type
      setProcessingStatus('Identifying document type...');
      const docType = detectDocumentType(extractedText);
      
      // Parse fields
      setProcessingStatus('Extracting information...');
      const fields = parseDocumentFields(extractedText, docType);
      
      // Create result object
      const result = {
        type: docType === 'salarySlip' ? 'Salary Slip' : 
              docType === 'form16' ? 'Form 16' :
              docType === 'bankStatement' ? 'Bank Statement' :
              docType === 'insurance' ? 'Insurance Policy' : 'Document',
        fields: fields,
        rawText: extractedText.substring(0, 500) + '...',
        confidence: Object.keys(fields).length > 5 ? 'High' : Object.keys(fields).length > 2 ? 'Medium' : 'Low'
      };
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'analyzed', docType, extractedText } : f
      ));
      
      setExtractedData(result);
      setSelectedDocType(docType);
      
      // Auto-fill user profile if it's a salary slip
      if (docType === 'salarySlip' && fields.netSalary) {
        updateUserProfile({
          income: {
            salary: Math.round(parseFloat(fields.netSalary) / 12),
            ctc: fields.annualCTC || parseFloat(fields.netSalary) * 12
          }
        });
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze document');
    } finally {
      setProcessing(false);
      setProcessingStatus('');
    }
  };

  const applyToTaxPlanner = () => {
    if (!extractedData?.fields) return;
    
    const fields = extractedData.fields;
    const taxData = {};
    
    if (selectedDocType === 'salarySlip') {
      taxData.income = { 
        salary: Math.round(parseFloat(fields.netSalary) / 12),
        ctc: fields.annualCTC || parseFloat(fields.netSalary) * 12
      };
    } else if (selectedDocType === 'form16') {
      taxData.taxData = {
        section80C: { total: parseFloat(fields.deductions80C) || 0 },
        section80D: { total: parseFloat(fields.deductions80D) || 0 },
        tds: parseFloat(fields.tdsDeducted) || 0,
        taxableIncome: parseFloat(fields.taxableIncome) || 0
      };
    } else if (selectedDocType === 'insurance') {
      taxData.taxData = {
        section80C: { lic: parseFloat(fields.premiumAmount) || 0 }
      };
    }
    
    // Store in localStorage for Tax Planner to access
    localStorage.setItem('documentTaxData', JSON.stringify(taxData));
    
    // Show success message
    alert('Document data has been applied to Tax Planner! Navigate to Tax Planner to see the updates.');
  };

  const generateReport = () => {
    if (!extractedData) return;
    
    const report = {
      documentType: extractedData.type,
      extractedDate: new Date().toISOString(),
      confidence: extractedData.confidence,
      fields: extractedData.fields,
      recommendations: getAIRecommendations()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAIRecommendations = () => {
    const recs = [];
    
    if (selectedDocType === 'salarySlip') {
      const netSalary = parseFloat(extractedData.fields.netSalary) || 0;
      recs.push(`Based on your monthly net salary of ₹${netSalary.toLocaleString()}, consider investing 20% (₹${Math.round(netSalary * 0.2).toLocaleString()}) in diversified mutual funds.`);
      
      const deductions80C = parseFloat(extractedData.fields.deductions80C) || 0;
      if (deductions80C < 150000) {
        recs.push(`Your 80C deductions are ₹${deductions80C.toLocaleString()}. You can save additional ₹${(150000 - deductions80C).toLocaleString()} by investing in ELSS or PPF.`);
      }
    }
    
    if (selectedDocType === 'form16') {
      const taxableIncome = parseFloat(extractedData.fields.taxableIncome) || 0;
      const tdsDeducted = parseFloat(extractedData.fields.tdsDeducted) || 0;
      recs.push(`Your taxable income is ₹${taxableIncome.toLocaleString()}. TDS deducted: ₹${tdsDeducted.toLocaleString()}.`);
      recs.push('Review your tax-saving investments before March 31st to optimize deductions.');
    }
    
    if (selectedDocType === 'bankStatement') {
      const avgBalance = parseFloat(extractedData.fields.avgMonthlyBalance) || 0;
      recs.push(`Your average monthly balance is ₹${avgBalance.toLocaleString()}. Maintain this to avoid minimum balance charges.`);
      recs.push('Consider creating an emergency fund with 6 months of expenses.');
    }
    
    if (selectedDocType === 'insurance') {
      const sumAssured = parseFloat(extractedData.fields.sumAssured) || 0;
      const premium = parseFloat(extractedData.fields.premiumAmount) || 0;
      recs.push(`Life cover of ₹${sumAssured.toLocaleString()} at ₹${premium.toLocaleString()} premium. Ensure cover is 10x your annual income.`);
    }
    
    return recs;
  };

  const viewPreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const reanalyze = () => {
    if (files.length > 0) {
      analyzeDocument(files[0].id);
    }
  };

  const formatFieldValue = (key, value) => {
    if (typeof value === 'number') {
      const isCurrency = ['basicSalary', 'hra', 'specialAllowance', 'pfContribution', 'professionalTax', 'tds', 'netSalary', 'grossSalary', 'exemptions', 'deductions80C', 'deductions80D', 'taxableIncome', 'tdsDeducted', 'openingBalance', 'closingBalance', 'totalCredits', 'totalDebits', 'sumAssured', 'premiumAmount', 'annualCTC'].includes(key);
      
      if (isCurrency) {
        return `₹${value.toLocaleString('en-IN')}`;
      }
      return value.toLocaleString('en-IN');
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value;
  };

  const formatFieldLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          AI <span style={{ color: 'var(--accent)' }}>Document Analyzer</span>
        </h2>
        <p style={{ color: 'var(--text-dim)' }}>
          Upload salary slips, Form 16, bank statements, or insurance policies. 
          Our AI extracts key data and auto-fills your tax planner.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '1rem',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <AlertTriangle size={20} color="#ef4444" />
          <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</span>
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} color="#ef4444" />
          </button>
        </div>
      )}

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
        {/* Upload Section */}
        <div>
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `3px dashed ${isDragging ? 'var(--accent)' : 'var(--glass-border)'}`,
              borderRadius: '1.5rem',
              padding: '3rem',
              textAlign: 'center',
              background: isDragging ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
              transition: 'all 0.3s ease',
              marginBottom: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              multiple
            />
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--glass)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Upload size={32} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Drop your documents here
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.csv"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <button className="btn-primary" style={{ cursor: 'pointer' }}>
                <Sparkles size={18} style={{ marginRight: '0.5rem' }} />
                Select Files
              </button>
            </label>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '1rem' }}>
              Supported: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>

          {/* Processing Status */}
          {processing && (
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
              <Loader2 size={32} color="var(--accent)" className="animate-spin" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Processing Document...</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{processingStatus}</p>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'var(--glass-border)',
                borderRadius: '2px',
                marginTop: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: processingStatus.includes('Progress') ? processingStatus.match(/(\d+)%/)?.[1] + '%' : '50%',
                  height: '100%',
                  background: 'var(--accent)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Uploaded Documents ({files.length})
              </h3>
              {files.map((file) => {
                const typeInfo = SUPPORTED_TYPES[file.type] || SUPPORTED_TYPES['application/pdf'];
                const Icon = typeInfo.icon;
                
                return (
                  <div key={file.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--glass)',
                    borderRadius: '0.75rem',
                    marginBottom: '0.75rem',
                    border: file.status === 'analyzed' ? '1px solid var(--success)' : '1px solid var(--glass-border)'
                  }}>
                    <div style={{
                      background: `${typeInfo.color}20`,
                      padding: '0.75rem',
                      borderRadius: '0.5rem'
                    }}>
                      <Icon size={24} color={typeInfo.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{file.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {file.size} MB {file.status === 'analyzed' && '• Analyzed'}
                      </div>
                    </div>
                    {file.preview && (
                      <button
                        onClick={() => viewPreview(file)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                        title="View Preview"
                      >
                        <Eye size={18} color="var(--accent)" />
                      </button>
                    )}
                    {file.status === 'analyzed' ? (
                      <CheckCircle size={20} color="#10b981" />
                    ) : processing ? (
                      <Loader2 size={20} color="var(--accent)" className="animate-spin" />
                    ) : (
                      <button
                        onClick={() => analyzeDocument(file.id)}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        Analyze
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={18} color="var(--text-dim)" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {extractedData ? (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.75rem',
                    borderRadius: '0.75rem'
                  }}>
                    <CheckCircle2 size={24} color="#10b981" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                      {extractedData.type} Analyzed
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Confidence: {extractedData.confidence} • {Object.keys(extractedData.fields).length} fields extracted
                    </p>
                  </div>
                </div>
                <div style={{
                  background: 'var(--glass)',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.75rem'
                }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  AI Powered
                </div>
              </div>

              {/* Extracted Fields */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-dim)' }}>
                  Extracted Information
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {Object.entries(extractedData.fields).map(([key, value]) => (
                    <div key={key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--glass)',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        {formatFieldLabel(key)}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                        {formatFieldValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="var(--accent)" />
                  AI Recommendations
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ArrowRight size={14} color="var(--accent)" style={{ marginTop: '0.2rem' }} />
                    Consider investing remaining 80C limit in ELSS funds for tax + growth
                  </li>
                  <li style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ArrowRight size={14} color="var(--accent)" style={{ marginTop: '0.2rem' }} />
                    Your current tax saving is ₹{(extractedData.fields.deductions80C || 150000).toLocaleString()}/year
                  </li>
                  <li style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ArrowRight size={14} color="var(--accent)" style={{ marginTop: '0.2rem' }} />
                    Start NPS for additional ₹50,000 tax benefit under 80CCD(1B)
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={applyToTaxPlanner} className="btn-primary" style={{ flex: 1 }}>
                  <TrendingUp size={18} style={{ marginRight: '0.5rem' }} />
                  Apply to Tax Planner
                </button>
                <button onClick={generateReport} className="btn-secondary" style={{ flex: 1 }}>
                  <Download size={18} style={{ marginRight: '0.5rem' }} />
                  Export Report
                </button>
              </div>
              
              <button 
                onClick={reanalyze} 
                style={{ 
                  marginTop: '1rem',
                  width: '100%',
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                <RefreshCw size={16} />
                Re-analyze Document
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{ 
              padding: '3rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                background: 'var(--glass)',
                padding: '1.5rem',
                borderRadius: '1rem'
              }}>
                <FileText size={48} color="var(--text-dim)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--text-dim)' }}>
                No Document Analyzed Yet
              </h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '300px', fontSize: '0.9rem' }}>
                Upload a document to see AI-powered extraction and analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Supported Documents Info */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Supported Documents</h3>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { icon: Receipt, title: 'Salary Slips', desc: 'Extract income, deductions, TDS' },
            { icon: FileText, title: 'Form 16', desc: 'Annual tax summary' },
            { icon: IndianRupee, title: 'Bank Statements', desc: 'Track expenses, EMIs' },
            { icon: Shield, title: 'Insurance', desc: 'Policy details, premiums' }
          ].map((doc, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <doc.icon size={32} color="var(--accent)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem' }}>{doc.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }} onClick={closePreview}>
          <div style={{
            background: 'var(--primary)',
            padding: '1rem',
            borderRadius: '1rem',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '600' }}>{previewFile.name}</h3>
              <button onClick={closePreview} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--text-dim)" />
              </button>
            </div>
            {previewFile.preview && (
              <img 
                src={previewFile.preview} 
                alt="Document Preview" 
                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '0.5rem' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalyzer;
