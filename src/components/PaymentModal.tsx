import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentComplete
}) => {
  const [paymentStep, setPaymentStep] = useState<'options' | 'qr' | 'processing' | 'success'>('options');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setPaymentStep('options');
      setSelectedMethod('upi');
    }
  }, [isOpen]);

  // Simulate payment processing
  const processPayment = () => {
    setPaymentStep('processing');
    
    // Simulate payment processing delay
    setTimeout(() => {
      setPaymentStep('success');
      
      // Close modal and notify parent after showing success
      setTimeout(() => {
        onPaymentComplete();
        onClose();
      }, 2000);
    }, 3000);
  };

  // QR code SVG component with animation
  const QRCodeAnimation = () => {
    return (
      <div className="relative w-64 h-64 mx-auto">
        <motion.svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* QR Code Background */}
          <rect width="256" height="256" fill="white" />
          
          {/* QR Code Pattern - Animated appearance */}
          <g>
            {/* Position detection patterns */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Top-left position detection pattern */}
              <rect x="16" y="16" width="48" height="48" fill="black" />
              <rect x="24" y="24" width="32" height="32" fill="white" />
              <rect x="32" y="32" width="16" height="16" fill="black" />
              
              {/* Top-right position detection pattern */}
              <rect x="192" y="16" width="48" height="48" fill="black" />
              <rect x="200" y="24" width="32" height="32" fill="white" />
              <rect x="208" y="32" width="16" height="16" fill="black" />
              
              {/* Bottom-left position detection pattern */}
              <rect x="16" y="192" width="48" height="48" fill="black" />
              <rect x="24" y="200" width="32" height="32" fill="white" />
              <rect x="32" y="208" width="16" height="16" fill="black" />
            </motion.g>
            
            {/* QR code data modules - appear in sequence */}
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <motion.g key={`row-${rowIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + (rowIndex * 0.05), duration: 0.2 }}
              >
                {Array.from({ length: 10 }).map((_, colIndex) => {
                  // Random pattern generation for demo
                  const shouldFill = Math.random() > 0.5;
                  if (!shouldFill) return null;
                  
                  // Avoid drawing over position detection patterns
                  const isPositionPattern = 
                    (rowIndex < 3 && colIndex < 3) || 
                    (rowIndex < 3 && colIndex > 6) || 
                    (rowIndex > 6 && colIndex < 3);
                    
                  if (isPositionPattern) return null;
                  
                  return (
                    <rect 
                      key={`module-${rowIndex}-${colIndex}`}
                      x={80 + colIndex * 10} 
                      y={80 + rowIndex * 10} 
                      width="8" 
                      height="8" 
                      fill="black" 
                    />
                  );
                })}
              </motion.g>
            ))}
          </g>
          
          {/* Center logo */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <rect x="108" y="108" width="40" height="40" rx="8" fill="#4F46E5" />
            <text x="128" y="136" textAnchor="middle" fill="white" fontWeight="bold" fontSize="20">QC</text>
          </motion.g>
        </motion.svg>
        
        {/* Scanning animation */}
        <motion.div 
          className="absolute inset-0 w-full h-1 bg-green-500 opacity-70"
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "linear"
          }}
        />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            disabled={paymentStep === 'processing'}
          >
            <X size={24} />
          </button>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-xl font-bold">Secure Payment</h2>
            <p className="text-blue-100">QuickCourt Booking</p>
            <div className="mt-2 text-2xl font-bold">₹{amount.toFixed(2)}</div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {paymentStep === 'options' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Select Payment Method</h3>
                
                {/* Payment options */}
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedMethod('upi')}
                    className={`w-full p-3 flex items-center border rounded-lg ${selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">U</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">UPI</div>
                      <div className="text-xs text-gray-500">Pay using any UPI app</div>
                    </div>
                    {selectedMethod === 'upi' && <Check size={20} className="text-blue-500" />}
                  </button>
                  
                  <button 
                    onClick={() => setSelectedMethod('card')}
                    className={`w-full p-3 flex items-center border rounded-lg ${selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">C</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-xs text-gray-500">All major cards accepted</div>
                    </div>
                    {selectedMethod === 'card' && <Check size={20} className="text-blue-500" />}
                  </button>
                  
                  <button 
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`w-full p-3 flex items-center border rounded-lg ${selectedMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">N</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Net Banking</div>
                      <div className="text-xs text-gray-500">All Indian banks supported</div>
                    </div>
                    {selectedMethod === 'netbanking' && <Check size={20} className="text-blue-500" />}
                  </button>
                </div>
                
                <button 
                  onClick={() => setPaymentStep('qr')}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mt-4"
                >
                  Continue
                </button>
              </div>
            )}
            
            {paymentStep === 'qr' && (
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">Scan QR Code to Pay</h3>
                <p className="text-sm text-gray-600">Use any UPI app to scan and pay</p>
                
                <QRCodeAnimation />
                
                <div className="text-sm text-gray-500 mt-2">UPI ID: quickcourt@ybl</div>
                
                <div className="flex space-x-3 mt-4">
                  <button 
                    onClick={() => setPaymentStep('options')}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={processPayment}
                    className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    I've Paid
                  </button>
                </div>
              </div>
            )}
            
            {paymentStep === 'processing' && (
              <div className="py-8 text-center">
                <Loader2 size={48} className="animate-spin mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">Processing Payment</h3>
                <p className="text-sm text-gray-600 mt-2">Please wait while we confirm your payment...</p>
              </div>
            )}
            
            {paymentStep === 'success' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Payment Successful!</h3>
                <p className="text-sm text-gray-600 mt-2">Your booking has been confirmed.</p>
                <p className="text-xs text-gray-500 mt-4">Transaction ID: QC{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};