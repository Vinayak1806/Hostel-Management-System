import { Modal, Button } from './index'
import { AlertCircle } from 'lucide-react'

export const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirm Logout">
      <div className="flex flex-col items-center gap-4 py-4">
        <AlertCircle className="w-12 h-12 text-yellow-600" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Are you sure you want to logout?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You will need to sign in again to access your account.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Logging Out...' : 'Yes, Logout'}
        </Button>
      </div>
    </Modal>
  )
}

export default LogoutConfirmModal
