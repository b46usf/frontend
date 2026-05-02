import Swal from 'sweetalert2';

function themeColors() {
  const isDark = document.documentElement.dataset.theme === 'dark';

  return {
    background: isDark ? '#0D2541' : '#F8FAFC',
    color: isDark ? '#F8FAFC' : '#071A2F',
  };
}

export function showToast({ icon = 'success', title }) {
  return Swal.fire({
    toast: true,
    position: 'top',
    icon,
    title,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
    background: themeColors().background,
    color: themeColors().color,
    customClass: {
      popup: 'edusense-toast',
      title: 'edusense-toast-title',
      timerProgressBar: 'edusense-toast-progress',
    },
  });
}

export function showConfirmDialog(options) {
  return Swal.fire({
    showCancelButton: true,
    confirmButtonColor: '#155EEF',
    cancelButtonColor: '#64748B',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    background: themeColors().background,
    color: themeColors().color,
    buttonsStyling: false,
    customClass: {
      popup: 'edusense-modal',
      icon: 'edusense-modal-icon',
      title: 'edusense-modal-title',
      htmlContainer: 'edusense-modal-text',
      confirmButton: 'edusense-confirm',
      cancelButton: 'edusense-cancel',
      actions: 'edusense-actions',
    },
    ...options,
  });
}

export function showInfoDialog(options) {
  return Swal.fire({
    icon: 'info',
    confirmButtonColor: '#155EEF',
    confirmButtonText: 'OK',
    background: themeColors().background,
    color: themeColors().color,
    buttonsStyling: false,
    customClass: {
      popup: 'edusense-modal',
      icon: 'edusense-modal-icon',
      title: 'edusense-modal-title',
      htmlContainer: 'edusense-modal-text',
      confirmButton: 'edusense-confirm',
      actions: 'edusense-actions',
    },
    ...options,
  });
}
