// import { useState } from "react";

const BasicModal = ({ isOpen, onClose, onProceed, actionText }) => {
  return (
    <div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">{actionText}</p>
                <div
                  className="modal-close cursor-pointer z-50"
                  onClick={onClose}>
                  <svg
                    className="fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18">
                    <path
                      d="M6.293 6.293a1 1 0 011.414 0L9 7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 9l1.293 1.293a1 1 0 11-1.414 1.414L9 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 9 6.293 7.707a1 1 0 010-1.414z"
                      fillRule="evenodd"></path>
                  </svg>
                </div>
              </div>

              <p className="text-gray-700 mt-2">
                Do you wish to continue the {actionText} operation..?
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-4">
                  Cancel
                </button>
                <button
                  onClick={onProceed}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicModal;
