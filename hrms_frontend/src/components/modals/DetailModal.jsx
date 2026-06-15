import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

const DetailModal = ({ isOpen, onClose, title, children, footer, maxWidth = "600px" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-bg-secondary border border-border-color rounded-lg shadow-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
          style={{ maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-border-color flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <button className="bg-transparent border-none text-2xl text-text-secondary cursor-pointer flex items-center justify-center transition-all hover:text-danger" onClick={onClose} aria-label="Close modal">
              <MdClose />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
          {footer && <div className="px-6 py-4 border-t border-border-color flex justify-end gap-3 bg-bg-primary">{footer}</div>}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DetailModal;
