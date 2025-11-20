document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.querySelector(".menu-toggle");
    const main = document.querySelector(".main");

    if (!sidebar || !menuBtn) return;

    let isOpen = false;

    menuBtn.addEventListener("click", () => {
        isOpen = !isOpen;

        if (isOpen) {
            sidebar.classList.add("sidebar-mobile-open");
            main.classList.add("sidebar-mobile-dim");
        } else {
            sidebar.classList.remove("sidebar-mobile-open");
            main.classList.remove("sidebar-mobile-dim");
        }
    });
});
