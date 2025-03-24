import Swal from "sweetalert2";
import "@sweetalert2/theme-dark"; // Optional: Dark theme

export const showSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonColor: "#3085d6",
    // background: "#222", // For dark theme
    // color: "#fff",
  });
};

export const showErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#d33",
  });
};

export const showConfirmAlert = async (message) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, do it!",
  });
  return result.isConfirmed;
};
