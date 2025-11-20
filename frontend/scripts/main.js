// main.js – manejo del menú hamburguesa en mobile
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.querySelector(".menu-toggle");
    const main = document.querySelector(".main");

    if (!sidebar || !menuBtn || !main) return;

    let isOpen = false;

    const openMenu = () => {
        isOpen = true;
        sidebar.classList.add("sidebar-mobile-open");
        main.classList.add("sidebar-mobile-dim");
        menuBtn.classList.add("open");
    };

    const closeMenu = () => {
        isOpen = false;
        sidebar.classList.remove("sidebar-mobile-open");
        main.classList.remove("sidebar-mobile-dim");
        menuBtn.classList.remove("open");
    };

    menuBtn.addEventListener("click", () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Cerrar el menú al cambiar de sección en mobile
    const links = sidebar.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                closeMenu();
            }
        });
    });

    // Si agrandás a desktop, me aseguro que quede todo “normal”
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && isOpen) {
            closeMenu();
        }
    });
});
