import React from 'react';
import { CloseIcon, ExclamationTriangleIcon } from './icons';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, confirmText, onConfirm, onCancel, isConfirming }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-base-200 dark:bg-dark-base-200 rounded-lg shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 dark:border dark:border-dark-base-300">
        <div className="p-5 flex items-start space-x-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
            <h3 className="text-xl font-bold text-content-primary dark:text-dark-content-primary" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-content-secondary dark:text-dark-content-secondary">
                {message}
              </p>
            </div>
          </div>
           <button onClick={onCancel} className="text-content-secondary dark:text-dark-content-secondary hover:text-red-500 transition-colors duration-300 -mt-2 -mr-2 p-1">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-base-100/50 dark:bg-dark-base-100/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:ring-offset-dark-base-200 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-base-300 dark:border-dark-base-300 bg-base-200 dark:bg-dark-base-200 px-4 py-2 text-base font-medium text-content-primary dark:text-dark-content-primary shadow-sm hover:bg-base-300 dark:hover:bg-dark-base-300 focus:outline-none focus:ring-2 focus:ring-brand-start dark:focus:ring-brand-dark focus:ring-offset-2 dark:ring-offset-dark-base-200 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
